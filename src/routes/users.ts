import express, { Request, response, Response } from "express";
import bcrypt from "bcrypt";

import conn from "../db/maria";
import generateAuthToken from "../util/generateAuthToken";
import { resourceLimits } from "worker_threads";

const router = express.Router();

/* 로그인 */
router.post("/login", (req: Request, res: Response) => {
  const sql = `select mi_id, mi_pwd, mi_isadmin from t_member_info where mi_id = '${req.body.id.trim()}'`;

  conn.query(sql, async function (error, result) {
    if (!error) {
      if (result[0]) {
        /* 입력한 아이디가 존재하는 경우 */
        const validPassword = await bcrypt.compare(
          req.body.password.trim(),
          result[0].mi_pwd
        );
        if (!validPassword)
          return res.status(400).send("아이디 또는 비밀번호를 확인하세요.");

        const token = generateAuthToken({
          id: result[0].mi_id,
          admin: result[0].mi_isadmin,
        });
        res.send(token);
      } else {
        /* 아이디가 없는 경우 */
        res.status(400).send("아이디 또는 비밀번호를 확인하세요.");
      }
    } else {
      console.log("user/post/login error");
      throw error;
    }
  });
});

/* 회원가입 */
router.post("/join", async (req: Request, res: Response) => {
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);
  const sql = `insert into t_member_info (mi_id, mi_pwd, mi_name, mi_phone, mi_address) 
               values ('${req.body.id}','${encryptedPassword}', '${
    req.body.name
  }', '${req.body.phone}', '${req.body.address.trim()}')`;

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result.affectedRows > 0) {
        const token = generateAuthToken({
          id: req.body.id,
        });
        res
          .header("x-auth-token", token)
          .header("access-control-expose-headers", "x-auth-token")
          .send();
      } else res.status(400).send("회원가입에 실패했습니다.");
    } else {
      console.log("user/post/join error");
      throw error;
    }
  });
});

/* 회원가입 할 때, id check */
router.get("/:id", (req: Request, res: Response) => {
  const sql = `select mi_id from t_member_info where mi_id = '${req.params.id}'`;

  conn.query(sql, function (error, result) {
    if (!error) {
      if (result[0]) {
        /* 이미 존재하는 아이디인 경우 */
        res.status(400).send("이미 등록된 아이디입니다.");
      } else {
        /* 가입 가능한 아이디인 경우 */
        res.send();
      }
    } else {
      console.log("user/get/:id error");
      throw error;
    }
  });
});

export default router;
