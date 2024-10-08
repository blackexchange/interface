const mongoose = require('mongoose');
require('dotenv').config();

// URL de conexão com o MongoDB
//const mongoURI = process.env.MONGO_URI || 'mongodb://admin:admin123@127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/lab?replicaSet=rs0&authSource=admin';
//const mongoURI = process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/lab?replicaSet=rs0&authSource=admin';

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://health:cyberia@cluster0.cjmwf.mongodb.net/lab';
console.log(mongoURI)
// Configurações de conexão
const options = {
    //useUnifiedTopology: true,
    //useNewUrlParser: true, // Opção recomendada para evitar depreciações
    // Se necessário, você pode adicionar autenticação
    //user: process.env.DB_USER || 'root',
    //pass: process.env.DB_PWD || '',
};

// Função de conexão com o MongoDB
const connectToDatabase = async () => {
    try {
        console.log('Conectando ao Banco de Dados...');

        await mongoose.connect(mongoURI, options);
        console.log('MongoDB connected successfully');

        // Captura eventos de conexão do mongoose.connection (opcional)
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to the database');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from the database');
        });

    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Sai do processo caso não consiga conectar
    }
};

// Exporta a função de conexão para uso em outros arquivos
module.exports = { connectToDatabase };
