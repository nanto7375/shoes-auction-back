import jwt from "jsonwebtoken";
import config from "config";

export default function (req, res, next) {
  console.log(req.header("x-auth-token"));
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("잘못된 접근입니다.");

  try {
    const decoded: any = jwt.verify(token, config.get("jwtPrivateKey"));
    if (decoded.id === req.query.id || decoded.id === req.query.userId)
      return next();
    res.status(400).send("토큰 정보가 다릅니다.");
  } catch (ex) {
    res.status(400).send("인가된 사용자가 아닙니다.");
  }
}
