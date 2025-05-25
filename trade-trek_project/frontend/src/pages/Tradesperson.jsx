// src/pages/TradespersonDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const TradespersonDashboard = () => {
  const location = useLocation();  // Use useLocation to access the state passed via Navigate
  const { rdata, profilePic } = location.state || {};  // Access rdata from state
  const navigate = useNavigate();
  

  // Ensure rdata is available
 
 // Check the rdata object to ensure services are included

  const [profile, setProfile] = useState({
    firstName: rdata.firstName || '',
    lastName: rdata.lastName || '',
    phone: rdata.phone || 'Not provided',
    profession: rdata.profession || 'Unknown',
    experience: rdata.experience || '0',
    hourly_rate: rdata.hourly_rate || 'Not set',
    availability: rdata.availability || 'Not available',
    location: rdata.location || 'Not provided',
    services_offered: rdata.services_offered || [],
    rating: rdata.rating || null,
    bio: rdata.bio || 'No bio provided',
    bookings: rdata.bookings || [],
    reviews: rdata.reviews || [],
  });

  if (!rdata) {
    return <div>Loading...</div>; // Show a loading message if rdata is not available
  }
  console.log('rdata:', rdata);
  console.log('RID:',rdata?._id);

  // Handle booking response (Accept/Decline)
  const handleBookingResponse = async (id, response) => {
    try {
      const to_send_data = {
        bookingId: id,
        status: response,
        tradespersonEmail: rdata.email, // Pass tradesperson's email
      };
  
      const res = await fetch(`${process.env.REACT_APP_API_URL}|| 'http://localhost:5000'/api/auth/booking_accept_decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(to_send_data),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        if(response==='Done')
        {
          alert(`Service ${response} successfully!`);
        }
        else
        alert(`Booking ${response} successfully!`);
        // Optionally update UI
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status.");
    }
  };
  
 
  // Handle review response (Acknowledge/Flag)
  const handleReviewResponse = (reviewId, action) => {
    console.log(`Review ID ${reviewId} has been ${action}`);
  };

  return (
    <div className="p-8 bg-light-beige text-cool-gray min-h-screen space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">Hey {rdata.firstName}! Welcome back</h1>

      {/* Profile Management Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
  <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center text-indigo-700">Manage Your Profile</h2>

  <div className="flex flex-col items-center space-y-6">
    {/* Profile Image */}
    <div className="relative">
      <img
        src={profilePic}
        alt="Profile"
        className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-xl"
      />
      <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-indigo-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6l4 2m-4 2h-4l4-2V6z"
          />
        </svg>
      </div>
    </div>

    {/* Name and Professional Details */}
    <h3 className="text-3xl font-semibold text-gray-800">{profile.firstName} {profile.lastName}</h3>
    <p className="text-lg text-gray-600">{profile.profession} - {profile.location}</p>
    <p className="text-md text-gray-500">Phone: {profile.phone}</p>

    {/* Rating */}
    {profile.rating && (
      <p className="text-yellow-500 text-xl font-semibold mt-2">⭐ {profile.rating}</p>
    )}

    {/* Bio */}
    <p className="text-gray-700 mt-4 text-center text-lg max-w-2xl">{profile.bio}</p>

    {/* Experience and Hourly Rate Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300 text-center">
        <p className="text-gray-600 font-medium text-sm">Experience</p>
        <p className="text-xl font-semibold text-indigo-600">{profile.experience} years</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300 text-center">
        <p className="text-gray-600 font-medium text-sm">Hourly Rate</p>
        <p className="text-xl font-semibold text-indigo-600">{profile.hourly_rate} /hr</p>
      </div>
    </div>

    {/* Availability */}
    <div className="bg-white p-4 rounded-lg shadow-md w-full mt-6 text-center">
      <p className="text-gray-600 font-medium text-sm">Availability</p>
      <p className="text-xl font-semibold text-indigo-600">{profile.availability}</p>
    </div>

    {/* Services Offered Section */}
    <div className="mt-6 w-full">
      <p className="text-gray-600 font-medium text-sm">Services Offered:</p>
      <div className="space-y-2 mt-2">
        {profile.services_offered && profile.services_offered.length > 0 ? (
          profile.services_offered.map((service, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-md text-indigo-600 font-semibold">{service}</div>
          ))
        ) : (
          <p className="text-gray-500">No services listed</p>
        )}
      </div>
    </div>

    {/* Edit Button */}
    <div className="mt-6">
    <Link
    to="/tradespersonProfile"
    state={{ Data: rdata ,profileImage:profilePic}} // Pass 'rdata' as 'Data' through the state property
  >
      <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg">
        Edit Profile
      </button>
      </Link>
    </div>
  </div>
</section>


<Link to="/tradesperson-chats" state={{id:rdata?._id,tname:rdata.firstName+' '+rdata.lastName} }>

      <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
      
        View Chats
      </div>

      </Link>


      {/* Bookings Section */}
      <section className="bg-white p-6 rounded-lg shadow-xl transition hover:shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Bookings</h2>
        {profile.bookings.length > 0 ? (
          profile.bookings.map((booking, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md mb-4">
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Client:</strong> {booking.client}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <div className="flex justify-end">
                {booking.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleBookingResponse(booking._id, 'Accepted')}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleBookingResponse(booking._id, 'Declined')}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </>
                )}
                {booking.status==='Accepted' &&(
                  <>
                  <button  onClick={() => handleBookingResponse(booking._id, 'Done')} className="px-6 py-3 bg-[#98C379] text-white font-bold rounded-lg shadow-md hover:bg-[#74A060] transition-all duration-300 text-lg">
              Service done and Payment done by client
            </button>
            
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No bookings currently</p>
        )}
      </section>

      {/* Reviews Section */}
      <section className="bg-white p-6 rounded-lg shadow-xl transition hover:shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reviews</h2>
        {profile.reviews.length > 0 ? (
          profile.reviews.map((review, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md mb-4">
              <p><strong>Client:</strong> {review.client}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
            
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </section>
    </div>
  );
};

export default TradespersonDashboard;
