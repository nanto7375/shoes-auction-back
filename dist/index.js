"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const mypage_1 = __importDefault(require("./routes/mypage"));
const admins_1 = __importDefault(require("./routes/admins"));
const maria_1 = __importDefault(require("./db/maria"));
require("express-async-errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "https://shoespanda.s3.ap-northeast-2.amazonaws.com",
        "https://d2p9gdgimhfmnk.cloudfront.net",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use((req, res, next) => {
    console.log(JSON.stringify(req.url));
    next();
});
app.get("/", (req, res) => {
    res.send("shoes auction backend");
});
app.use("/api/users", users_1.default);
app.use("/api/products", products_1.default);
app.use("/api/mypage", mypage_1.default);
app.use("/api/admins", admins_1.default);
app.use("/api/products/productDateCheck", (req, res) => {
    res.send("ok");
});
setInterval(() => {
    try {
        const sql = "call sp_auction_end()";
        maria_1.default.query(sql);
        // console.log("dateCheck 실행");
    }
    catch (error) {
        console.log(error);
    }
}, 60000);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
app.use((req, res, next) => {
    console.log("not found");
    throw new Error("NotFoundRoute");
});
app.use((error, req, res, next) => {
    console.log(error.name);
    console.log(error.message);
    console.log(error.stack);
    if (error) {
        if (error.message === "NotFoundRoute") {
            return res.status(404).send(error.message);
        }
        res.status(500).send(error.message);
    }
});
//# sourceMappingURL=index.js.map