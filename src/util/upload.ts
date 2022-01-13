/* s3 업로드 aws-sdk v3 */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "ap-northeast-2" });

export const s3Upload = async (bucket, key, body) => {
  try {
    const data = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      })
    );
    return data;
  } catch (err) {
    throw err;
  }
};

/* s3 업로드 aws-sdk v2. 실패작: 서버에도 저장된다. */
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

/* db server에 업로드 */
// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// export const upload = multer({ storage: storage }).single("file");

// console.log(process.memoryUsage());
