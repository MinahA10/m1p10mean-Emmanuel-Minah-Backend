const mongoose = require('mongoose');

const fonction = require('./fonction');

const appointmentSchema = new mongoose.Schema({
    datetimeStart: { type: Date, required: true },
    datetimeEnd: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      default: "pending"
    },
    montant: { type: Number },
    services: {
      type: Array,
      default: []
    },
    employee: {
      type: Array,
      default: []
    },
    client: {type: String},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()}
  });

const Appointment = mongoose.model('appointments', appointmentSchema);

module.exports = Appointment;

module.exports.getVerifyDispoEmploye = async (employeeId, dateAppointment) => {
  try {
  
      const appointments = await Appointment.find({
          "employee": employeeId,
          "datetimeStart": { $lte: new Date(dateAppointment) },
          "datetimeEnd": { $gt: new Date(dateAppointment) }
      });

      console.log(appointments.length);

      if (appointments.length > 0) {
         
          throw new Error("L'employé est déjà occupé à ce moment.");
      } else {
          return true; // L'employé est disponible
      }
  } catch (error) {
      throw error;
  }
}

module.exports.getListAppointmentByUser = async (user, date) => {
  try {
    let appointmentsList = null;
    if(date.length > 0){
      appointmentsList = await Appointment.find({ 
        employee: user._id, 
        createdAt: {
          $gte: fonction.getDateFromDateTime(date),
          $lt: new Date(fonction.getDateFromDateTime(date).getTime() + 24 * 60 * 60 * 1000)
        }}
      ).lean();
    }else{
      appointmentsList = await Appointment.find({ 
        employee: user._id, 
        createdAt: {
          $gte: fonction.getDateFromDateTime(''),
          $lt: new Date(fonction.getDateFromDateTime('').getTime() + 24 * 60 * 60 * 1000)
      }}).lean();
    }
    return appointmentsList;
  } catch (err) {
    console.error("Error in getListAppointmentByUser:", err);
    throw err;
  }
}

async function getTotalAppointmentsByDate(date1, date2) {
  try {
    let startOfDay = new Date(date1);
    startOfDay.setHours(0, 0, 0, 0);
    let endOfDay = date2.length == 0 ? new Date(date1) : new Date(date2);
    endOfDay.setHours(23, 59, 59, 999);
    const appointments = await Appointment.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    return appointments
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    throw error;
  }
}

module.exports.getListTotalAppointmentParJour = async (mois, annee) => {
    const listDate = fonction.getListDateInMonth(mois, annee);
    const listNombreTotalReservation = [];
    for(let date of listDate){
      let nombreTotalReservation = await getTotalAppointmentsByDate(date, "");
      listNombreTotalReservation.push(nombreTotalReservation.length);
    }
    return listNombreTotalReservation;
}

module.exports.getListTotalAppointmentParMois = async (annee) => {
  const listTotalAppointmentParMois = [];
  const listDateDebutDuMois = fonction.getListDateDebutEtFinDuMois(annee, fonction.getDateDebutMonth);
  const listDateFinDuMois = fonction.getListDateDebutEtFinDuMois(annee, fonction.getDateFinMonth);
  for(let i = 0; i < listDateDebutDuMois.length; i++){
    let nombreTotalReservation = await getTotalAppointmentsByDate(listDateDebutDuMois[i], listDateFinDuMois[i]);
    listTotalAppointmentParMois.push(nombreTotalReservation.length);
  }
  return listTotalAppointmentParMois;
}

  