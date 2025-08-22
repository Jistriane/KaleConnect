#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    UserStatus(Address),
}

#[contract]
pub struct KycRegistry;

#[contractimpl]
impl KycRegistry {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn start(env: Env, user: Address) {
        // o próprio usuário inicia seu KYC
        user.require_auth();
        env.storage()
            .persistent()
            .set(&DataKey::UserStatus(user), &Symbol::new(&env, "pending"));
    }

    pub fn set_status(env: Env, user: Address, status: Symbol) {
        // somente admin altera para approved/rejected/etc
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("not initialized");
        admin.require_auth();
        env.storage()
            .persistent()
            .set(&DataKey::UserStatus(user), &status);
    }

    pub fn get_status(env: Env, user: Address) -> Option<Symbol> {
        env.storage().persistent().get(&DataKey::UserStatus(user))
    }
}

#[cfg(test)]
mod test {
    extern crate std;
    use super::*;
    use soroban_sdk::testutils::{Address as _};

    #[test]
    fn kyc_flow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, KycRegistry);
        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        env.as_contract(&contract_id, || {
            KycRegistry::init(env.clone(), admin.clone());

            user.require_auth_for_args(soroban_sdk::vec![&env]);
            KycRegistry::start(env.clone(), user.clone());
            assert_eq!(
                KycRegistry::get_status(env.clone(), user.clone()).unwrap(),
                Symbol::new(&env, "pending")
            );

            admin.require_auth_for_args(soroban_sdk::vec![&env]);
            KycRegistry::set_status(env.clone(), user.clone(), Symbol::new(&env, "approved"));
            assert_eq!(
                KycRegistry::get_status(env, user).unwrap(),
                Symbol::new(&env, "approved")
            );
        });
    }
}
