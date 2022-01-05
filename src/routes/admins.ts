import express, { Request, Response } from "express";

import conn from "../db/maria";

const router = express.Router();

console.log("hello admins");

router.get("/productCount", (req: Request, res: Response) => {
  const query = req.query;

  let where = ` where 1 = 1 `;
  if (query.active) where += ` and pi_isactive = '${query.active}' `;
  if (query.searchQuery) where += ` and ${query.searchQuery} `;
  if (query.selectedBrand) where += ` and bi_id = '${query.selectedBrand}'`;
  if (query.selectedQuality)
    where += ` and pi_quality = '${query.selectedQuality}'`;

  let sql = `select count(*) as count from t_product_info ${where}`;

  // console.log(sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result[0]) res.json(result[0].count);
      else res.status(404).send("상품수를 찾을 수 없습니다.");
    } else {
      console.log("admins/get/productCount error");
      throw error;
    }
  });
});

router.get("/productList", (req: Request, res: Response) => {
  const query = req.query;

  let where = ` where 1 = 1 `;
  if (query.active) where += ` and pi_isactive = '${query.active}' `;
  if (query.searchQuery) where += ` and ${query.searchQuery} `;
  if (query.selectedBrand) where += ` and bi_id = '${query.selectedBrand}'`;
  if (query.selectedQuality)
    where += ` and pi_quality = '${query.selectedQuality}'`;

  let orderby = ` order by ${query.sortColumn}`;

  const start =
    (parseInt(query.currentPage as string) - 1) *
    parseInt(query.pageSize as string);
  let limit = ` limit ${start}, ${query.pageSize}`;

  let sql = `select pi_id, mi_id, pi_name, pi_registerdate, pi_enddate, pi_isactive, pi_quality
    from t_product_info ${where} ${orderby} ${limit}`;

  // console.log(sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("상품리스트를 찾을 수 없습니다.");
    } else {
      console.log("admins/get/productList/:query error");
      throw error;
    }
  });
});

router.post("/newQuality", (req: Request, res: Response) => {
  let sql = `update t_product_info set pi_quality = '${req.body.quality}' where pi_id = '${req.body.productId}'`;

  // console.log(sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      console.log(result);
      if (result.changedRows > 0) res.send();
      else res.status(404).send("해당 상품을 찾을 수 없습니다.");
    } else {
      console.log("admins/post/newQuality error");
      throw error;
    }
  });
});

router.post("/newActive", (req: Request, res: Response) => {
  let sql = `update t_product_info set pi_isactive = '${req.body.active}' where pi_id = '${req.body.productId}'`;

  // console.log(sql);

  conn.query(sql, (error, result) => {
    console.log(error, result);
    if (!error) {
      if (result.changedRows > 0) res.send();
      else res.status(404).send("해당 상품을 찾을 수 없습니다.");
    } else {
      console.log("admins/post/newActive error");
      throw error;
    }
  });
});

router.post("/sellRegister", (req: Request, res: Response) => {
  let sql = `update t_product_info set pi_isactive = 'd', pi_saledate = now(), pi_enddate = adddate(now(), interval pi_period day) where pi_id = '${req.body.productId}'`;

  // console.log(sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      if (result.changedRows > 0) res.send();
      else res.status(404).send("해당 상품을 찾을 수 없습니다.");
    } else {
      console.log("admins/post/newActive sellRegister");
      throw error;
    }
  });
});

export default router;
