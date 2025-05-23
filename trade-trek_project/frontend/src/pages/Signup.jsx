import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
    profession:'',
    experience:'',
    location:'',
    hourly_rate:'',
    bio:'',
    availability:'',
    services_offered:'',

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
 const [userType, setUserType] = useState(""); 
 const [rdata,setRdata]=useState("");
  const [profilePic,setProfilePic]=useState('');

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    // First name and Last name validation
    if (!formData.firstName.trim()) formErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) formErrors.lastName = 'Last name is required';

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      formErrors.email = 'Invalid email format';
    }

    // Phone validation (e.g., minimum 10 digits)
    if (!formData.phone.trim()) {
      formErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = 'Invalid phone number';
    }

    // Password validation
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.confirmPassword !== formData.password) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.location.trim()) formErrors.location = 'Location is required';

     // Tradesperson-specific validation
     if (formData.userType === 'tradesperson') {
      if (!formData.profession.trim()) formErrors.profession = 'Profession is required';
      if (!formData.experience.trim()) formErrors.experience = 'Experience is required';
      if (!formData.services_offered.trim()) formErrors.services_offered = 'Services offered are required';
    }

    if (formData.userType === 'tradesperson' && !formData.image) {
      formErrors.image = 'Profile image is required for tradespersons';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setLoading(true);
      setError(null);
  
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });
  
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/auth/signup`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formDataToSend,
        });
  
        if (response.ok) {
          const data = await response.json();
          setRdata(data.find_data);
          setProfilePic(data.profileImage)
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.find_data._id);
            localStorage.setItem('username',data.find_data.firstName + ' ' + data.find_data.lastName);
            setSuccess(true);
          } else {
            setError('Sign-up failed. Please try again.');
            setSuccess(false);
          }
          if (data.userType) 
            setUserType(data.userType);

        } else {
          setError('Server error or invalid response');
          setSuccess(false);
        }
      } catch (err) {
        console.error('Error during sign-up:', err);
        setError('An error occurred. Please try again.');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    }
  };
  

 
  
  return (
    <div className="container mx-auto py-16 px-4 md:px-8 lg:px-16">
      <h2 className="text-center my-10 text-3xl font-extrabold text-gray-700 sm:text-4xl lg:text-5xl">
        Sign Up
      </h2>
      {success && userType ?(
        userType === 'tradesperson' ? (

<Navigate to="/tradespersondash" state={{ rdata: rdata || {}, profilePic: profilePic || "" }} />

  
        ) : (
          <Navigate to="/userdash" state={{ rdata: rdata || {}, profilePic: profilePic || "" }} />

        )
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

          <div className="flex flex-col items-center">
            <label htmlFor="userType" className="block text-gray-600 font-semibold mb-2">
              I am a
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full sm:w-[70%] focus:border-gray-600"
            >
              <option value="user">User</option>
              <option value="tradesperson">Tradesperson</option>
            </select>
          </div>

          {formData.userType === 'tradesperson' && (
  <>
    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={handleChange}
      className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
    />
    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
  </>
)}

{formData.userType === 'user' && (
  <div>
    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={handleChange}
      className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
    />
  </div>
)}

        
          {formData.userType === 'tradesperson' && (
            <>
              <input
                type="text"
                name="profession"
                placeholder="Profession"
                value={formData.profession}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />
              {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}

              <input
                type="text"
                name="experience"
                placeholder="Experience (in years)"
                value={formData.experience}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}


              <input
                type="text"
                name="services_offered"
                placeholder="Services Offered (comma-separated)"
                value={formData.services_offered}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />
              {errors.services_offered && <p className="text-red-500 text-sm">{errors.services_offered}</p>}

              <input
                type="text"
                name="hourly_rate"
                placeholder="Hourly Rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />

              <textarea
                name="bio"
                placeholder="Short Bio"
                value={formData.bio}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />

              <input
                type="text"
                name="availability"
                placeholder="Availability (e.g., Mon-Fri, 9 AM - 5 PM)"
                value={formData.availability}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#98C379] text-white font-semibold rounded-lg hover:bg-[#3A506B] focus:outline-none"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
      
    </div>
  );
};

export default SignUp;
