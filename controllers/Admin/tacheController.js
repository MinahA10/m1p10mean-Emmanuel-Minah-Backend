function page(req, res, next){
    res.render('pages/taches/list', {layout: 'auth', title: 'Gestion des tâche', page: 'Liste des tâches'});
}

module.exports = {page};