"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const maria_1 = __importDefault(require("../db/maria"));
const router = express_1.default.Router();
router.get("/recentProductList", auth_1.default, (req, res) => {
    const sql = `select a.pi_id, a.mi_id, pi_name, bi_name, pi_size, pi_quality, pi_img, pi_enddate, pi_isactive, ifnull(pi_maxprice, pi_startprice) pi_price, max(pl_index) new_index
    from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id inner join t_product_log c on a.pi_id = c.pi_id
    left outer join (select pi_id, max(pa_price) pi_maxprice from t_product_auction group by pi_id) d on a.pi_id = d.pi_id
    where c.mi_id = '${req.query.userId}' group by c.pi_id order by new_index desc limit 3`;
    // console.log("resentProductList", sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result)
                res.json(result);
            else
                res.status(404).send("최근 상품리스트를 찾을 수 없습니다.");
        }
        else {
            console.log("products/get/productList/:query error");
            throw error;
        }
    });
});
router.get("/buyAuctionCount", (req, res) => {
    const query = req.query;
    let where = ` where ${query.active}`;
    if (query.searchQuery)
        where += ` and ${query.searchQuery} `;
    let sql = `select count(distinct c.pi_id) as count
  from t_product_info a, t_brand_info b, t_product_auction c ${where} and a.bi_id = b.bi_id and a.pi_id = c.pi_id and c.mi_id = '${query.userId}'`;
    // console.log("buyAuctionCount", sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result[0])
                res.json(result[0].count);
            else
                res.status(404).send("입찰한 상품수를 찾을 수 없습니다.");
        }
        else {
            console.log("mypage/get/buyAuctionCount error");
            throw error;
        }
    });
});
router.get("/buyAuctionList", auth_1.default, (req, res) => {
    const query = req.query;
    // console.log(query);
    let where = ` where ${query.active}`;
    if (query.searchQuery)
        where += ` and ${query.searchQuery} `;
    let orderby = ` order by ${query.sortColumn}`;
    const start = (parseInt(query.currentPage) - 1) *
        parseInt(query.pageSize);
    let limit = ` limit ${start}, ${query.pageSize}`;
    let sql = `select a.pi_id, pi_name, bi_name, pi_size, pi_quality, pi_img, pi_enddate, pi_isactive, max(pa_price) pi_price, pi_maxprice, pa_result, max(pa_index) auction_index
    from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id inner join t_product_auction c on a.pi_id = c.pi_id
    inner join (select pi_id, max(pa_price) pi_maxprice from t_product_auction group by pi_id) d on a.pi_id = d.pi_id
    ${where} and c.mi_id = '${query.userId}' group by c.pi_id  ${orderby} ${limit}`;
    // console.log("buyAuctionList", sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result)
                res.json(result);
            else
                res.status(404).send("입찰한 상품리스트를 찾을 수 없습니다.");
        }
        else {
            console.log("products/get/productList/:query error");
            throw error;
        }
    });
});
router.get("/sellAuctionCount", (req, res) => {
    const query = req.query;
    let where = ` where ${query.active}`;
    if (query.searchQuery)
        where += ` and ${query.searchQuery} `;
    let sql = `select count(*) as count
  from t_product_info a, t_brand_info b ${where} and a.bi_id = b.bi_id and a.mi_id = '${query.userId}'`;
    // console.log("sellAuctionCount", sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result[0])
                res.json(result[0].count);
            else
                res.status(404).send("등록한 상품 수를 찾을 수 없습니다.");
        }
        else {
            console.log("mypage/get/buyAuctionCount error");
            throw error;
        }
    });
});
router.get("/sellAuctionList", auth_1.default, (req, res) => {
    const query = req.query;
    let where = ` where ${query.active}`;
    let orderby = ` order by ${query.sortColumn}`;
    if (query.searchQuery)
        where += ` and ${query.searchQuery} `;
    const start = (parseInt(query.currentPage) - 1) *
        parseInt(query.pageSize);
    let limit = ` limit ${start}, ${query.pageSize}`;
    let sql = `select a.pi_id, pi_name, bi_name, pi_size, pi_quality, pi_img, pi_enddate, pi_isactive, ifnull(max(pa_price), 0) pi_maxprice, pi_startprice pi_price
  from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id left outer join t_product_auction c on a.pi_id = c.pi_id
    ${where} and a.mi_id = '${query.userId}' group by a.pi_id ${orderby} ${limit}`;
    // console.log("sellAuctionList", sql);
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result)
                res.json(result);
            else
                res.status(404).send("등록한 상품 리스트를 찾을 수 없습니다.");
        }
        else {
            console.log("products/get/productList/:query error");
            throw error;
        }
    });
});
router.post("/pay", (req, res) => {
    const body = req.body;
    const sql = `call sp_pay('${body.userId}', '${body.productId}')`;
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result.affectedRows > 1)
                res.send();
            else
                res.status(400).send("결제에 실패했습니다.");
        }
        else {
            console.log("products/post/pay error");
            throw error;
        }
    });
});
router.post("/auctionCancel", (req, res) => {
    const sql = `call sp_auction_cancel('${req.body.productId}')`;
    maria_1.default.query(sql, (error, result) => {
        if (!error) {
            if (result.affectedRows > 1)
                res.send();
            else
                res.status(400).send("판매취소에 실패했습니다.");
        }
        else {
            console.log("products/post/auctionCancel error");
            throw error;
        }
    });
});
exports.default = router;
//# sourceMappingURL=mypage.js.map