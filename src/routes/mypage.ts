import express, { Request, Response } from "express";

import conn from "../db/maria";

const router = express.Router();

router.get("/recentProductList", (req: Request, res: Response) => {
  const sql = `select a.pi_id, a.mi_id, pi_name, bi_name, pi_size, pi_quality, pi_img, pi_enddate, pi_isactive, ifnull(pi_maxprice, pi_startprice) pi_price, max(pl_index) new_index
    from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id inner join t_product_log c on a.pi_id = c.pi_id
    left outer join (select pi_id, max(pa_price) pi_maxprice from t_product_auction group by pi_id) d on a.pi_id = d.pi_id
    where c.mi_id = '${req.query.userId}' group by c.pi_id order by new_index desc limit 3`;

  // console.log("resentProductList", sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("최근 상품리스트를 찾을 수 없습니다.");
    } else {
      console.log("products/get/productList/:query error");
      throw error;
    }
  });
});

router.get("/buyAuctionCount", (req: Request, res: Response) => {
  const query = req.query;

  let where = ` where ${query.active}`;
  if (query.searchQuery) where += ` and ${query.searchQuery} `;

  let sql = `select count(distinct c.pi_id) as count
  from t_product_info a, t_brand_info b, t_product_auction c ${where} and a.bi_id = b.bi_id and a.pi_id = c.pi_id and c.mi_id = '${query.userId}'`;

  // console.log("buyAuctionCount", sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result[0]) res.json(result[0].count);
      else res.status(404).send("입찰한 상품수를 찾을 수 없습니다.");
    } else {
      console.log("mypage/get/buyAuctionCount error");
      throw error;
    }
  });
});

router.get("/buyAuctionList", (req: Request, res: Response) => {
  const query = req.query;

  // console.log(query);

  let where = ` where ${query.active}`;
  if (query.searchQuery) where += ` and ${query.searchQuery} `;

  let orderby = ` order by ${query.sortColumn}`;

  const start =
    (parseInt(query.currentPage as string) - 1) *
    parseInt(query.pageSize as string);
  let limit = ` limit ${start}, ${query.pageSize}`;

  let sql = `select a.pi_id, pi_name, bi_name, pi_size, pi_quality, pi_img, pi_enddate, pi_isactive, max(pa_price) pi_price, pi_maxprice, pa_result, max(pa_index) auction_index
    from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id inner join t_product_auction c on a.pi_id = c.pi_id
    inner join (select pi_id, max(pa_price) pi_maxprice from t_product_auction group by pi_id) d on a.pi_id = d.pi_id
    ${where} and c.mi_id = '${query.userId}' group by c.pi_id  ${orderby} ${limit}`;

  // console.log("buyAuctionList", sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("입찰한 상품리스트를 찾을 수 없습니다.");
    } else {
      console.log("products/get/productList/:query error");
      throw error;
    }
  });
});

router.get("/sellAuctionCount", (req: Request, res: Response) => {
  const query = req.query;

  let where = ` where ${query.active}`;
  if (query.searchQuery) where += ` and ${query.searchQuery} `;

  let sql = `select count(*) as count
  from t_product_info a, t_brand_info b ${where} and a.bi_id = b.bi_id and a.mi_id = '${query.userId}'`;

  // console.log("sellAuctionCount", sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result[0]) res.json(result[0].count);
      else res.status(404).send("등록한 상품 수를 찾을 수 없습니다.");
    } else {
      console.log("mypage/get/buyAuctionCount error");
      throw error;
    }
  });
});

router.get("/sellAuctionList", (req: Request, res: Response) => {
  const query = req.query;

  let where = ` where ${query.active}`;

  let orderby = ` order by ${query.sortColumn}`;
  if (query.searchQuery) where += ` and ${query.searchQuery} `;

  const start =
    (parseInt(query.currentPage as string) - 1) *
    parseInt(query.pageSize as string);
  let limit = ` limit ${start}, ${query.pageSize}`;

  let sql = `select a.pi_id, pi_name, bi_name, pi_size, pi_quality, pi_img, pi_enddate, pi_isactive, ifnull(max(pa_price), 0) pi_maxprice, pi_startprice pi_price
  from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id left outer join t_product_auction c on a.pi_id = c.pi_id
    ${where} and a.mi_id = '${query.userId}' group by a.pi_id ${orderby} ${limit}`;

  // console.log("sellAuctionList", sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("등록한 상품 리스트를 찾을 수 없습니다.");
    } else {
      console.log("products/get/productList/:query error");
      throw error;
    }
  });
});

router.post("/pay", (req: Request, res: Response) => {
  const body = req.body;
  const sql = `call sp_pay('${body.userId}', '${body.productId}')`;

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result.affectedRows > 1) res.send();
      else res.status(400).send("결제에 실패했습니다.");
    } else {
      console.log("products/post/pay error");
      throw error;
    }
  });
});

router.post("/auctionCancel", (req: Request, res: Response) => {
  const sql = `call sp_auction_cancel('${req.body.productId}')`;

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result.affectedRows > 1) res.send();
      else res.status(400).send("판매취소에 실패했습니다.");
    } else {
      console.log("products/post/auctionCancel error");
      throw error;
    }
  });
});

export default router;
