import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Loc() {
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.serv || "";

  const [loc, setLoc] = useState("");

  const handleChange = (event) => {
    setLoc(event.target.value);
  };

  const handleSubmit = async () => {
    const locationInput = loc;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/auth/nearby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service, location: locationInput }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/tlist", { state: { tdata: data } });
        console.log(data);
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error fetching tradespeople:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.h1
        className="text-3xl font-bold text-[#3A506B] mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Find Nearby Tradespeople
      </motion.h1>

      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          id="location"
          placeholder="Enter Location"
          value={loc}
          onChange={handleChange}
          className="p-3 border rounded-md w-64 border-gray-400 focus:ring-2 focus:ring-[#3A506B] outline-none text-center"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#98C379] text-white font-semibold rounded-md hover:bg-[#3A506B] transition duration-200 text-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default Loc;
