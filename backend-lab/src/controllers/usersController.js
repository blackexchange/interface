
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usersRepository = require('../repositories/usersRepository');


async function doLogin (req,res, next){
    const email =  req.body.email;
    const password = req.body.password;


    const settings = await usersRepository.getSettingsByEmail(email);

    if (settings){
        const isValid = bcrypt.compareSync(password, settings.password);
        
        if (isValid){
            const token = jwt.sign({id:1},process.env.JWT_SECRET,{
                expiresIn: parseInt(process.env.JWT_EXPIRES)            
            })
            res.json({token});
        }
    }
    
    res.sendStatus(401);
}

async function doRegister(req, res, next) {
    try {
        const { username, name, email, password } = req.body;

        // Verifica se o email já está em uso
        const existingUser = await usersRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo paciente
        const newUser = {
            username,
            name,
            profile:"user",
            email,
            password: hashedPassword,
        };

        // Insere o paciente no banco de dados
        const registeredUser = await usersRepository.insertUser(newUser);

        // Retorna o paciente registrado, omitindo a senha
        const { password: _, ...UserWithoutPassword } = registeredUser.toObject();
        res.status(201).json(UserWithoutPassword);
    } catch (err) {
        console.error('Error registering User:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    doRegister,
};


const blackList = [];
function doLogout (req,res, next){
    const token = req.headers['authorization'];
    blackList.push(token);
    res.sendStatus(200);

}

function isBlackListed (token){
  
    return blackList.some(t => t === token);

}



module.exports={
    doLogin,
    doLogout,
    isBlackListed
}