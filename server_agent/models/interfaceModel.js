const mongoose = require('mongoose');

const fieldMappingsSchema = new mongoose.Schema({
    patientName: { type: String, default: "5" },
    patientSex: { type: String, default: "8" },
    patientDateOfBirth: { type: String, default: "7" },
    sampleType: { type: String, default: "5" },
    barCode: { type: String, default: "2" },
    test: { type: String, default: "3" },
    value: { type: String, default: "4" },
    unit: { type: String, default: "5" },
    flags: { type: String, default: "7" }
  });

const deviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    role:{ type: String, enum: ["server", "client"], required: true },
    port: { type: String, required: true },
    mode: { type: String, enum: ["TCP", "SERIAL", "FILE"], required: true },
    protocol: { type: String, enum: ["HL7", "ASTM", "OTHERS"] },
    fieldMappings: { type: fieldMappingsSchema, default: () => ({}) },
    status: { type: String, required: true, enum: ['active', 'inactive'] }
});


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

    
    testLevel: {
        type:String, 
        enum: ["1","2","3"]
    },

    devices: [deviceSchema],

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
interfaceSchema.path('code').index();
interfaceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Interface = mongoose.model('Interface', interfaceSchema);

module.exports = {Interface, interfaceSchema, fieldMappingsSchema};
