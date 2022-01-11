import express, { Request, Response } from "express";
import Joi from "joi";
import auth from "../middleware/auth";
import { upload } from "../util/upload";

// import { s3Client } from "../util/upload";
// import { PutObjectCommand } from "@aws-sdk/client-s3";

import conn from "../db/maria";

const router = express.Router();

const auctionSchema = Joi.object({
  userId: Joi.string().max(20).required(),
  productId: Joi.string().max(20).required(),
  price: Joi.number().integer().max(99999999).required(),
});

router.get("/brandList", (req: Request, res: Response) => {
  const sql = `select bi_id, bi_name from t_brand_info where bi_isactive = 'y' order by bi_index`;

  // console.log(sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("등록된 브랜드를 찾을 수 없습니다.");
    } else {
      console.log("products/get/brandList error");
      throw error;
    }
  });
});

router.get("/productList", (req: Request, res: Response) => {
  const query = req.query;

  // console.log("hi productList api");

  let where = ` where ${query.active}`;
  if (query.searchQuery) where += ` and pi_name like '%${query.searchQuery}%' `;
  if (query.selectedBrand) where += ` and a.bi_id = '${query.selectedBrand}'`;

  let orderby = ` order by ${query.sortColumn}`;

  const start =
    (parseInt(query.currentPage as string) - 1) *
    parseInt(query.pageSize as string);
  let limit = ` limit ${start}, ${query.pageSize}`;

  let sql = `select a.pi_id, pi_name, a.mi_id, a.bi_id, pi_size, pi_quality, ifnull(max(pa_price), pi_startprice) pi_price, pi_img, pi_saledate, pi_enddate, pi_isactive
    from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id left outer join t_product_auction c on a.pi_id = c.pi_id
    ${where} group by a.pi_id ${orderby} ${limit}`;

  // console.log(sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("등록된 상품을 찾을 수 없습니다.");
    } else {
      console.log("products/get/productList/:query error");
      throw error;
    }
  });
});

router.get("/productCount", (req: Request, res: Response) => {
  const query = req.query;

  let where = ` where ${query.active}`;
  if (query.searchQuery) where += ` and pi_name like '%${query.searchQuery}%' `;
  if (query.selectedBrand) where += ` and bi_id = '${query.selectedBrand}'`;

  let sql = `select count(*) as count
  from t_product_info ${where}`;

  // console.log(sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result[0]) res.json(result[0].count);
      else res.status(404).send("등록된 상품수를 찾을 수 없습니다.");
    } else {
      console.log("products/get/productCount error");
      throw error;
    }
  });
});

router.get("/product/:id", (req: Request, res: Response) => {
  const sql = `select a.pi_id, pi_name, a.mi_id, bi_name, pi_size, pi_quality, pi_startprice pi_price, pi_img, pi_enddate, pi_isactive, max(pa_price) pi_maxprice
  from t_product_info a inner join t_brand_info b on a.bi_id = b.bi_id left outer join t_product_auction c on a.pi_id = c.pi_id where a.pi_id = '${req.params.id}' group by a.pi_id`;

  // console.log(sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result[0]) res.json(result[0]);
      else res.status(404).send("해당하는 상품을 찾을 수 없습니다.");
    } else {
      console.log("prodcts/get/product/:id error");
      throw error;
    }
  });
});

router.get("/auctionList", (req: Request, res: Response) => {
  const start =
    (parseInt(req.query.currentPage as string) - 1) *
    parseInt(req.query.pageSize as string);
  const sql = `select pa_index, pi_id, mi_id, pa_price, pa_date, pa_result
  from t_product_auction where pi_id = '${req.query.id}' order by pa_price desc limit ${start}, ${req.query.pageSize}`;

  // console.log("auctionList", sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result) res.json(result);
      else res.status(404).send("해당 상품의 입찰리스트를 찾을 수 없습니다.");
    } else {
      console.log("products/get/auctionList error");
      throw error;
    }
  });
});

router.get("/auctionCount", (req: Request, res: Response) => {
  const sql = `select count(*) count from t_product_auction where pi_id = '${req.query.id}'`;

  // console.log("auctionCount", sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result) res.json(result[0].count);
      else res.status(404).send("해당 상품의 입찰건수를 찾을 수 없습니다.");
    } else {
      console.log("products/get/auctionCount error");
      throw error;
    }
  });
});

router.post("/auction", auth, (req: Request, res: Response) => {
  // console.log(req.body);
  const { error } = auctionSchema.validate(req.body);
  if (error) return res.status(400).send(error);

  const sql = `call sp_insert_auction('${req.body.userId}', '${req.body.productId}', ${req.body.price})`;

  // console.log("auction", sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result.affectedRows > 1) res.send();
      else res.status(400).send("해당 상품은 입찰할 수 없습니다.");
    } else {
      console.log("products/post/auction error");
      throw error;
    }
  });
});

router.post("/upload", (req: Request, res: Response) => {
  // console.log("upload 실행!!!!!!!!!");

  upload(req, res, (error) => {
    if (error) {
      // console.log("upload 오류 발생!!!!!!!!");
      console.log(error);
      res.status(500).send("사진 업로드에 실패했습니다.");
    } else {
      // console.log("upload 성공!!!!!!!!!!");
      const file: any = req.file as Express.Multer.File;
      console.log(file.key);
      const filename = file.key.substring(file.key.lastIndexOf("/") + 1);
      res.json({ success: true, fileName: filename });
    }
  });
});

// router.post("/upload", (req: Request, res: Response) => {
//   console.log("upload 실행!!!!!!!!!");
//   console.log(req.body);
//   const bucketParams = {
//     Bucket: "shoespanda",
//     // Specify the name of the new object. For example, 'index.html'.
//     // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
//     Key: "picture/shoePic/testtest",
//     // Content of the new object.
//     Body: "testtest",
//   };
//   const run = async () => {
//     try {
//       const data = await s3Client.send(new PutObjectCommand(bucketParams));
//       console.log(
//         "Successfully uploaded object: " +
//           bucketParams.Bucket +
//           "/" +
//           bucketParams.Key
//       );
//       return data; // For unit tests.
//     } catch (err) {
//       console.log("Error", err);
//     }
//   };
//   run();
// });

router.post("/register", (req: Request, res: Response) => {
  const body = req.body;
  const sql = `call sp_insert_register('${body.productName}', '${body.userId}', '${body.brand}', '${body.size}', '${body.image}', ${body.price}, ${body.period}, '${body.address}', '${body.bank}', '${body.account}')`;

  // console.log(
  //   `register의 sql문은 :\n ${sql}\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`
  // );

  conn.query(sql, (error, result) => {
    if (!error) {
      // console.log(result);
      if (result.affectedRows > 2) res.send();
      else res.status(400).send("상품 등록에 실패했습니다.");
    } else {
      console.log("products/post/register error");
      throw error;
    }
  });
});

router.post("/productLog", (req: Request, res: Response) => {
  const sql = `insert into t_product_log (pi_id, mi_id) values ('${req.body.productId}', '${req.body.memberId}')`;

  // console.log("productLog", sql);

  conn.query(sql, (error, result) => {
    if (!error) {
      // console.log(result);
      if (result.affectedRows > 0) res.send();
      else res.status(400).send("로그 등록에 실패했습니다.");
    } else {
      console.log("products/post/productLog error");
      throw error;
    }
  });
});

router.get("/address", (req: Request, res: Response) => {
  const sql = `select mi_address from t_member_info where mi_id = '${req.query.id}'`;

  // console.log(sql);

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result[0]) res.json(result[0].mi_address);
      else res.status(404).send("주소를 찾을 수 없습니다.");
    } else {
      console.log("prodcts/get/address");
      throw error;
    }
  });
});

export default router;
