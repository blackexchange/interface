const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    
    codes: [{
        system: String,
        code: String
    }],

    name: {
        type: String,
        required:true
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

    material: {
        type: String
    },


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
examSchema.path('code').index({unique:true});
examSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Interface = mongoose.model('Interface', examSchema);

module.exports = {Interface, examSchema};
