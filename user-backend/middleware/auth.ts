import { Request, Response, NextFunction } from "express";
import mssql, { ConnectionPool } from "mssql";
import jwt, { JwtPayload } from "jsonwebtoken";

export const confirmAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers.authorization;
    if (!token) return res.json({ message: "Not authenticated. You need to login first!" });

    let decodedToken;
    try {
        decodedToken = <JwtPayload>jwt.verify(token, <string>process.env.SECRET_KEY);
    } catch (err: any) {
        return res.json({ message: "Invalid or expired token. Try logging in again!" });
    }

    const pool = <ConnectionPool>req.app.locals.db;
    try {
        const data = await pool
            .request()
            .input("email", mssql.VarChar, decodedToken.email)
            .execute("dbo.uspGetUserByEmail");

        let userRecord;
        if (!(userRecord = data.recordset[0]))
            return res.json({ message: "Token contained no recognizable user identification." });

        req.body.user = userRecord;
    } catch (err: any) {
        res.json({ message: err.message });
    }
    next();
};
