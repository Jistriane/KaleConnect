#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Counter,
    Remit(u128),
}

#[derive(Clone)]
#[contracttype]
pub struct RemitInfo {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
    pub status: Symbol, // "pending" | "settled" | "failed" | ...
}

#[contract]
pub struct Remittance;

#[contractimpl]
impl Remittance {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Counter, &0u128);
    }

    pub fn create(env: Env, from: Address, to: Address, amount: i128) -> u128 {
        from.require_auth();
        if amount <= 0 {
            panic!("amount must be > 0");
        }
        let mut id: u128 = env
            .storage()
            .instance()
            .get(&DataKey::Counter)
            .unwrap_or(0u128);
        id += 1;
        env.storage().instance().set(&DataKey::Counter, &id);

        let info = RemitInfo {
            from,
            to,
            amount,
            status: Symbol::new(&env, "pending"),
        };
        env.storage().persistent().set(&DataKey::Remit(id), &info);
        id
    }

    pub fn get(env: Env, id: u128) -> Option<RemitInfo> {
        env.storage().persistent().get(&DataKey::Remit(id))
    }

    pub fn set_status(env: Env, id: u128, status: Symbol) {
        // Only admin can update arbitrarily
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("not initialized");
        admin.require_auth();

        let mut info: RemitInfo = env
            .storage()
            .persistent()
            .get(&DataKey::Remit(id))
            .expect("remit not found");
        info.status = status;
        env.storage().persistent().set(&DataKey::Remit(id), &info);
    }
}

#[cfg(test)]
mod test {
    extern crate std;
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};

    #[test]
    fn flow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Remittance);
        let admin = Address::generate(&env);
        let from = Address::generate(&env);
        let to = Address::generate(&env);

        env.ledger().with_mut(|l| l.timestamp = 1);

        env.clone().as_contract(&contract_id, || {
            Remittance::init(env.clone(), admin.clone());

            from.require_auth_for_args(soroban_sdk::vec![&env]);
            let id = Remittance::create(env.clone(), from.clone(), to.clone(), 10);
            let info = Remittance::get(env.clone(), id).unwrap();
            assert_eq!(info.amount, 10);
            assert_eq!(info.status, Symbol::new(&env, "pending"));

            admin.require_auth_for_args(soroban_sdk::vec![&env]);
            Remittance::set_status(env.clone(), id, Symbol::new(&env, "settled"));
            let info2 = Remittance::get(env.clone(), id).unwrap();
            assert_eq!(info2.status, Symbol::new(&env, "settled"));
        });
    }
}
