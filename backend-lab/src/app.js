const express = require('express');
const authController = require('./controllers/authController');
const { isAuthenticated, isAdmin }  = require('./middlewares/authMiddleware');

const patientsRouter = require('./routers/patientsRouter');
const observationsRouter = require('./routers/observationsRouter');
const interfacesRouter = require('./routers/interfacesRouter');
const partnersRouter = require('./routers/partnersRouter');
const examsRouter = require('./routers/examsRouter');
const ordersRouter = require('./routers/ordersRouter');
const labOrdersRouter = require('./routers/labOrdersRouter');

const rawRouter = require('./routers/rawRouter');
const rawController = require('./controllers/rawController');

const resultsRouter = require('./routers/resultsRouter');




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

app.post('/raw', rawController.createOne);




app.use('/patients', isAuthenticated, patientsRouter);
app.use('/observations', isAuthenticated, observationsRouter);
app.use('/interfaces', isAuthenticated, interfacesRouter);
app.use('/exams', isAuthenticated, examsRouter);
app.use('/orders', isAuthenticated, ordersRouter);
app.use('/laborders', isAuthenticated, labOrdersRouter);
app.use('/results', isAuthenticated, resultsRouter);


app.use('/partners', isAuthenticated, isAdmin, partnersRouter);



app.use(require("./middlewares/errorMiddleware"));


module.exports = app;