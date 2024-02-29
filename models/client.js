const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  email:{ type: String, unique: true, required: true ,
    validate: {
      validator: (value) => /.+@.+\..+/.test(value),
      message: 'Email validation failed'
  }},
  contact: { type: String, required: [true, 'User phone number required']
  },
  address:{type: String},
  password: { type: String, required: true },
  appointments: {
    type: Array,
    default: []
  },
  employee_prefer: {
    type: Array,
    default: []
  },
  service_prefer: {
    type: Array,
    default: []
  },
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()}
});

clientSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

clientSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const Client = mongoose.model('clients', clientSchema);

module.exports = Client;
