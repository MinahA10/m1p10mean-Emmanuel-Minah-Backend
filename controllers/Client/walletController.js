const User = require('../../models/user');
const Wallets = require('../../models/wallet');

async function liste(req, res, next){
    const walletList = await Wallets.getAllWalletsNoValidation({validation: 0});
    res.render('pages/portefeuille/list', {layout: 'auth', title: 'Portefeuille non validé', page: 'Liste des portefeuilles en attente de validation', walletList})
}

async function ajaxWallet(req, res, next){
    const id = req.params.id;
    const walletSimple = await Wallets.getSimpleWallet({_id: id});
    res.json(walletSimple);
}

async function confirmWallet(req, res, next){
    const id = req.body.walletsId;
    const dataWallet = {
        validation: 1,
        updatedAt: new Date()
    };
    await Wallets.findByIdAndUpdate(id, dataWallet, {new: true});
    res.redirect('/auth/liste-portefeuille');
}

async function creditWallet(req, res, next){
    const dataWallet = {
        clientsId: req.body.clientsId,
        validation: 0,
        credit: req.body.montant,
        debit: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    try{
        const modelWallet = new User(dataWallet);
        await modelWallet.save();
        res.json({response: true});
    }catch(err){
        throw Error('Error insert wallet');
    }
}

module.exports = {liste, ajaxWallet, confirmWallet, creditWallet};