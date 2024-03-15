//import { consultationDurationType } from "../modules/consultations/consultations.dto"



const constant = {
    password: {
        minLength: 7,

    },
    fname: {
        minLength: 3,
        maxLength: 20,
    },
    accountName: {
        minLength: 5,

    },
    tableName: {
        ai_kyc_document_validation_progress: "ai_kyc_document_validation_progress",
        users: "users",
        reference_user: "reference_user",
        country: "country",
        referral_transaction: "referral_transaction",
        customer_wallet: "customer_wallet",
        platform_miner: "platform_miner",
        customer_address: 'customer_address',
        customer_address_history_log: "customer_address_history_log"
    },


}



module.exports = {
	constant: constant,
}

