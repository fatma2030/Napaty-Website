import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";


import LoginRegister from "./pages/LoginRegister";
import DiseaseDiagnosis from "./pages/DiseaseDiagnosis";
import SoilAnalysis from "./pages/SoilAnalysis";
import PlantsSeasons from "./pages/PlantsSeasons";
import Store from "./pages/Store";
import Consultation from "./pages/Consultation";
import Welcome from "./pages/Welcome";

import CommunicationRedirect from "./pages/Communication";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/chat/:requestId" element={<ProtectedRoute user={user}><Chat /> </ProtectedRoute>}/>


            <Route path="/login" element={<LoginRegister setUser={setUser} />} />

            <Route path="/diagnosis" element={<DiseaseDiagnosis />} />
            <Route path="/soil-analysis" element={<SoilAnalysis />} />
            <Route path="/plants-seasons" element={<PlantsSeasons />} />
            <Route path="/store" element={<Store />} />

            <Route
              path="/consultation"
              element={
                <ProtectedRoute user={user}>
                  <Consultation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/communication"
              element={
                <ProtectedRoute user={user}>
                  <CommunicationRedirect />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
