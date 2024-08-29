export function getLocalExams() {
    let storedExams = localStorage.getItem('data');

    if (storedExams) {
        storedExams =  JSON.parse(storedExams)[0].exams;
        const examNames = storedExams.map(s => ({ id: s._id, name: s.name }));
        return examNames;
    } else {
        return null;
    }
}

export function getAreas(){
    const list = [
    {value:"B2B",name:"B2B"},
    {value:"CARDIOLOGY",name:"Cardiology"},
    {value:"BIOCHEMISTRY",name:"Biochemistry"},
    {value:"COAGULOGRAM",name:"Coagulogram"},
    {value:"CYTOLOGY",name:"Cytology"},
    {value:"DERMATOLOGY",name:"Dermatology"},
    {value:"ENDOCRINOLOGY",name:"Endocrinology"},
    {value:"GASTROENTEROLOGY",name:"Gastroenterology"},
    {value:"HEMATOLOGY",name:"Hematology"},
    {value:"HISTOPATHOLOGY", name :"Histopathology Pathology"},
    {value:"IMMUNOLOGY",name:"Immunology"},
    {value:"BIOPHYSICS",name:"Biophysics"},
    {value:"MICROBIOLOGY",name:"Microbiology"},
    {value:"MOLECULAR_GENETICS",name:"Molecular Genetics"},
    {value:"NEUROLOGY",name:"Neurology"},
    {value:"ONCOLOGY",name:"Oncology"},
    {value:"OPHTHALMOLOGY",name:"Ophthalmology"},
    {value:"OTHERS",name:"Others"},
    {value:"PARASITOLOGY",name:"Parasitology"},
    {value:"SIGNALS",name:"Signals"},
    {value:"TUBE_SORTERS",name:"Tube Sorters"},
    {value:"TOXICOLOGY",name:"Toxicology"},
    {value:"URINALYSIS",name:"Urinalysis"},
    {value:"VIROLOGY",name:"Virology"}]
    
    return list;

}