"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const maria_1 = __importDefault(require("../db/maria"));
const router = express_1.default.Router();
router.get("/productCount", (req, res) => {
    const query = req.query;
    let where = ` where 1 = 1 `;
    if (query.active)
        where += ` and pi_isactive = '${query.active}' `;
    if (query.searchQuery)
        where += ` and ${query.searchQuery} `;
    if (query.selectedBrand)
        where += ` and bi_id = '${query.selectedBrand}'`;
    if (query.selectedQuality)
        where += ` and pi_quality = '${query.selectedQuality}'`;
    let sql = `select count(*) as count from t_product_info ${where}`;
    // console.log(sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result[0])
                res.json(result[0].count);
            else
                res.status(404).send("상품수를 찾을 수 없습니다.");
        }
        else {
            console.log("admins/get/productCount error");
            throw error;
        }
    });
});
router.get("/productList", (req, res) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(400).send("잘못된 접근입니다.");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        if (decoded.admin !== 1)
            return res.status(400).send("관리자 외 접근 불가입니다.");
    }
    catch (ex) {
        res.status(400).send("인가된 토큰이 아닙니다.");
    }
    const query = req.query;
    let where = ` where 1 = 1 `;
    if (query.active)
        where += ` and pi_isactive = '${query.active}' `;
    if (query.searchQuery)
        where += ` and ${query.searchQuery} `;
    if (query.selectedBrand)
        where += ` and bi_id = '${query.selectedBrand}'`;
    if (query.selectedQuality)
        where += ` and pi_quality = '${query.selectedQuality}'`;
    let orderby = ` order by ${query.sortColumn}`;
    const start = (parseInt(query.currentPage) - 1) *
        parseInt(query.pageSize);
    let limit = ` limit ${start}, ${query.pageSize}`;
    let sql = `select pi_id, mi_id, pi_name, pi_registerdate, pi_enddate, pi_isactive, pi_quality
    from t_product_info ${where} ${orderby} ${limit}`;
    // console.log(sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result)
                res.json(result);
            else
                res.status(404).send("상품리스트를 찾을 수 없습니다.");
        }
        else {
            console.log("admins/get/productList/:query error");
            throw error;
        }
    });
});
router.post("/newQuality", (req, res) => {
    let sql = `update t_product_info set pi_quality = '${req.body.quality}' where pi_id = '${req.body.productId}'`;
    // console.log(sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            // console.log(result);
            if (result.changedRows > 0)
                res.send();
            else
                res.status(404).send("해당 상품을 찾을 수 없습니다.");
        }
        else {
            console.log("admins/post/newQuality error");
            throw error;
        }
    });
});
router.post("/newActive", (req, res) => {
    let sql = `update t_product_info set pi_isactive = '${req.body.active}' where pi_id = '${req.body.productId}'`;
    // console.log(sql);
    maria_1.default.query(sql, (error, result) => {
        // console.log(error, result);
        if (!error) {
            if (result.changedRows > 0)
                res.send();
            else
                res.status(404).send("해당 상품을 찾을 수 없습니다.");
        }
        else {
            console.log("admins/post/newActive error");
            throw error;
        }
    });
});
router.post("/sellRegister", (req, res) => {
    let sql = `update t_product_info set pi_isactive = 'd', pi_saledate = now(), pi_enddate = adddate(now(), interval pi_period day) where pi_id = '${req.body.productId}'`;
    // console.log(sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result.changedRows > 0)
                res.send();
            else
                res.status(404).send("해당 상품을 찾을 수 없습니다.");
        }
        else {
            console.log("admins/post/newActive sellRegister");
            throw error;
        }
    });
});
exports.default = router;
//# sourceMappingURL=admins.js.map