// import multer from "multer";
// import moment from "moment";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname); // 저장되는 파일명
//   },
// });

// export const upload = multer({ storage: storage }).single("file");

// -----------------------------------------------

import multer from "multer";
import multerS3 from "multer-s3";
// import { S3 } from "aws-sdk";
//import * as S3 from " aws-sdk/clients/s3";

const S3 = require("aws-sdk");
const s3 = new S3({
  accessKeyId: process.env.AWS_KEYID,
  secretAccessKey: process.env.AWS_PRIVATEKEY,
  region: "ap-northeast-2",
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "shoespanda",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `picture/shoePic/${Date.now()}_${file.originalname}`);
    },
  }),
}).single("file");
