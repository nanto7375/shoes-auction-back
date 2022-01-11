"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function default_1(req, res, next) {
    // console.log(req.header("x-auth-token"));
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(400).send("잘못된 접근입니다.");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        // console.log(decoded);
        if (decoded.id !== req.body.userId && decoded.id !== req.query.userId)
            return res.status(400).send("토큰 정보가 다릅니다.");
        next();
    }
    catch (ex) {
        res.status(400).send("인가된 토큰이 아닙니다.");
    }
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map