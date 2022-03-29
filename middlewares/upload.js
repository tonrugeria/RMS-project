const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './photo')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '_' + Date.now() + '_' + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
}).single('photo')

module.exports = upload