import express, { Request, Response } from "express";
import mssql from "mssql";
import dotenv from "dotenv";

dotenv.config();

import dbConf from "./config/dbconf";

const app = express();

(async () => {
    try {
        app.locals.db = await mssql.connect(dbConf);
    } catch (err) {
        console.error(err);
    }
})();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(7000, () => {
    console.log("Web and SQL Servers are up...");
});
