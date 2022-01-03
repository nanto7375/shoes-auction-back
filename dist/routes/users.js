"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const maria_1 = __importDefault(require("../db/maria"));
const generateAuthToken_1 = __importDefault(require("../util/generateAuthToken"));
const router = express_1.default.Router();
/* 로그인 */
router.post("/login", (req, res) => {
    const sql = `select mi_id, mi_pwd, mi_isadmin from t_member_info where mi_id = '${req.body.id.trim()}'`;
    maria_1.default.query(sql, function (error, result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!error) {
                if (result[0]) {
                    /* 입력한 아이디가 존재하는 경우 */
                    const validPassword = yield bcrypt_1.default.compare(req.body.password.trim(), result[0].mi_pwd);
                    if (!validPassword)
                        return res.status(400).send("아이디 또는 비밀번호를 확인하세요.");
                    const token = (0, generateAuthToken_1.default)({
                        id: result[0].mi_id,
                        admin: result[0].mi_isadmin,
                    });
                    res.send(token);
                }
                else {
                    /* 아이디가 없는 경우 */
                    res.status(400).send("아이디 또는 비밀번호를 확인하세요.");
                }
            }
            else {
                console.log("user/post/login error");
                throw error;
            }
        });
    });
});
/* 회원가입 */
router.post("/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
    const sql = `insert into t_member_info (mi_id, mi_pwd, mi_name, mi_phone, mi_address) 
               values ('${req.body.id}','${encryptedPassword}', '${req.body.name}', '${req.body.phone}', '${req.body.address.trim()}')`;
    maria_1.default.query(sql, function (error, result) {
        if (!error) {
            if (result.affectedRows > 0) {
                const token = (0, generateAuthToken_1.default)({
                    id: req.body.id,
                });
                res
                    .header("x-auth-token", token)
                    .header("access-control-expose-headers", "x-auth-token")
                    .send();
            }
            else
                res.status(400).send("회원가입에 실패했습니다.");
        }
        else {
            console.log("user/post/join error");
            throw error;
        }
    });
}));
/* 회원가입 할 때, id check */
router.get("/:id", (req, res) => {
    const sql = `select mi_id from t_member_info where mi_id = '${req.params.id}'`;
    maria_1.default.query(sql, function (error, result) {
        if (!error) {
            if (result[0]) {
                /* 이미 존재하는 아이디인 경우 */
                res.status(400).send("이미 등록된 아이디입니다.");
            }
            else {
                /* 가입 가능한 아이디인 경우 */
                res.send();
            }
        }
        else {
            console.log("user/get/:id error");
            throw error;
        }
    });
});
exports.default = router;
//# sourceMappingURL=users.js.map