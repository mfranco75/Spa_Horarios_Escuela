import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from './conexionDatabase.js';
import Navbar from "./components/Navbar.jsx";
import Login from "./components/pages/Login";
import Horarios from "./components/pages/Horarios.jsx";
import Docentes from "./components/pages/Docentes.jsx";
import Alumnos from "./components/pages/Alumnos.jsx";
import Informes from "./components/pages/Informes.jsx";
import CalendarComponent from "./components/CalendarComponent.jsx";
import './styles/App.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { UserProvider } from './components/UserContext.jsx';


function App() {

  
  return (
    <UserProvider>
    <Router>
      <div className="App">
        <>
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/horarios"
                element={
                  <ProtectedRoute>
                    <Horarios CalendarComponent={CalendarComponent} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/docentes"
                element={
                  <ProtectedRoute>
                    <Docentes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumnos"
                element={
                  <ProtectedRoute>
                    <Alumnos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/informes"
                element={
                  <ProtectedRoute>
                    <Informes />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </>
      </div>
    </Router>
    </UserProvider>  
  );
}

export default App;


/*
function App() {
  
  return (
    <Router>
      <div className="App">
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/horarios" element={<Horarios CalendarComponent={CalendarComponent}/>} />
                <Route path="/docentes" element={<Docentes />} />
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/informes" element={<Informes />} />
                
              </Routes>
            </main>
          </>
      </div>
    </Router>
  );
}

export default App;
*/
