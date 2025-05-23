
const mongoose = require('mongoose');

const tradespersonSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password:{ type: String, required: true,select: false },
  userType: { type: String, enum: ['user', 'tradesperson'], required: true },
  profession:{type:String,required:true},
  experience:{type:Number,required:true},
  location:{ type: [String], required: true },
  hourly_rate:{type:String},
  bio:{type:String},
  availability:{type:String},
  services_offered:{ type: [String], required: true },
  bookings: [
    {
        
        service: String,
        tradespersonEmail: String,
        client: String,
        date: Date,
        status: { type: String, enum: ['Pending', 'Accepted', 'Declined','Done'] }
    }
],
reviews: [
    {
        client: String,
        rating: Number,
        comment: String
    }
],
profileImage: {
    type: Buffer, // To store binary data
    contentType: String, // To store the MIME type of the image
  },

});

module.exports = mongoose.model('Tradesperson', tradespersonSchema);
