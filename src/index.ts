import express, { Request, Response } from "express";
import cors from "cors";
import users from "./routes/users";
import products from "./routes/products";
import mypage from "./routes/mypage";
import admins from "./routes/admins";

require("express-async-errors");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
  })
);

// process.on("uncaughtException", (ex) => {
//   console.log("WE GOT AN UNCAUGHT EXCEPTION");
// });

app.get("/", (req: Request, res: Response) => {
  res.send("shoes auction backend");
});

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/mypage", mypage);
app.use("/api/admins", admins);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
