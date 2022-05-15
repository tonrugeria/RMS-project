const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './company_logo')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '_' + Date.now() + '_' + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
})

const multipleUploads = upload.fields([
  {name: "file1"},
  {name: "file2"}
])

module.exports = multipleUploads