const Services = require("../../models/service");

async function list(req, res, next) {
    try{
        const servicesList = await Services.getAllServices();
        res.render('pages/services/list', {layout: 'auth', title: 'Liste des services', page: 'Liste des services', servicesList});
    }catch(err){
        res.status(500).render("pages/error/error-500")
    }
}

async function created(req, res, next) {
    if (req.files) {
        const urlApp = req.protocol + '://' + req.get('host');
        const fileName = req.files[0].filename;
        const dataService = {
            name: req.body.name,
            price: req.body.price,
            duration: req.body.duration,
            commission: req.body.commission,
            type: req.body.type,
            images: urlApp+'/images/services/'+ fileName,
        }
        try{
            const serviceModel = new Services(dataService);
            await serviceModel.save();
            res.redirect('/auth/services');
        }catch(err){
            res.status(500).render("pages/error/error-500")
        }
    } else {
        res.send('pages/error/error-500');
    }
}

async function ajaxSimpleServices(req, res, next){
    const id = req.params.id;
    try{
        const service = await Services.findOne({_id: id});
        res.json(service);
    }catch(err){
        res.render("Error ajax update service");
    }
}

async function suppressionService(req, res, next){
    const id = req.body.servicesId;
    try{
        await Services.deleteOne({_id: id});
        res.redirect('/auth/services');
    }catch(err){
        res.render("Error delete service");
    }
}

async function modificationServices(req, res, next){
    const id = req.body.servicesId;
    const simpleService = await Services.findOne({_id: id});
    let dataService = {};
    if (req.files.length) {
        const urlApp = req.protocol + '://' + req.get('host');
        const fileName = req.files[0].filename;
        dataService = {
            name: req.body.name,
            price: req.body.price,
            duration: req.body.duration,
            commission: req.body.commission,
            type: req.body.type,
            images: urlApp+'/images/services/'+ fileName,
            createdAt: simpleService.createdAt,
            updatedAt: new Date()
        };
    }else{
        dataService = {
            name: req.body.name,
            price: req.body.price,
            duration: req.body.duration,
            commission: req.body.commission,
            type: req.body.type,
            images: simpleService.images,
            createdAt: simpleService.createdAt,
            updatedAt: new Date()
        };
    }
    await Services.findByIdAndUpdate(id, dataService, {new: true});
    res.redirect('/auth/services');
}

module.exports = {list, created, ajaxSimpleServices, suppressionService, modificationServices};