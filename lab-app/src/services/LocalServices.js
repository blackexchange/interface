export function getLocalExams() {
    let storedExams = localStorage.getItem('data');

    if (storedExams) {
        storedExams =  JSON.parse(storedExams)[0].exams;
    console.log(storedExams)

        const examNames = storedExams.map(s => ({ _id: s._id, code: s.code, name: s.name, material: s.material }));
        return examNames;
    } else {
        return null;
    }
}

export function getMaterials(){
    const materials = [
        {
            "code": "BLD",
            "name": "Sangue Total",
            "area": "Hematologia"
        },
        {
            "code": "SER",
            "name": "Soro",
            "area": "Bioquímica Clínica"
        },
        {
            "code": "PLS",
            "name": "Plasma",
            "area": "Imunologia"
        },
        {
            "code": "CBL",
            "name": "Gotas de Sangue Capilar",
            "area": "Microbiologia"
        },
        {
            "code": "URN",
            "name": "Urina de Jato Médio",
            "area": "Uroanálise"
        },
        {
            "code": "UR24",
            "name": "Urina 24 Horas",
            "area": "Bioquímica Clínica"
        },
        {
            "code": "FEC",
            "name": "Fezes Frescas",
            "area": "Parasitologia"
        },
        {
            "code": "FCN",
            "name": "Fezes Conservadas",
            "area": "Microbiologia"
        },
        {
            "code": "SLV",
            "name": "Saliva Estimulada",
            "area": "Endocrinologia"
        },
        {
            "code": "SNL",
            "name": "Saliva Não Estimulada",
            "area": "Toxicologia"
        },
        {
            "code": "SNR",
            "name": "Secreção Nasal",
            "area": "Microbiologia"
        },
        {
            "code": "SOR",
            "name": "Secreção Orofaríngea",
            "area": "Imunologia"
        },
        {
            "code": "SVG",
            "name": "Secreção Vaginal",
            "area": "Citologia"
        },
        {
            "code": "SUR",
            "name": "Secreção Uretral",
            "area": "Microbiologia"
        },
        {
            "code": "LCR",
            "name": "Líquido Cefalorraquidiano",
            "area": "Microbiologia"
        },
        {
            "code": "LPL",
            "name": "Líquido Pleural",
            "area": "Patologia"
        },
        {
            "code": "LPT",
            "name": "Líquido Peritoneal",
            "area": "Patologia"
        },
        {
            "code": "LSY",
            "name": "Líquido Sinovial",
            "area": "Patologia"
        },
        {
            "code": "BPS",
            "name": "Biópsias de Pele",
            "area": "Oncologia"
        },
        {
            "code": "BPO",
            "name": "Biópsias de Órgãos Internos",
            "area": "Patologia"
        },
        {
            "code": "CYA",
            "name": "Citologia Aspirativa",
            "area": "Citologia"
        },
        {
            "code": "HAIR",
            "name": "Mechas de Cabelo",
            "area": "Toxicologia"
        },
        {
            "code": "NAIL",
            "name": "Amostras de Unhas",
            "area": "Endocrinologia"
        },
        {
            "code": "ESP",
            "name": "Esfregaço de Cérvix",
            "area": "Citologia"
        },
        {
            "code": "ESP",
            "name": "Esfregaço de Pele",
            "area": "Microbiologia"
        },
        {
            "code": "AMN",
            "name": "Líquido Amniótico",
            "area": "Genética"
        },
        {
            "code": "AQU",
            "name": "Humor Aquoso",
            "area": "Oftalmologia"
        },
        {
            "code": "VIT",
            "name": "Humor Vítreo",
            "area": "Oftalmologia"
        }
    ]
    
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
