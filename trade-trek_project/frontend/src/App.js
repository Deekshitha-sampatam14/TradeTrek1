import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import TradespersonDashboard from './pages/TradespersonDashboard.jsx';
import Userdash from './pages/Userdashboard';
import Services from './pages/Services';
import TradespersonProfile from './pages/tradespersonprofile';
import TPV from './pages/tprofileview';
import TradespeopleList from './pages/tradespeoplelist';
import Loc from './pages/location';
import MyBookings from './pages/mybookings';
import Sign_login_req from './pages/sign_login_request';
import AlternativeServices from './pages/alt_services';
import TradespersonChats from "./pages/tpChat";
import Logout from './pages/logout';

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init( 
  {duration: 800, // Animation duration in milliseconds
  once: true,
}
);


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/userdash" element={<Userdash/>}/>
          <Route path="/tradespersondash" element={<TradespersonDashboard/>}/>
          <Route path="/tradespersonProfile" element={<TradespersonProfile/>}/>
          <Route path="/services" element={<Services/>}/>
          <Route path="/tpview" element={<TPV/>}/>
          <Route path="/tlist" element={<TradespeopleList/>}/>
          <Route path="/loc" element={<Loc/>}/>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/sign_login_req" element={<Sign_login_req/>} />
          <Route path="/alt_services" element={<AlternativeServices/>}/>
          <Route path="/tradesperson-chats" element={<TradespersonChats />} />
          <Route path="/logout" element={<Logout/>}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
    
  );
}

export default App;
