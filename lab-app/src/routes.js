import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import Login from './public/Login/Login';
import Settings from './private/Settings/Settings';

import Patients from './private/Patients/Patients';
import PatientForm from './private/Patients/PatientForm';

import Interfaces from './private/Interfaces/Interfaces';
import InterfaceForm from './private/Interfaces/InterfaceForm';

import Exams from './private/Exams/Exams';
import ExamForm from './private/Exams/ExamForm';

import Orders from './private/Orders/Orders';
import OrderForm from './private/Orders/OrderForm';

import Dashboard from './private/Dashboard/Dashboard';
import Results from './private/Results/Results';



//import WorkOrders from './private/Orders/Orders';
//import OrderForm from './private/Orders/OrderForm';



/*
import Orders from './private/Orders/Orders';
import Monitors from './private/Monitors/Monitors';
import Automations from './private/Automations/Automations';
import OrderTemplates from './private/OrderTemplates/OrderTemplates';
import WithdrawTemplates from './private/WithdrawTemplates/WithdrawTemplates';
import Reports from './private/Reports/Reports';
import Symbols from './private/Symbols/Symbols';
import Wallet from './private/Wallet/Wallet';
*/
function Router() {

    function PrivateRoute({ children }) {
        const isAuth = localStorage.getItem("token") !== null;
        return isAuth ? children : <Navigate to="/" />;
    }

    return (
        <BrowserRouter>
         
            <Routes>

                <Route path="/" exact element={<Login />} />
                <Route path='/dashboard' element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />

                <Route path='/patients' element={
                    <PrivateRoute>
                        <Patients />
                    </PrivateRoute>
                } />

                  <Route path='/patients/new' element={
                    <PrivateRoute>
                        <PatientForm />
                    </PrivateRoute>
                }/> 
                    <Route path='/patients/edit/:id' element={
                    <PrivateRoute>
                        <PatientForm />
                    </PrivateRoute>
                } />

                <Route path='/interfaces' element={
                    <PrivateRoute>
                        <Interfaces />
                    </PrivateRoute>
                } />

                  <Route path='/interfaces/new' element={
                    <PrivateRoute>
                        <InterfaceForm />
                    </PrivateRoute>
                }/> 
                    <Route path='/interfaces/edit/:id' element={
                    <PrivateRoute>
                        <InterfaceForm />
                    </PrivateRoute>
                } />

                {/* EXAMS*/}
                <Route path='/exams' element={
                    <PrivateRoute>
                        <Exams />
                    </PrivateRoute>
                } />

                  <Route path='/exams/new' element={
                    <PrivateRoute>
                        <ExamForm />
                    </PrivateRoute>
                }/> 
                    <Route path='/exams/edit/:id' element={
                    <PrivateRoute>
                        <ExamForm />
                    </PrivateRoute>
                } />

                {/* ORDERS*/}
                <Route path='/orders' element={
                    <PrivateRoute>
                        <Orders />
                    </PrivateRoute>
                } />

                  <Route path='/orders/new' element={
                    <PrivateRoute>
                        <OrderForm />
                    </PrivateRoute>
                }/> 
                    <Route path='/orders/edit/:id' element={
                    <PrivateRoute>
                        <OrderForm />
                    </PrivateRoute>
                } />

                {/* OBSERVATIONS*
                <Route path='/observations' element={
                    <PrivateRoute>
                        <Observations />
                    </PrivateRoute>
                } />

                  <Route path='/observations/new' element={
                    <PrivateRoute>
                        <ExamForm />
                    </PrivateRoute>
                }/> 
                    <Route path='/observations/edit/:id' element={
                    <PrivateRoute>
                        <ObservationForm />
                    </PrivateRoute>
                } />
                 */}

                <Route path="/settings" element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                } />

                <Route path="/results" element={
                    <PrivateRoute>
                        <Results />
                    </PrivateRoute>
                } />
            </Routes>


        </BrowserRouter>
    )
}

export default Router;