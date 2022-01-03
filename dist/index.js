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
require("express-async-errors");
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3001"],
    credentials: true,
}));
// process.on("uncaughtException", (ex) => {
//   console.log("WE GOT AN UNCAUGHT EXCEPTION");
// });
app.get("/", (req, res) => {
    res.send("shoes auction backend");
});
app.use("/api/users", users_1.default);
app.use("/api/products", products_1.default);
app.use("/api/mypage", mypage_1.default);
app.use("/api/admins", admins_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
//# sourceMappingURL=index.js.map