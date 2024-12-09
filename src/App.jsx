import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/pages/Login";
import Horarios from "./components/pages/Horarios";
import Docentes from "./components/pages/Docentes";
import Alumnos from "./components/pages/Alumnos";
import Informes from "./components/pages/Informes";
import CalendarComponent from "./components/CalendarComponent";
import './styles/App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/horarios" element={<Horarios CalendarComponent={CalendarComponent} />} />
            <Route path="/docentes" element={<Docentes />} />
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/informes" element={<Informes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
