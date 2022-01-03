import config from "config";
import jwt from "jsonwebtoken";

export default function generateAuthToken(payload: {}) {
  return jwt.sign(payload, config.get("jwtPrivateKey"));
}
