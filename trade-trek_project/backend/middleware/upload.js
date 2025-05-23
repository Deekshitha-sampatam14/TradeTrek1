const multer = require('multer');

// Store uploaded files in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
