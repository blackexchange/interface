
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/usersRepository');
const examsRepository = require('../repositories/examsRepository');


async function doLogin (req,res, next){
    const email =  req.body.email;
    const password = req.body.password;

    const user = await userRepository.getUserByEmail(email);

    if (user){
        const isValid = bcrypt.compareSync(password, user.password);
        
        if (isValid){
            const exams = await examsRepository.getByCondition({createdBy:user.id});

            const token = jwt.sign({id:user.id,profile:user.profile, name:user.name},process.env.JWT_SECRET,{
                expiresIn: parseInt(process.env.JWT_EXPIRES)            
            })
            res.json({token,data:[{exams:exams}]});
        }
    }
    
    res.sendStatus(401);
}

async function doRegister (req,res, next){
    const reqBody = req.body;

    try {
        const newObj = await userRepository.createUser(reqBody);
        res.status(201).json(newObj);
    } catch (err) {
       // logger('system', err);
        res.status(500).json({ message: err.message });
    }
    
    res.sendStatus(401);
}

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
    doRegister,
    doLogin,
    doLogout,
    isBlackListed
}