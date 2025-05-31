const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Tradesperson = require('../models/tradespersonModel');
const nodemailer=require('nodemailer');
const mongoose=require('mongoose');
const Message=require('../models/messageModel');

const signUp = async (req, res) => {
  const { firstName, lastName, email, phone, password, location, userType } = req.body;

  try {
    

    // Input validation
    if (!firstName || !lastName || !email || !phone || !password || !location || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['user', 'tradesperson'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    const existingTradesperson = await Tradesperson.findOne({ email });

    if (existingUser || existingTradesperson) {
      console.log('Email already exists in the database');
      return res.status(400).json({ message: 'Email already exists' });
    }

    let profileImageBuffer = null;
    let contentType = '';

    // Process profile image if uploaded
    if (req.file) {
      profileImageBuffer = req.file.buffer;
      contentType = req.file.mimetype;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;

    if (userType === 'user') {
      newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        location, // Store location as a string (not an array)
        userType,
        profileImage: profileImageBuffer,
        contentType,
      });
    } else if (userType === 'tradesperson') {
      const { profession, experience, hourly_rate, bio, availability, services_offered } = req.body;

      // Validate tradesperson-specific fields
      if (!profession || !experience || !hourly_rate || !bio || !availability || !services_offered) {
        return res.status(400).json({ message: 'All tradesperson fields are required' });
      }

      newUser = new Tradesperson({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        userType,
        profession,
        experience,
        location, // Store location as a string
        hourly_rate,
        bio,
        availability,
        services_offered: services_offered?.split(',').map((s) => s.trim()) || [], // Convert to array safely
        profileImage: profileImageBuffer,
        contentType,
      });
    }

    // Save to database
    const savedUser = await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: savedUser._id, userType: savedUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    let find_data;
    if (userType === 'user') {
      find_data = await User.findOne({ email });
      res.json({ message: 'Signup successfull', userType, find_data, token });
    }
     else {
      find_data = await Tradesperson.findOne({ email });

      let profileImageBase64 = null;
    if (find_data.profileImage) {
      profileImageBase64 = `data:${find_data.contentType};base64,${find_data.profileImage.toString('base64')}`;
    }

    res.status(200).json({ message: 'Signup  successfull', userType, find_data, profileImage: profileImageBase64 ,token });
    }

    
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Internal server error. Please try again.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user in either User or Tradesperson collection
    let user = await User.findOne({ email }).select('+password');
    let userType = 'user';
    
    if (!user) {
      user = await Tradesperson.findOne({ email }).select('+password');
      userType = 'tradesperson';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user);

    // Find the user or tradesperson data to return
    let find_data;
    if (userType === 'user') {
      find_data = await User.findOne({ email });
      res.json({ message: 'Logged in successfully', userType, find_data, token });
    }
     else {
      find_data = await Tradesperson.findOne({ email });

      let profileImageBase64 = null;
    if (find_data.profileImage) {
      profileImageBase64 = `data:${find_data.contentType};base64,${find_data.profileImage.toString('base64')}`;
    }

    res.status(200).json({ message: 'Logged in successfully', userType, find_data, profileImage: profileImageBase64 ,token });
    }

    // Send the response with the token and user data
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const updateProfile = async (req, res) => {
  const { email, firstName, lastName, phone, password, profession, experience, location, hourly_rate, bio, availability, services_offered } = req.body;

  try {
    // Find the tradesperson by their email
    const tradesperson = await Tradesperson.findOne({ email });

    if (!tradesperson) {
      return res.status(404).json({ message: 'Tradesperson not found' });
    }

    // Hash the password if it's provided in the request body
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      tradesperson.password = hashedPassword;
    }

    // Update the tradesperson's profile fields
    tradesperson.firstName = firstName || tradesperson.firstName;
    tradesperson.lastName = lastName || tradesperson.lastName;
    tradesperson.phone = phone || tradesperson.phone;
    tradesperson.profession = profession || tradesperson.profession;
    tradesperson.experience = experience || tradesperson.experience;
    tradesperson.hourly_rate = hourly_rate || tradesperson.hourly_rate;
    tradesperson.bio = bio || tradesperson.bio;
    tradesperson.availability = availability || tradesperson.availability;
    if (services_offered) {
      tradesperson.services_offered = Array.isArray(services_offered)
        ? services_offered
        : services_offered.split(',').map(service => service.trim());
    }
    if (location) {
      tradesperson.location = Array.isArray(location)
        ? location
        : location.split(',').map(loc => loc.trim());
    }
    

    if (req.file) {
      tradesperson.profileImage = req.file.buffer;
      tradesperson.contentType = req.file.mimetype;
    }

    

    // Save the updated tradesperson document
    await tradesperson.save();

    return res.status(200).json({ message: 'Profile updated successfully', tradesperson });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};


const getProfile = async (req, res) => {
  const { email } = req.user; // Assuming JWT middleware attaches the user

  try {
    const tradesperson = await Tradesperson.findOne({ email });

    if (!tradesperson) {
      return res.status(404).json({ message: 'Tradesperson not found' });
    }

     
    // Convert the profile image buffer to base64
    let profileImageBase64 = null;
    if (tradesperson.profileImage) {
      profileImageBase64 = `data:${tradesperson.contentType};base64,${tradesperson.profileImage.toString('base64')}`;
    }else {
      profileImageBase64 = null;
    }

    res.status(200).json({ ...tradesperson.toObject(), profileImage: profileImageBase64 });

    
  } catch (error) {
    console.error('Error fetching profile:',error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

const getNearbyTradespeople = async (req, res) => {
  const { service, location } = req.body;
  console.log("Received Request:", req.body);
  
  if (!service && !location) {
    return res.status(400).json({ message: 'Please enter either a location or a service' });
  }

  try {
    // Build the query based on the presence of service or location
    const query = {};

    if (service) {
      const serviceParts = service.split(/\s*,\s*/).map(s => s.trim()); // Split by comma and spaces
      query.services_offered = { $regex: new RegExp(serviceParts.join("|"), 'i') };
    }
    

    if (location) {
      const locationParts = location.split(/\s+/).map(loc => loc.trim());
      query.location = { $regex: new RegExp(locationParts.join("|"), 'i') };
    }
    

    const tradespeople = await Tradesperson.find(query);

    if (tradespeople.length === 0) {
      return res.status(404).json({ message: 'No tradespeople found matching the criteria' });
    }

    // Map tradespeople with base64 profile images or a dynamic route
    const tradespeopleWithImages = tradespeople.map((person) => {
      let profileImageBase64 = null;

      if (person.profileImage) {
        profileImageBase64 = `data:${person.contentType};base64,${person.profileImage.toString('base64')}`;
      }

      return {
        id: person._id,
        name: `${person.firstName} ${person.lastName}`,
        email:person.email,
        profession: person.profession,
        location: person.location,
        rating: person.rating,
        services_offered:person.services_offered,
        profileImage: profileImageBase64, // Inline base64 image for direct rendering
        bio:person.bio,
        availability:person.availability,
        reviews:person.reviews,
      };
    });

    res.json(tradespeopleWithImages);
  } catch (error) {
    console.error('Error fetching nearby tradespeople:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getByLoc = async (req,res) =>{
  const { location } = req.body;
  console.log("Received Request:", req.body);
  try{
    const query={};
    if (location) {
      const locationString = Array.isArray(location) ? location.join(" ") : location;
const locationParts = locationString.split(/\s+/).map(loc => loc.trim());

      query.location = { $regex: new RegExp(locationParts.join("|"), 'i') };
    }
    
    const tradespeople = await Tradesperson.find(query);

    if (tradespeople.length === 0) {
      return res.status(404).json({ message: 'No tradespeople found matching the criteria' });
    }

    // Map tradespeople with base64 profile images or a dynamic route
    const tradespeopleWithImages = tradespeople.map((person) => {
      let profileImageBase64 = null;

      if (person.profileImage) {
        profileImageBase64 = `data:${person.contentType};base64,${person.profileImage.toString('base64')}`;
      }

      return {
        id: person._id,
        name: `${person.firstName} ${person.lastName}`,
        email:person.email,
        profession: person.profession,
        location: person.location,
        rating: person.rating,
        services_offered:person.services_offered,
        profileImage: profileImageBase64, // Inline base64 image for direct rendering
        bio:person.bio,
        availability:person.availability,
        reviews:person.reviews,
      };
    });

    res.json(tradespeopleWithImages);
  } catch (error) {
    console.error('Error fetching nearby tradespeople:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

  const getByEmail = async (req, res) => {
  const { email } = req.body;
  console.log("Fetching profile for:", email);

  try {
    const person = await Tradesperson.findOne({ email });

    if (!person) {
      return res.status(404).json({ message: 'Tradesperson not found' });
    }

    let profileImageBase64 = null;
    if (person.profileImage) {
      profileImageBase64 = `data:${person.contentType};base64,${person.profileImage.toString('base64')}`;
    }

    const result = {
      id: person._id,
      name: `${person.firstName} ${person.lastName}`,
      email: person.email,
      profession: person.profession,
      location: person.location,
      rating: person.rating,
      services_offered: person.services_offered,
      profileImage: profileImageBase64,
      bio: person.bio,
      availability: person.availability,
      reviews: person.reviews,
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfileImage = async (req, res) => {
  const { id } = req.params;

  try {
    const tradesperson = await Tradesperson.findById(id);

    if (!tradesperson || !tradesperson.profileImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', tradesperson.contentType); // Set the correct content type
    res.send(tradesperson.profileImage); // Send the profileImage buffer directly
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const bookingRoute = async (req,res) =>{
  try {
    
    const { userId, tradespersonEmail, date, time, service, comments } = req.body;

    // Validate required fields
    if (!userId || !tradespersonEmail || !date || !time || !service) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user and tradesperson exist
    const user = await User.findById(userId);
    const tradesperson = await Tradesperson.findOne({email:tradespersonEmail});

    if (!user || !tradesperson) {
      return res.status(404).json({ message: "User or Tradesperson not found" });
    }

    // Convert date & time to consistent format
    const bookingDate = new Date(`${date}T${time}`);

     // Check if a booking exists for the same date & service
     const existingBooking = tradesperson.bookings.find(
      (b) => new Date(b.date).toISOString() ===new Date(date).toISOString() && b.service === service
    );


     // Only block booking if the existing one is not "Declined"
     if (existingBooking && existingBooking.status !== "Declined") {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    const bookingId = new mongoose.Types.ObjectId();

    // Create a booking object
    const newBooking = {
      _id: bookingId,
      service,
      tradespersonEmail,
      client: user.email,
      date: new Date(date),
      status: "Pending",
    };

    // Add booking to the tradesperson's model
    tradesperson.bookings.push(newBooking);
    await tradesperson.save();

    // Add booking to the user's model
    user.bookings.push({
      _id: bookingId,
      service,
      tradespersonEmail,
      date: new Date(date),
      status: "Pending",
    });
    await user.save();

    res.status(201).json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

const bookings_user = async (req,res)=>{
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.bookings); // Send user's bookings
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }

}

const notifyTradesperson = async(req,res)=>{
    try {
      const { tradespersonEmail, date, time, service, comments } = req.body;
  
      // Fetch tradesperson details from DB
      const tradesperson = await Tradesperson.findOne({email:tradespersonEmail});
      if (!tradesperson) {
        return res.status(404).json({ message: "Tradesperson not found" });
      }
  
      // Email setup
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: tradesperson.email, // Tradesperson's email
        subject: "🎉 New Booking Alert!",
        text: `Hey ${tradesperson.firstName}, you got a new booking! 🚀
        
        📅 Date: ${date} 
        ⏰ Time: ${time} 
        🛠 Service: ${service} 
        📝 Comments: ${comments}
        
        Log in to your TradeTrek account to manage it.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Notification sent to tradesperson!" });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  };


 
  
  const acceptOrDeclineBooking = async (req, res) => {
    try {
      const { bookingId, status, tradespersonEmail } = req.body;
  
      
      // Convert bookingId to ObjectId for proper comparison
      const bookingObjectId = new mongoose.Types.ObjectId(bookingId);
  
      // Find the tradesperson by email
      const tradesperson = await Tradesperson.findOne({ email: tradespersonEmail });
  
      if (!tradesperson) {
        return res.status(404).json({ message: "Tradesperson not found" });
      }
      
      // Find the correct booking using ObjectId comparison
      const tpBooking = tradesperson.bookings.find(b => b._id.equals(bookingObjectId));
  
      if (!tpBooking) {
        return res.status(404).json({ message: "Booking not found in tradesperson profile" });
      }
  
      // Update the booking status
      tpBooking.status = status;
      await tradesperson.save();

      // Update the user's booking status
    const user = await User.findOne({ email: tpBooking.client });

    if (user) {
      const userBooking = user.bookings.find(b => b._id.equals(bookingObjectId));
      if (!userBooking) {
        return res.status(404).json({ message: "Booking not found in user profile" });
      }
      userBooking.status = status;
        await user.save();
    }

    if(status!='Done')
    {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Booking ${status}`,
      text: `Hello ${user.firstName},\n\nYour booking for "${tpBooking.service}" with ${tradesperson.firstName} ${tradesperson.lastName} has been ${status}.\n\nThank you,\nTradeTrek Team`,
    };

    await transporter.sendMail(mailOptions);


    }

    if(status!='Done')
    {
      
      res.json({ message: `Booking ${status} successfully!` });
    }
    else
    res.json({ message: `Service ${status} successfully!` });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

  const addReview = async (req, res) => {
    try {
    
      const { client, rating, comment,tradespersonEmail} = req.body;
  
      if (!client || !rating || !comment) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const tradesperson = await Tradesperson.findOne({email:tradespersonEmail});
      if (!tradesperson) {
        return res.status(404).json({ message: "Tradesperson not found" });
      }
  
      const user = await User.findById(client);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if user has a completed booking with this tradesperson
      const hasCompletedBooking = user.bookings.some(
        (booking) => booking.tradespersonEmail===tradesperson.email && booking.status === "Done"
      );
  
      if (!hasCompletedBooking) {
        return res.status(403).json({ message: "You can only review after completing a booking" });
      }
  
      // Add review to tradesperson's profile
      const clientFullName = `${user.firstName} ${user.lastName}`;

    // Add review with only required fields
   const newReview= tradesperson.reviews.push({ client: clientFullName, rating, comment });
    await tradesperson.save();
  
      res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const getTPChats = async (req, res) => {
    try {
      const { id } = req.body;//ge to req.query if using GET
  
      if (!id) {
        return res.status(400).json({ error: "Tradesperson ID is required" });
      }
  
      const idString = id.toString();
  
      console.log("Fetching chats for tradesperson ID:", idString);
  
      // Find all messages where the tradesperson is involved
      const messages = await Message.find({ roomId: { $regex: idString, $options: "i" } });
  
      if (!messages || messages.length === 0) {
        return res.json({ message: "No chats found for this tradesperson." });
      }
  
      // Extract unique client names from messages
      const chatList = {};
      messages.forEach(({ sender, senderName, roomId }) => {
        if (sender !== id) {
          chatList[sender] = { clientId: sender, clientName: senderName, roomId };
        }
      });
  
      console.log("Fetched Tradesperson Chats:", Object.values(chatList));
      return res.json(Object.values(chatList));
  
    } catch (error) {
      console.error("Error fetching tradesperson chats:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
  
  

const generateToken = (user) => {
  // Generate JWT token with user ID and userType
  return jwt.sign({ id: user._id,email: user.email, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { signUp, login, updateProfile,getProfile,getNearbyTradespeople,getByLoc,getProfileImage ,bookingRoute,bookings_user,notifyTradesperson,acceptOrDeclineBooking,addReview,getTPChats,getByEmail };

