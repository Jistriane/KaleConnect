#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Rate(Symbol), // e.g., "XLM:BRL", "USDC:BRL"
}

#[derive(Clone)]
#[contracttype]
pub struct RateInfo {
    pub price: i128, // to_amount per 1 unit of base, scaled (e.g., 1e7)
    pub fee_bp: u32, // fee in basis points (1% = 100 bp)
}

#[contract]
pub struct RatesOracle;

#[contractimpl]
impl RatesOracle {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn set_rate(env: Env, pair: Symbol, price: i128, fee_bp: u32) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("not initialized");
        admin.require_auth();
        if price <= 0 {
            panic!("price must be > 0");
        }
        env.storage()
            .persistent()
            .set(&DataKey::Rate(pair), &RateInfo { price, fee_bp });
    }

    pub fn get_rate(env: Env, pair: Symbol) -> Option<RateInfo> {
        env.storage().persistent().get(&DataKey::Rate(pair))
    }
}

#[cfg(test)]
mod test {
    extern crate std;
    use super::*;
    use soroban_sdk::testutils::{Address as _};

    #[test]
    fn rates_flow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, RatesOracle);
        let admin = Address::generate(&env);
        
        // Facilita require_auth() em ambiente de teste
        env.mock_all_auths();

        // Use frames separados para evitar reautorização na mesma frame
        env.clone().as_contract(&contract_id, || {
            RatesOracle::init(env.clone(), admin.clone());
        });

        let pair = Symbol::new(&env, "xlm_brl");
        env.clone().as_contract(&contract_id, || {
            RatesOracle::set_rate(env.clone(), pair.clone(), 123_456_789, 25);
        });

        env.clone().as_contract(&contract_id, || {
            let r = RatesOracle::get_rate(env.clone(), pair.clone()).unwrap();
            assert_eq!(r.price, 123_456_789);
            assert_eq!(r.fee_bp, 25);
        });
    }
}
