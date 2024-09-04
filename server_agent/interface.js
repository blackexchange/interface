const mongoose = require('mongoose');

const interfaceSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required:true
    },

    brand: String,
    model: String,

    code: {
        type: String,
        required:true,
        unique: true
    },

    area:{
        type: String,
        enum: [
            "IMMUNOLOGY",
            "HEMATOLOGY",
            "CLINICAL_BIOCHEMISTRY",
            "MICROBIOLOGY",
            "OPHTHALMOLOGY",
            "ENDOCRINOLOGY",
            "MOLECULAR_GENETICS",
            "URINALYSIS",
            "MEDICAL_BIOPHYSICS",
            "CARDIOLOGY",
            "GASTROENTEROLOGY",
            "TOXICOLOGY",
            "PARASITOLOGY",
            "HISTOPATHOLOGY_PATHOLOGY",
            "VIROLOGY",
            "CYTOLOGY",
            "DERMATOLOGY",
            "NEUROLOGY",
            "ONCOLOGY",
            "SIGNALS",
            "TUBE_SORTERS",
            "B2B",
            "COAGULOGRAM",
            "OTHERS"
        ]
    },

    protocol: {
        type: String,
        enum: ["HL7", "ASTM","OTHERS"]
    },
    testLevel: {
        type:String, 
        enum: ["1","2","3"]
    },
    devices:[
        {deviceId: { type: String, required: true }},
        {ip: { type: String, required: true }},
        {port: { type: String, required: true }},
        {protocol: { type: String, required: true }},
        {status: { type: String, required: true, enum: ['active', 'inactive'] }}
    ],

    exams:[{
        name:String, 
        code: String,
        externalCode: String,
        material: String,

        test:{
            code: String,
            externalCode: String
        },

        param:{
            code: String,
            externalCode: String
        },
    }],

    active: Boolean,

    actualSetup: String,

    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referência ao modelo User
        required: true
    },


    updatedAt: {
        type: Date,
        default: Date.now
    }
});
interfaceSchema.path('code').index({unique:true});
interfaceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Interface = mongoose.model('Interface', interfaceSchema);

module.exports = {Interface, interfaceSchema};
