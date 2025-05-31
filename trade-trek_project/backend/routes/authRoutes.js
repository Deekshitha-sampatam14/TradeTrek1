const express=require('express');
const authController=require('../controllers/authController');
const authMiddleware=require('../middleware/authMiddleware');
const router=express.Router();
 // Directory to store uploaded files
const multer = require('multer');
const path = require('path');
const upload = require('../middleware/upload');

router.post('/signup', upload.single('image'), authController.signUp);
//router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.put('/update-profile',upload.single('profilePic'), authController.updateProfile);
router.get('/profile',authMiddleware,authController.getProfile); 
router.post('/nearby', authController.getNearbyTradespeople);
router.post('/nearby_loc',authController.getByLoc);
router.get('/profile-image/:id', authController.getProfileImage);
router.post('/bookings',authMiddleware,authController.bookingRoute);
router.get('/bookings/user', authMiddleware,authController.bookings_user);
router.post('/notify-tradesperson',authController.notifyTradesperson);
router.post('/booking_accept_decline',authController.acceptOrDeclineBooking);
router.post("/add-review", authController.addReview);
router.post("/getTradespersonChats",authController.getTPChats);
router.post('/getbyemail', authController.getByEmail);

module.exports=router;