// src/pages/UserDashboard.jsx


import React, { useState, useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';

const UserDashboard = () => {

   const location = useLocation();  // Use useLocation to access the state passed via Navigate
    const { rdata, profilePic } = location.state || {};  // Access rdata from state
  const navigate = useNavigate();

  
  const [filteredTradespeople, setFilteredTradespeople] = useState([]);
  const [nearbyTradespeople, setNearbyTradespeople] = useState([]);

  
  const cards = [
    { name: "electrician", image: "./electrician.jpg", text: "Electrician" },
    { name: "plumber", image: "./plumber.jpg", text: "Plumber" },
    { name: "carpenter", image: "./carpenter.jpg", text: "Carpenter" },
    { name: "mason", image: "./mason.jpg", text: "Mason" },
    { name: "mechanic", image: "./mechanic.jpg", text: "Mechanic" },
    { name: "painter", image: "./painter.avif", text: "Painter" },
    { name: "welder", image: "./welder.jpg", text: "Welder" },
    { name: "hvac_technician", image: "./hvac_technician.jpg", text: "HVAC Technician" },
    { name: "roofers", image: "./roofers.jpg", text: "Roofers" },
    { name: "tiler", image: "./tailer.jpg", text: "Tiler" },
    { name: "blacksmith", image: "./blacksmith.jpg", text: "Blacksmith" },
    { name: "barber", image: "./barber.jpg", text: "Barber" },
    { name: "cobbler", image: "./cobbler.jpg", text: "Cobbler" },
    { name: "glazier", image: "./glazier.jpg", text: "Glazier" },
    { name: "locksmith", image: "./locksmith.jpg", text: "Locksmith" },
    { name: "tailor", image: "./tailor.jpg", text: "Tailor" },
    { name: "stonecutter", image: "./stonecutter.avif", text: "Stonecutter" },
    { name: "jeweler", image: "./jewelery.jpg", text: "Jeweler" },
    { name: "landscaper", image: "./landscaper.jpg", text: "Landscaper" },
    { name: "chimney_sweep", image: "./chimney_sweep.webp", text: "Chimney Sweep" }
];

  
 

  // Display all tradespeople initially
  useEffect(() => {
    // Fetch nearby tradespeople based on the user's location
    const fetchNearbyTradespeople = async () => {
      if (rdata) {
        try {
          const baseUrl = process.env.NODE_ENV === "production"
  ? "https://tradetrek.onrender.com"
  : "http://localhost:5000";
          const response = await fetch(`${baseUrl}/api/auth/nearby_loc`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: rdata.location }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch nearby tradespeople');
          }
  
          const data = await response.json();
          setNearbyTradespeople(data);
        } catch (error) {
          console.error('Error fetching nearby tradespeople:', error);
        }
      }
    };
  
    fetchNearbyTradespeople();
  }, []);
  

  // Filter tradespeople when search button is clicked
  const handleSearch =async () => {
    const service = document.getElementById("service").value;
    const location = document.getElementById("location").value;

    if (!service && !location) {
      alert("Please enter either a location or service.");
      return;
    }

    const searchData = { service, location };

    try {
 
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://tradetrek.onrender.com"
  : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/auth/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful response (e.g., display the list of tradespeople)
        navigate("/tlist", {
          state: { tdata: data },
        });

        console.log(data);
      } else {
        alert(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('An error occurred.');
    }
  };

  const handleCardClick = (name) => {
    console.log(`Card clicked: ${name}`); // Replace this with your backend handling logic
  };

  const scrollLeft = () => {
    const container = document.querySelector(".overflow-x-auto");
    container.scrollBy({ left: -300, behavior: "smooth" });
  };
  
  const scrollRight = () => {
    const container = document.querySelector(".overflow-x-auto");
    container.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-8 bg-light-beige text-cool-gray min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Hey {rdata.firstName}! Welcome back</h1>

      {/* Search Component */}
      <div className="flex justify-center gap-4 mb-8">
        <input
          type="text"
          id="location"
          placeholder="Location"
          className="p-3 border rounded-md w-48 border-accent focus:ring-2 focus:ring-accent outline-none"
        />
        <input
          type="text"
          id="service"
          placeholder="Service Type"
          className="p-3 border rounded-md w-48 border-accent focus:ring-2 focus:ring-accent outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-[#98C379] text-white font-semibold rounded-md hover:bg-cool-gray transition"
        >
          Search
        </button>
      </div>


<Link to="/tradesperson-chats" state={{id:rdata?._id,tname:rdata.firstName+' '+rdata.lastName} }>

      <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
      
        View Chats
      </div>

      </Link>

      <section>
  <div className="px-4 py-6 pb-10">
    <h2 className="text-2xl font-bold mb-10">Hey, What's on your mind?</h2>
    <div className="relative">
      {/* Carousel Container */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {/* Two Rows of Cards */}
        <div className="min-w-full grid grid-cols-5 gap-4">
          {cards.slice(0, Math.ceil(cards.length / 2)).map((card) => (
              <Link to="/loc" state={{serv:card.name}} >
            <div
              key={card.name}
              onClick={() => handleCardClick(card.name)}
              className="block rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-[#3A506B]">{card.text}</h3>
              </div>
            </div>
            </Link>
          ))}
        </div>
        <div className="min-w-full grid grid-cols-5 gap-4">
          {cards.slice(Math.ceil(cards.length / 2)).map((card) => (
            <div
              key={card.name}
              onClick={() => handleCardClick(card.name)}
              className="block rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-[#3A506B]">{card.text}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Buttons */}
      <button
        onClick={() => scrollLeft()}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
      >
        ◀
      </button>
      <button
        onClick={() => scrollRight()}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
      >
        ▶
      </button>
    </div>
  </div>
</section>

<section className="mb-12">
  <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>

  {rdata.bookings.length > 0 ? (
    <ul className="space-y-4">
      {rdata.bookings.map((booking) => (
        <li key={booking.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
          <p className="text-cool-gray font-medium">Service: {booking.service}</p>
          <p className="text-gray-500">Date: {new Date(booking.date).toLocaleDateString()}</p>
          <span
            className={`font-semibold ${
              booking.status === 'Pending' ? 'text-orange-500' : 'text-green-500'
            }`}
          >
            {booking.status}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">You don’t have any recent bookings</h3>
      <p className="text-gray-500 mb-6">
        Explore popular services and book your next service with ease.
      </p>
      <Link
        to="/services"
        className="inline-block px-6 py-3 bg-[#98C379] text-white font-semibold rounded-md hover:bg-cool-gray transition"
      >
        Explore Popular Services
      </Link>
    </div>
  )}
</section>

     

      {/* Display Nearby Tradespeople */}
      <section className="mt-5 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nearby Tradespeople</h2>
        {nearbyTradespeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyTradespeople.map((person) => (
            <Link
            to={{
              pathname: "/tpview",
            }}
            state={{t:person }}
          >
            <div key={person.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <img
                src={person.profileImage}
                alt={`${person.name}'s profile`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold text-cool-gray">{person.name}</h4>
              <p className="text-gray-500">{person.profession}</p>
              <p className="text-gray-400">Location: {person.location}</p>
              {person.reviews && person.reviews.length > 0 ? (
    <p className="text-yellow-500 font-semibold mt-2">
      ⭐ {(
        person.reviews.reduce((acc, review) => acc + review.rating, 0) / 
        person.reviews.length
      ).toFixed(1)} 
      ({person.reviews.length} reviews)
    </p>
  ) : (
    <p className="text-gray-400 mt-2">No ratings yet</p>
  )}
              
                                
                              
            </div>
            </Link>
          ))}
        </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tradespeople found nearby.</h3>
            <p className="text-gray-500">Try searching for a specific service!</p>
          </div>
        )}
      </section>


    </div>
  );
};

export default UserDashboard;
