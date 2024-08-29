const path = require('path')
const multer = require('multer');

// Set up multer
const distfolder = path.join(__dirname, "../../frontend/public/");
const uploadFolder = path.join(distfolder, 'uploads'); // Define the uploads folder path

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination directory for uploaded files
    },
    filename: (req, file, cb) => {
      
        cb(null, Date.now() + '-' + file.originalname);// Use the original file name
    },
});
const upload = multer(
    { 
        storage: storage,
         limits: {
            fileSize: 1024 * 1024 * 5, // 5MB (adjust this size as needed)
        },
    }
    );

module.exports = upload;