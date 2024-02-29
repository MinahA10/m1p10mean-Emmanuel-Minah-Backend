const mongoose = require('mongoose');
const fonction = require('./fonction');
const Client = require('./client');

const walletSchema = new mongoose.Schema({
    clientsId: {type: String, required: true},
    validation: {type: Number, default: 0},
    credit: {type: Number, required: true},
    debit: {type: Number, required: true},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()}
});

const Wallets = mongoose.model('wallets', walletSchema);

module.exports = Wallets;

module.exports.getAllWalletsNoValidation = async (objectWhere) => {
    try{
        const walletList = await Wallets.find(objectWhere).lean();
        const clientList = await Client.find().lean();
        
        const dataCombine = walletList.map(wallet => {
            const clients = clientList.reduce((acc, client) => {
                if (client._id.toString() === wallet.clientsId.toString()) {
                    acc = client;
                }
                return acc;
            }, {});
            return { ...wallet, clients };
        });
        
        return dataCombine;

    }catch(err){
        throw Error('Error to get all wallet no validation');
    }
}

module.exports.getSimpleWallet = async (objectWhere) => {
    try{
        const wallet = await Wallets.findOne(objectWhere).lean();
        const clientList = await Client.find().lean();
        const clients = clientList.reduce((acc, client) => {
            if (client._id.toString() === wallet.clientsId.toString()) {
                acc = client;
            }
            return acc;
        }, {});
        return {...wallet, clients};
    }catch(err){
        throw Error('Error to get simple wallet');
    }
}

async function getAllCreditOrDebit(objectWhere){
    try{
        return await Wallets.find(objectWhere).lean();
    }catch(err){
        throw Error('Error to get all credit or debit');
    }
}

function getAllValueCreditOrDebit(creditOrDebitList, options){
    const creditOrDebitArray = [];
    if(options === "credit"){
        creditOrDebitList.forEach(creditOrDebit => {
            creditOrDebitArray.push(creditOrDebit.credit);
        });
    }else{
        creditOrDebitList.forEach(creditOrDebit => {
            creditOrDebitArray.push(creditOrDebit.debit);
        });
    }
    return creditOrDebitArray;
}

module.exports.getSolde = async (clientsId) => {
    const creditOrDebitList = await getAllCreditOrDebit({clientsId: clientsId, validation: 1});
    const totalCredit = fonction.somme(getAllValueCreditOrDebit(creditOrDebitList, 'credit'));
    const totalDebit = fonction.somme(getAllValueCreditOrDebit(creditOrDebitList, 'debit'));
    return totalCredit - totalDebit;
}


