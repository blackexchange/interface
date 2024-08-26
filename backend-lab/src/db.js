const mongoose = require('mongoose');

// URL de conexão com o MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lab';

// Configurações de conexão
const options = {
    //useUnifiedTopology: true,
    // Se necessário, você pode adicionar autenticação
//    user: process.env.DB_USER || 'root',
  //  pass: process.env.DB_PWD || '',
};

// Conectando ao MongoDB
mongoose.connect(mongoURI, options)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Sai do processo caso não consiga conectar
    });

// Exporta a conexão do Mongoose para uso em outros arquivos
module.exports = mongoose;
