const Appointment = require('../../models/appointment');
const Client = require('../../models/client');
const User = require('../../models/user');
const Service = require('../../models/service');
const Wallet = require('../../models/wallet');
const fonction = require('../../models/fonction');

async function home(req, res, next) {
    let page = 'Tableau de bord';
    let appointmentsList = null;
    if(!req.session.user.role){
      page = 'Liste de vos rendez-vous d\'aujourd\'hui';
      if(req.query.date_filtre !== undefined){
        appointmentsList = await Appointment.getListAppointmentByUser(req.session.user, req.query.date_filtre);
      }else{
        appointmentsList = await Appointment.getListAppointmentByUser(req.session.user, "");
      }
      res.render('pages/home', {layout: 'auth', title: 'Page d\'accueil', page, appointmentsList});
    }else{
      let dashboard = true;
      const date = new Date();
      const year = parseInt(date.getFullYear());
      const month = parseInt(date.getMonth() + 1);
      const listTotalAppointmentParJour = await Appointment.getListTotalAppointmentParJour(month, year);
      const listDayInMonth = fonction.getListDayInMonth(month, year);
      const moisEncours = fonction.getMoisEncours(date.getMonth());
      const nombreTotalClient = (await Client.find()).length;
      const nombreTotalUser = (await User.find({role: 0})).length;
      const nombreTotalService = (await Service.find()).length;
      const nombreTotalWallet = (await Wallet.find({validation: 0})).length;
      const listMonthStr = fonction.getListMonth();
      const listTotalAppointmentParMois = await Appointment.getListTotalAppointmentParMois(year);
      const listChiffreDaffaireParJour = await Appointment.getListChiffreDaffaireParJour(month, year);
      const listChiffreDaffaireParMois = await Appointment.getListChiffreDaffaireParMois(year);
      res.render('pages/home', {layout: 'auth', title: 'Page d\'accueil', page, dashboard, listTotalAppointmentParJour, listDayInMonth, moisEncours, nombreTotalClient, nombreTotalUser, nombreTotalService, nombreTotalWallet, listMonthStr, listTotalAppointmentParMois, listChiffreDaffaireParJour, listChiffreDaffaireParMois, year});
    }
}

function logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la suppression de la session :', err);
      } else {
        res.redirect('/');
      }
    });
  }

module.exports = {home, logout}