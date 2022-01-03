import maria from "mysql";
import config from "config";

const conn = maria.createConnection(config.get("dbConfig"));

export default conn;
