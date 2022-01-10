import express, { Request, Response } from "express";
import cors from "cors";
import users from "./routes/users";
import products from "./routes/products";
import mypage from "./routes/mypage";
import admins from "./routes/admins";

import conn from "./db/maria";

require("express-async-errors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://shoespanda.s3.ap-northeast-2.amazonaws.com",
      "https://d2p9gdgimhfmnk.cloudfront.net",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("shoes auction backend");
});

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/mypage", mypage);
app.use("/api/admins", admins);

setInterval(() => {
  try {
    const sql = "call sp_auction_end()";
    conn.query(sql);
    // console.log("dateCheck 실행");
  } catch (error) {
    console.log(error);
  }
}, 60000);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
