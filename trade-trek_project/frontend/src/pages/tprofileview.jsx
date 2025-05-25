import React, { useState,useEffect } from "react";
import { useLocation ,useNavigate} from "react-router-dom";
import Chat from "../pages/chat";
const TradespersonProfile = () => {
  const Navigate=useNavigate();
  const location = useLocation();
  const { t } = location.state || {}; // Ensure `t` is defined
  const [userid, setUserid] = useState(null) // Store logged-in user
  const [username,setUsername]=useState(null)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    service: "",
    comments: "",
  });

  const [userBookings, setUserBookings] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    const username=localStorage.getItem("username");
    if (storedUser) {
      setUserid(storedUser);
    }
    if(username)
      setUsername(username);
  }, []);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}|| 'http://localhost:5000'/api/auth/bookings/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUserBookings(data);

          // Check if a "Done" booking exists for this tradesperson
          const hasCompletedBooking = data.some(
            (booking) => booking.tradespersonEmail === t.email && booking.status === "Done"
          );

          setShowReviewForm(hasCompletedBooking);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (t?.id) {
      fetchBookings();
    }
  }, [t?.id]);


  if (!t) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-gray-700">No tradesperson data found.</h1>
        <p className="text-gray-500">Please go back and select a tradesperson.</p>
      </div>
    );
  }
 else{
  console.log(t);
 }
 const handleBooking = async (e) => {
  e.preventDefault();
  console.log(t);
  // Get current date and time
  const currentDate = new Date();
  const selectedDate = new Date(formData.date + "T" + formData.time);

  // Check if selected date and time are in the past
  if (selectedDate < currentDate) {
    alert("You cannot select a past date or time. Please choose a valid time.");
    return;
  }

  const bookingData = {
    userId: userid, // Assuming `user` is stored in state
    tradespersonEmail: t?.email, // Assuming `t` contains tradesperson data
    date: formData.date,
    time: formData.time,
    service: formData.service,
    comments: formData.comments,
  };

  try {
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}|| 'http://localhost:5000'/api/auth/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
       },
      
      body: JSON.stringify(bookingData),
    });

    
    if (response.ok) {
      alert("Booking successful!");

      const responseNotify = await fetch(`${process.env.REACT_APP_API_URL}|| 'http://localhost:5000'/api/auth/notify-tradesperson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      
      const notifyData = await responseNotify.json();
      if (!responseNotify.ok) {
        console.error("Failed to send email:", notifyData.message);
      }
      
      <Navigate to="/my-bookings"/>

    } else {
      const data = await response.json();
      alert(data.message); // Show error message if booking fails
    }
  } catch (error) {
    console.error("Error booking:", error);
    alert("Something went wrong. Please try again.");
  }
};


const handleReviewSubmit = async (e) => {
  e.preventDefault();
  const reviewPayload = {
    tradespersonEmail:t?.email,
    client: userid,
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}|| 'http://localhost:5000'/api/auth/add-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reviewPayload),
    });

    if (response.ok) {
      alert("Review submitted successfully!");
      setShowReviewForm(false);
    } else {
      alert("Failed to submit review.");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-light-beige text-cool-gray min-h-screen">
      {/* Header Section */}
      <header className="bg-[#3A506B] text-white py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <img
            src={t?.profileImage || "default-profile.png"} // Fallback image
            alt={t?.name || "Tradesperson"}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{t?.name || "Name Unavailable"}</h1>
            <p className="text-sm">Location: {t?.location || "Not Specified"}</p>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#3A506B]">About</h2>
          <p className="mt-2 text-gray-600">{t?.bio || "No bio available."}</p>
        </section>

        {/* Services Offered */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#3A506B]">Services Offered</h2>
          <ul className="mt-4 space-y-2">
            {t?.services_offered?.length > 0 ? (
              t.services_offered.map((service, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white shadow rounded-md"
                >
                  <span>{service}</span>
                </li>
              ))
            ) : (
              <p>No services available.</p>
            )}
          </ul>
        </section>

        {/* Availability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#3A506B]">Availability</h2>
          <p className="mt-2 text-gray-600">{t?.availability || "Not available"}</p>
        </section>

        {/* Booking Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#3A506B]">Book a Service</h2>
          <form onSubmit={handleBooking} className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="p-3 border rounded-md w-full md:w-1/3"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="p-3 border rounded-md w-full md:w-1/3"
              />
             <select
              name="service"
              value={formData.service}
               onChange={handleInputChange}
               required
               className="p-3 border rounded-md w-full md:w-1/3"
                >
  <option value="">Select Service</option>
  {t.services_offered?.[0]?.split(',').map((service, index) => (
    <option key={index} value={service.trim()}>
      {service.trim()}
    </option>
  ))}
</select>

            </div>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional comments or notes"
              className="p-3 border rounded-md w-full"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-[#98C379] text-white font-semibold rounded-md hover:bg-[#3A506B] transition"
            >
              Submit Booking
            </button>
          </form>
        </section>

        {/* Ratings and Reviews */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#3A506B]">Ratings and Reviews</h2>
          <div className="mt-4 space-y-4">
            {t?.reviews?.length > 0 ? (
              t.reviews.map((review, index) => (
                <div key={index} className="p-4 bg-white shadow rounded-md">
                  <p className="text-sm font-semibold">{review.client}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                  <p className="text-yellow-500">{"★".repeat(review.rating)}</p>
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </section>




        <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={() => setShowChat(true)}
      >
        Chat Now 💬
      </button>

      {t?.id && showChat && (
  <div className="mt-4">
    <Chat tradespersonId={t.id} clientId={userid} userName={username}/>
  </div>
)}



      

        {showReviewForm && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#3A506B]">Leave a Review</h2>
            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="flex items-center">
                <label className="mr-2">Rating:</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  className="p-2 border rounded-md"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} ★
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Write your review here..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows="3"
                className="p-3 border rounded-md w-full"
              ></textarea>
              <button type="submit" className="px-6 py-3 bg-[#98C379] text-white font-semibold rounded-md">
                Submit Review
              </button>
            </form>
          </section>
        )}

      </main>
    </div>
  );
};

export default TradespersonProfile;
