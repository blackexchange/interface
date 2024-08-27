import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import Login from './public/Login/Login';
import Settings from './private/Settings/Settings';
import Patients from './private/Patients/Patients';
import PatientForm from './private/Patients/PatientForm';
import Interfaces from './private/Interfaces/Interfaces';
import InterfaceForm from './private/Interfaces/InterfaceForm';


/*import Dashboard from './private/Dashboard/Dashboard';
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
                
                <Route path="/settings" element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                } />
            </Routes>


        </BrowserRouter>
    )
}

export default Router;