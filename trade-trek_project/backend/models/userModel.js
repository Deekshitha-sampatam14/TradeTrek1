const mongoose=require('mongoose');

const schema=mongoose.Schema({
    firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true,select: false },
  location:{ type: [String], required: true },
  userType: { type: String, enum: ['user', 'tradesperson'], required: true },
  profileImage: {
    type: Buffer, // To store binary data
    contentType: String, // To store the MIME type of the image
  },
  
  bookings: [
    {
        service: String,
        tradespersonEmail: String,
        date: Date,
        status: { type: String, enum: ['Pending', 'Accepted', 'Declined','Done'] }
    }
],

})
module.exports=mongoose.model('User',schema);