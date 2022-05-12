import { Request, Response } from "express";
import mssql, { ConnectionPool } from "mssql";

import User, { UserOptions } from "../models/user";

export const users_get = async (req: Request, res: Response) => {
    const data = await (<ConnectionPool>req.app.locals.db).request().execute("dbo.uspGetAllUsers");
    const users = data.recordset.map((record) => {
        const user = new User(<UserOptions>record);
        delete user.password;
        return user;
    });
    res.json(users);
};

export const user_get = async (req: Request, res: Response) => {
    const data = await (<ConnectionPool>req.app.locals.db)
        .request()
        .input("username", mssql.VarChar, req.params.username)
        .execute(`dbo.uspGetUserByUsername`);

    if (!data.recordset[0]) return res.json({ message: "User doesn't exist" });

    const user = new User(<UserOptions>data.recordset[0]);
    delete user.password;
    res.json(user);
};
