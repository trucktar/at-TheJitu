import express, { Request, Response } from "express";
import mssql from "mssql";
import dotenv from "dotenv";

dotenv.config();

import dbConf from "./config/dbconf";
import { confirmAuthentication } from "./middleware/auth";
import auth from "./routes/auth";
import users from "./routes/users";

const app = express();

(async () => {
    try {
        app.locals.db = await mssql.connect(dbConf);
    } catch (err) {
        console.error(err);
    }
})();

app.use(express.json());
app.get("/", [
    confirmAuthentication,
    (req: Request, res: Response) => {
        const user = req.body.user;
        res.json({ message: `Hello ${user.username}. Welcome!` });
    },
]);

app.use("/auth", auth);
app.use("/users", users);

// Error handler
app.use((req, res, next) => {
    return res.status(404);
});

app.listen(7000, () => {
    console.log("Web and SQL Servers are up...");
});
