const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const jwtService = require('../../services/jwtService');
const fonction = require('../../models/fonction');
const { title } = require('process');

// exports.login = async (req, res, next) => {
//   const { name, password } = req.body;

//   try {
//     const employe = await User.findOne({ name });

//     if (!employe) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     const isPasswordValid = await employe.comparePassword(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     const jwtSecret = jwtService.generateJWTSecret();
//     const token = jwt.sign({ employeId: employe._id }, jwtSecret , {
//       expiresIn: '1h',
//     });

//     res.json({ token });
//   } catch (error) {
//     console.error('Error in login:', error);
//     next(error);
//   }
// };

async function register(req, res, next) {
    const urlApp = req.protocol + '://' + req.get('host');
    const fileName = req.files[0].filename;
    const speciality = req.body.speciality || [];
    const dataUser = {
      firstName: req.body.firstName.trim().toUpperCase(),
      lastName: fonction.ucwords(req.body.lastName.trim()),
      email: req.body.email.trim(),
      password: '123456',
      contact: fonction.listContact(req.body.contact1.trim(), req.body.contact2.trim()),
      photo: urlApp+'/images/users/'+ fileName,
      speciality: speciality,
    };
      try{
        const userModel = new User(dataUser);
        await userModel.save();
        res.redirect('/auth/employes');
    }catch(err){
        res.status(500).render("pages/error/error-500");
    }
};

async function listEmployes(req, res, next) {
  try {
    const employes = await User.find({role: 0}).lean();
    res.render('pages/employes/list',  { layout: "auth", title: "Page liste employé", page: "Liste des employés", employes});

  } catch (error) {
    console.error(error);
    next(error);
  }
};

async function updatePhoto(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Aucun fichier téléchargé.');
  }
  const urlApp = req.protocol + '://' + req.get('host');
  const fileName = file.filename;
  const dataUser = {
    photo: urlApp+'/images/users/'+ fileName,
    updatedAt: new Date()
  };
  await User.findByIdAndUpdate(req.session.user._id, dataUser, {new: true});
  req.session.user = await User.findOne({_id: req.session.user._id}).lean();
  res.json({resultat: true});
}

function profile(req, res, next){
  res.render('pages/profile/profile', {layout: 'auth', title: 'Page de profile', page: 'Page de votre profile'});
}

function getSimpleUser(req, res, next){
  return res.json(req.session.user);
}

async function updateProfileUser(req, res, next){
  const contactList = fonction.listContact(req.body.contact1.trim(), req.body.contact2.trim());
  const speciality = fonction.isArray(req.body.speciality);
  const dataUser = {
    firstName: req.body.firstName.trim().toUpperCase(),
    lastName: fonction.ucwords(req.body.lastName.trim()),
    contact: fonction.deleteElement(req.session.user.contact, contactList),
    speciality: fonction.deleteElement(req.session.user.speciality, speciality),
    updatetAt: new Date()
  };
  try{
    await User.findByIdAndUpdate(req.session.user._id, dataUser, {new: true});
    req.session.user = await User.findOne({_id: req.session.user._id}).lean();
    res.redirect('/auth/profile');
  }catch(err){
      res.status(500).render("pages/error/error-500");
  }
}

async function ajaxSimpleuser(req, res, next){
  const id = req.params.id;
  const user = await User.findOne({_id: id});
  res.json(user);
}

async function updatedStatus(req, res, next){
  let status = req.body.statusUser==1 ? 0 : 1;
  const dataUser = {
    statut: status,
    updatedAt: new Date()
  };
  await User.findByIdAndUpdate(req.body.usersId, dataUser, {new: true});
  res.redirect('/auth/employes');
}

module.exports = {register, listEmployes, profile, updatePhoto, getSimpleUser, updateProfileUser, ajaxSimpleuser, updatedStatus};
