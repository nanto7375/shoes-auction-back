import jwt from "jsonwebtoken";
import config from "config";

export default function (req, res, next) {
  // console.log(req.header("x-auth-token"));
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("잘못된 접근입니다.");

  try {
    const decoded: any = jwt.verify(token, config.get("jwtPrivateKey"));
    // console.log(decoded);
    if (decoded.id !== req.body.userId && decoded.id !== req.query.userId)
      return res.status(400).send("토큰 정보가 다릅니다.");
    next();
  } catch (ex) {
    res.status(400).send("인가된 토큰이 아닙니다.");
  }
}
