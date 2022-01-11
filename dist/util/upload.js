"use strict";
// import multer from "multer";
// import moment from "moment";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
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
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_KEYID,
    secretAccessKey: process.env.AWS_PRIVATEKEY,
    region: "ap-northeast-2",
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: "shoespanda",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            cb(null, `picture/shoePic/${Date.now()}_${file.originalname}`);
        },
    }),
}).single("file");
//# sourceMappingURL=upload.js.map