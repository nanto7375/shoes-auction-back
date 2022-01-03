"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = __importDefault(require("config"));
const conn = mysql_1.default.createConnection(config_1.default.get("dbConfig"));
exports.default = conn;
//# sourceMappingURL=maria.js.map