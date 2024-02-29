const mongoose = require('mongoose');

const ServicesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

const Services = mongoose.model("services", ServicesSchema);

module.exports = Services;

module.exports.getAllServices = async () => {
    try{
       const servicesList = await Services.find().lean();
       return servicesList;
    }catch(err){
        console.log("Error get all service");
    }
}
