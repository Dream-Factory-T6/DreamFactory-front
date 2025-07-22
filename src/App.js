import React from 'react';

import './App.css';
import Header from './components/Header/Header.js';
import Home from './pages/Home/Home.js';
import LoginPage from './pages/LoginPage/LoginPage.js';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.js';
import DestinationDetails from './pages/DestinationDetails/DestinationDetails.js';
import Footer from './components/Footer/Footer.js';
import UserPage from './pages/UserPage/UserPage.js';
import AddDestination from './pages/AddDestination/AddDestination.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
          <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/destination/:id" element={<DestinationDetails />} />
            <Route path="/user-account" element={<UserPage />} />
            <Route path="/add" element={<AddDestination />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
