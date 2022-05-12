import { Request, Response } from "express";
import mssql, { ConnectionPool } from "mssql";
import { v1 as uuid1 } from "uuid";
import jwt from "jsonwebtoken";

import User, { UserOptions } from "../models/user";

export const register_post = async (req: Request, res: Response) => {
    const user = new User(req.body);

    try {
        await user.validateForRegistration();
    } catch (err: any) {
        return res.json({ message: err.message });
    }

    await user.hashPassword();

    const pool = <ConnectionPool>req.app.locals.db;
    try {
        await pool
            .request()
            .input("id", mssql.VarChar, uuid1())
            .input("username", mssql.VarChar, user.username)
            .input("fullname", mssql.VarChar, user.fullname)
            .input("email", mssql.VarChar, user.email)
            .input("age", mssql.TinyInt, user.age)
            .input("role", mssql.VarChar, user.role)
            .input("password", mssql.VarChar, user.password)
            .execute("dbo.uspCreateUser");
    } catch (err: any) {
        return res.json({ message: `The email '${user.email}' already exists` });
    }
    res.json({ message: "Registration successful" });
};

export const login_post = async (req: Request, res: Response) => {
    let user = new User(req.body);

    try {
        await user.validateForLogin();
    } catch (err: any) {
        return res.json({ message: err.message });
    }

    const pool: ConnectionPool = req.app.locals.db;
    try {
        const data = await pool.request().input("email", mssql.VarChar, user.email).execute("dbo.uspGetUserByEmail");

        let userRecord;
        if ((userRecord = data.recordset[0]))
            if (await user.validatePassword(userRecord.password)) {
                const { fullname, email } = <UserOptions>data.recordset[0];
                const token = jwt.sign({ fullname, email }, <string>process.env.SECRET_KEY, { expiresIn: "10m" });

                return res.json({ message: "Login successful", token });
            }

        return res.json({ message: "Invalid credentials" });
    } catch (err: any) {}
    res.json(user);
};

export const reset_post = async (req: Request, res: Response) => {
    
};
