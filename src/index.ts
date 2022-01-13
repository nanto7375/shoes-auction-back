import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import users from "./routes/users";
import products from "./routes/products";
import mypage from "./routes/mypage";
import admins from "./routes/admins";

import conn from "./db/maria";

// require("express-async-errors");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.use(
  cors({
    origin: [
      "https://shoespanda.s3.ap-northeast-2.amazonaws.com",
      "https://d2p9gdgimhfmnk.cloudfront.net",
      "https://d1jvo94wodsm0s.cloudfront.net",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(JSON.stringify(req.url));
//   next();
// });

app.get("/", (req: Request, res: Response) => {
  res.send("shoes auction backend");
});

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/mypage", mypage);
app.use("/api/admins", admins);

app.use("/api/products/productDateCheck", (req: Request, res: Response) => {
  res.send("ok");
});

// setInterval(() => {
//   try {
//     const sql = "call sp_auction_end()";
//     conn.query(sql);
//     // console.log("dateCheck 실행");
//   } catch (error) {
//     console.log(error);
//   }
// }, 60000);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log("not found");
//   throw new Error("NotFoundRoute");
// });

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error.name);
  console.log(error.message);
  console.log(error.stack);
  if (error) {
    if (error.message === "NotFoundRoute") {
      return res.status(404).send(error.message);
    }
    res.status(500).send(error.message);
  }
});
