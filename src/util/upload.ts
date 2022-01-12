// console.log(process.memoryUsage());

/* db server에 업로드 */
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

/* s3 업로드 aws-sdk v2 */

// import multer from "multer";
// import multerS3 from "multer-s3";

// import S3 from "aws-sdk/clients/s3";

// const s3 = new S3({
//   accessKeyId: process.env.AWS_KEYID,
//   secretAccessKey: process.env.AWS_PRIVATEKEY,
//   region: "ap-northeast-2",
// });

// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "shoespanda",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     acl: "public-read",
//     key: (req, file, cb) => {
//       cb(null, `picture/shoePic/${Date.now()}_${file.originalname}`);
//     },
//   }),
// }).single("file");

/* s3 업로드 aws-sdk v3 */

import multer from "multer";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({ region: "ap-northeast-2" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const upload = multer({ storage }).single("file");

// console.log(process.memoryUsage());
