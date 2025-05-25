// src/pages/TradespersonProfile.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TradespersonProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { Data, profileImage } = location.state || {};   // This will be undefined if not passed

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    userType: "tradesperson",
    profession: "",
    experience: "",
    rate: "",
    location: "",
    bio: "",
    availability: "",
    services: "",
  });

  const [profilePic, setProfilePic] = useState(null); // State for the profile picture
  const [loading, setLoading] = useState(true);

  // Load initial data into profile state
  useEffect(() => {
    if (Data) {
      setProfile({
        firstname: Data.firstName || "",
        lastname: Data.lastName || "",
        email: Data.email || "",
        phone: Data.phone || "",
        password: "", // Password should not be prefilled for security reasons
        userType: Data.userType || "tradesperson",
        profession: Data.profession || "",
        experience: Data.experience || "",
        rate: Data.hourly_rate || "",
        location: Data.location || "",
        bio: Data.bio || "",
        availability: Data.availability || "",
        services: Data.services_offered?.join(", ") || "", // Join array into comma-separated string
      });
      setProfilePic(profileImage || null); // Set initial profile picture
      setLoading(false);
    }
  }, [Data]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Display the selected file as preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", Data.email); // Including email to identify the tradesperson
    formData.append("firstName", profile.firstname);
    formData.append("lastName", profile.lastname);
    formData.append("phone", profile.phone);
    formData.append("password", profile.password); // Password update (consider hashing on backend)
    formData.append("userType", profile.userType);
    formData.append("profession", profile.profession);
    formData.append("experience", profile.experience);
    formData.append("hourly_rate", profile.rate);
    formData.append("location", profile.location);
    formData.append("bio", profile.bio);
    formData.append("availability", profile.availability);
    formData.append("services_offered", profile.services.split(",").map((service) => service.trim())); // Convert comma-separated services to an array

    // Append profile image if there's one
    if (profilePic) {
      formData.append("profileImage", profilePic);
    }

    try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Fixed template literal
        },
        body: formData,
      });

      if (response.ok) {
        alert("Profile updated successfully!");

        // Fetch updated data to reflect changes on the dashboard
        const updatedDataResponse = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Fixed template literal
          },
        });

        if (updatedDataResponse.ok) {
          const updatedData = await updatedDataResponse.json();
          setProfile({
            firstname: updatedData.firstName || "",
            lastname: updatedData.lastName || "",
            email: updatedData.email || "",
            phone: updatedData.phone || "",
            password: "", // Password should not be prefilled
            userType: updatedData.userType || "tradesperson",
            profession: updatedData.profession || "",
            experience: updatedData.experience || "",
            rate: updatedData.hourly_rate || "",
            location: updatedData.location || "",
            bio: updatedData.bio || "",
            availability: updatedData.availability || "",
            services: updatedData.services_offered?.join(", ") || "",
          });
          if (updatedData.profileImage) {
            setProfilePic(updatedData.profileImage);
          }
         // Update profile image
          navigate("/tradespersondash", {
            state: { rdata: updatedData,profilePic },
          });
        } else {
          alert("Error fetching updated profile data");
        }
      } else {
        const errorData = await response.json();
        alert("Error updating profile: " + errorData.message);
        fetchOriginalProfile();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating profile");
      fetchOriginalProfile();
    }
  };

  const fetchOriginalProfile = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Fixed template literal
        },
      });

      if (response.ok) {
        const originalProfile = await response.json();
        setProfile({
          firstname: originalProfile.firstName || "",
          lastname: originalProfile.lastName || "",
          email: originalProfile.email || "",
          phone: originalProfile.phone || "",
          password: "",
          userType: originalProfile.userType || "tradesperson",
          profession: originalProfile.profession || "",
          experience: originalProfile.experience || "",
          rate: originalProfile.hourly_rate || "",
          location: originalProfile.location || "",
          bio: originalProfile.bio || "",
          availability: originalProfile.availability || "",
          services: originalProfile.services_offered?.join(", ") || "",
        });
        setProfilePic(originalProfile.profileImage || null); // Set original profile picture
      } else {
        console.error("Failed to fetch original profile");
      }
    } catch (error) {
      console.error("Error fetching original profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-light-beige min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#333]">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-xl space-y-6"
      >
         {/* Profile Image */}
         <label className="block">
          <span className="text-gray-700">Profile Image</span>
          <input
            type="file"
            name="profilePic"
            onChange={handleFileChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
          {profilePic && (
            <img
              src={profilePic}
              alt="Profile"
              className="mt-4 w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-xl"
            />
          )}
        </label>

        {/* Name */}
        <label className="block">
          <span className="text-gray-700">First Name</span>
          <input
            type="text"
            name="firstname"
            value={profile.firstname}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Last Name</span>
          <input
            type="text"
            name="lastname"
            value={profile.lastname}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Email */}
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Phone */}
        <label className="block">
          <span className="text-gray-700">Phone</span>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Password */}
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Profession */}
        <label className="block">
          <span className="text-gray-700">Profession</span>
          <input
            type="text"
            name="profession"
            value={profile.profession}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Experience */}
        <label className="block">
          <span className="text-gray-700">Experience (years)</span>
          <input
            type="number"
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Hourly Rate */}
        <label className="block">
          <span className="text-gray-700">Hourly Rate </span>
          <input
            type="text"
            name="rate"
            value={profile.rate}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Location */}
        <label className="block">
          <span className="text-gray-700">Location</span>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          />
        </label>

        {/* Bio */}
        <label className="block">
          <span className="text-gray-700">Bio</span>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="3"
            placeholder="Write a short description about yourself..."
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          ></textarea>
        </label>

        {/* Availability */}
        <label className="block">
          <span className="text-gray-700">Availability</span>
          <textarea
            name="availability"
            value={profile.availability}
            onChange={handleChange}
            rows="2"
            placeholder="E.g., Weekdays 9 AM - 6 PM"
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          ></textarea>
        </label>

        {/* Services Offered */}
        <label className="block">
          <span className="text-gray-700">Services Offered</span>
          <textarea
            name="services"
            value={profile.services}
            onChange={handleChange}
            rows="4"
            placeholder="List your services, e.g., Plumbing, Electrical Work..."
            className="mt-2 block w-full p-4 border rounded-md border-gray-300 focus:border-[#98C379] focus:ring-2 focus:ring-[#98C379] outline-none"
          ></textarea>
        </label>

        {/* Save Button */}
        <button
          type="submit"
          className="block w-full mt-6 px-6 py-3 bg-[#98C379] text-white font-semibold rounded-md hover:bg-[#87a752] transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default TradespersonProfile;
