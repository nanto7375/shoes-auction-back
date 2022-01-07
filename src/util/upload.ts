import multer from "multer";
const moment = require("moment");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname); // 저장되는 파일명
  },
});

export const upload = multer({ storage: storage }).single("file");

// -----------------------------------------------

// import multer from "multer";
// import multerS3 from "multer-s3";
// import aws from "aws-sdk";

// const s3 = new aws.S3({
//   accessKeyId: process.env.S3_KEYID,
//   secretAccessKey: process.env.S3_PRIVATEKEY,
//   region: process.env.S3_REGION,
// });

// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "shoespanda",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     acl: "public-read",
//     key: (req, file, cb) => {
//       cb(null, `${Date.now()}_${file.originalname}`);
//     },
//   }),
// }).single("file");
