require('dotenv').config()
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
  secretAccessKey: process.env.SECRETACCESSKEY,
  accessKeyId: process.env.ACCESSKEYID,
  region: process.env.REGION
})

const s3 = new aws.S3()

// Only accept png / jpeg files
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'review-app-images',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '--' + file.originalname)
    }
  })
})

module.exports = upload
