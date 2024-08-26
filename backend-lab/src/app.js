const express = require('express');
const authController = require('./controllers/authController');
const { isAuthenticated, isAdmin }  = require('./middlewares/authMiddleware');

const patientsRouter = require('./routers/patientsRouter');
const observationsRouter = require('./routers/observationsRouter');
const interfacesRouter = require('./routers/interfacesRouter');
const partnersRouter = require('./routers/partnersRouter');




require('express-async-errors');

const cors = require('cors');
const helmet = require('helmet');

const app = express();



app.use(cors());

app.use(helmet());

app.use(express.json());

app.post('/login', authController.doLogin);
app.post('/register', authController.doRegister);
app.get('/logout', authController.doLogout);



app.use('/patients', isAuthenticated, patientsRouter);
app.use('/observations', isAuthenticated, observationsRouter);
app.use('/interfaces', isAuthenticated, interfacesRouter);


app.use('/partners', isAuthenticated, isAdmin, partnersRouter);



app.use(require("./middlewares/errorMiddleware"));


module.exports = app;