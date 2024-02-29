function page(req, res, next){
    res.render('pages/horaire/horaire', {layout: 'auth', title: 'Gestion heure de travail', page: 'Heure de travail'});
}

module.exports = {page};