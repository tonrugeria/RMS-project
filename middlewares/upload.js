const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../photo')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  // fileFilter: function(req, file, cb){
  //   checkFileType(file, cb);
  // }
}).single('myImage')

module.exports = upload