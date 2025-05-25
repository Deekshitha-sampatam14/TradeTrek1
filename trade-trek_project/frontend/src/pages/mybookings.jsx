import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === "production"
  ? "https://tradetrek.onrender.com"
  : "http://localhost:5000";
        
        const response = await fetch(`${baseUrl}/api/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setBookings(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              You don’t have any recent bookings
            </h3>
            <p className="text-gray-500 mb-6">
              Explore popular services and book your next service with ease.
            </p>
            <Link
              to="/services"
              className="inline-block px-6 py-3 bg-[#98C379] text-white font-semibold rounded-md hover:bg-green-600 transition"
            >
              Explore Popular Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.service}
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {booking.date} at {booking.time}
                </p>
                <p className="text-gray-700 mt-2">{booking.comments}</p>

                <div className="mt-3 flex gap-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Reschedule
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
