const { connectToDatabase } = require('../db');
const mongoose = require('mongoose');
const {Interface} = require('../models/interfaceModel');
const { faker } = require('@faker-js/faker');

// Funções para gerar dados randômicos
const randomIp = () => `127.0.0.1`;
const randomPort = () => Math.floor(Math.random() * (65535 - 1024) + 1024);
const randomDeviceId = () => `DV_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
const randomMode = () => Math.random() > 0.5 ? 'TCP' : 'SERIAL';
const randomRole = () => Math.random() > 0.5 ? 'server' : 'client';
const randomProtocol = () => Math.random() > 0.5 ? 'HL7' : 'ASTM';
const randomArea = () => {
  const areas = [
    "IMMUNOLOGY", "HEMATOLOGY", "CLINICAL_BIOCHEMISTRY", "MICROBIOLOGY", "ENDOCRINOLOGY", "CARDIOLOGY", 
    "ONCOLOGY", "COAGULOGRAM", "OTHERS"
  ];
  return areas[Math.floor(Math.random() * areas.length)];
};
const randomTestLevel = () => ['1', '2', '3'][Math.floor(Math.random() * 3)];
const randomStatus = () => Math.random() > 0.5 ? 'active' : 'inactive';

// Função para gerar exames fake
const generateExams = (numExams = 5) => {
  const exams = [];
  for (let i = 0; i < numExams; i++) {
    exams.push({
      name: generateRandomLabTest(),
      code: generatTest(),
      externalCode: faker.lorem.word(),
      material: generatSampleType(),
      test: {
        code: generatTest(),
        externalCode: faker.lorem.word()
      },
      param: {
        code: faker.lorem.word(),
        externalCode: faker.lorem.word()
      }
    });
  }
  return exams;
};



const generateRandomLabTest = () => {
    const prefixes = ['Blood', 'Urine', 'Serum', 'Plasma', 'Tissue', 'Sputum'];
    const tests = ['Glucose', 'Cholesterol', 'Creatinine', 'Hemoglobin', 'ALT', 'AST', 'Bilirubin'];
    const suffixes = ['Test', 'Level', 'Analysis', 'Measurement'];

    const prefix = faker.helpers.arrayElement(prefixes);
    const test = faker.helpers.arrayElement(tests);
    const suffix = faker.helpers.arrayElement(suffixes);

    return `${prefix} ${test} ${suffix}`;
};


const generateEquipments = () => {

    const prefixes = ['Sysmex', 'Cobas', 'Abbott', 'Roche', 'Siemens', 'Mindray', 'HemoCue', 'Beckman Coulter', 'Bio-Rad'];
    const types = ['Analyzer', 'Reader', 'System', 'Counter', 'Monitor', 'Module', 'Detector'];
    const suffixes = ['X1000', 'S500', 'T200', 'M300', 'G450', 'Z800', 'DX200'];
    
    const prefix = faker.helpers.arrayElement(prefixes);
    const type = faker.helpers.arrayElement(types);
    const suffix = faker.helpers.arrayElement(suffixes);

    return `${prefix} ${type} ${suffix}`;
};


const generateBrand = () => {

    const prefixes = ['Sysmex', 'Cobas', 'Abbott', 'Roche', 'Siemens', 'Mindray', 'HemoCue', 'Beckman Coulter', 'Bio-Rad'];
    const prefix = faker.helpers.arrayElement(prefixes);
    
    return `${prefix}`;
};

const generateModel = () => {

    const suffixes = ['X1000', 'S500', 'T200', 'M300', 'G450', 'Z800', 'DX200'];
    
    const suffix = faker.helpers.arrayElement(suffixes);

    return `${suffix}`;
};


const generatTest = () => {
    const tests = ['Glucose', 'Cholesterol', 'Creatinine', 'Hemoglobin', 'ALT', 'AST', 'Bilirubin'];

    const test = faker.helpers.arrayElement(tests);

    return `${test}`;
};

const generatSampleType = () => {
    const samples = ['serum', 'plasm', 'blood'];

    const sample = faker.helpers.arrayElement(samples);

    return `${sample}`;
};


// Função para inserir novas interfaces com dados fake
const insertFakeInterfaces = async () => {
  try {
    // Conectar ao MongoDB
    await connectToDatabase();

    // Definir a quantidade de interfaces que deseja inserir
    const numberOfInterfaces = 5;

    // Criar um array de novas interfaces
    const newInterfaces = [];

    for (let i = 0; i < numberOfInterfaces; i++) {
      const newInterface = {
        name: generateEquipments().toUpperCase(),
        brand: generateBrand().toUpperCase(),
        model: generateModel(),
        code: faker.commerce.product().toUpperCase(),
        area: randomArea().toUpperCase(),
        testLevel: randomTestLevel(),
        devices: [
          {
            deviceId: randomDeviceId().toUpperCase(),
            ip: randomIp(),
            role:randomRole(),
            port: randomPort().toString(),
            mode: randomMode(),
            protocol: randomProtocol(),
            fieldMappings: {
              patientName: "5",
              patientSex: "8",
              patientDateOfBirth: "7",
              sampleType: "5",
              barCode: "2",
              test: "3",
              value: "4",
              unit: "5",
              flags: "7"
            },
            status: randomStatus(),
          },
          {
            deviceId: randomDeviceId().toUpperCase(),
            ip: randomIp(),
            role:randomRole(),
            port: randomPort().toString(),
            mode: randomMode(),
            protocol: randomProtocol(),
            fieldMappings: {
              patientName: "5",
              patientSex: "8",
              patientDateOfBirth: "7",
              sampleType: "5",
              barCode: "2",
              test: "3",
              value: "4",
              unit: "5",
              flags: "7"
            },
            status: randomStatus(),
          }
        ],
        exams: generateExams(),
        active: Math.random() > 0.5,
        actualSetup: faker.commerce.productDescription(),
        createdBy: "66ccda2ad15cf0ba1e7217fe",  // Isso é apenas um exemplo, substitua por um usuário válido
      };

      newInterfaces.push(newInterface);
    }

    // Inserir as novas interfaces no banco de dados
    const result = await Interface.insertMany(newInterfaces);
    console.log(`${result.length} novas interfaces inseridas com sucesso.`);
  } catch (err) {
    console.error(`Erro ao inserir novas interfaces: ${err.message}`);
  } finally {
    // Fechar a conexão após a operação
    mongoose.connection.close();
  }
};

// Chamar a função para inserir novas interfaces
insertFakeInterfaces();
