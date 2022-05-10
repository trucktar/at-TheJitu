import express, { Request, Response } from "express";
import mssql, { ConnectionPool } from "mssql";
import cors from "cors";
import env from "dotenv";

env.config();

const app = express();
const pool = new mssql.ConnectionPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: "localhost",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
});

type RequestX = Request & {
    cp?: ConnectionPool;
};

const tasks_get = async (req: RequestX, res: Response) => {
    const data = await req.cp?.request().execute("uspGetAllTasks");
    res.json(data?.recordset);
};
const task_get = async (req: RequestX, res: Response) => {
    const data = await req.cp?.request().input("id", mssql.UniqueIdentifier, req.params.id).execute("uspGetTaskById");
    if (data?.recordset[0]) return res.json(data?.recordset[0]);
    res.sendStatus(400);
};
const task_post = async (req: RequestX, res: Response) => {
    try {
        await req.cp
            ?.request()
            .input("title", mssql.VarChar, req.body.title)
            .input("description", mssql.VarChar, req.body.description || "")
            .input("dueDate", mssql.SmallDateTime, req.body.dueDate || null)
            .execute("uspCreateOrUpdateTask");
        res.json({ msg: "Task successfully created" });
    } catch (err: any) {
        res.status(400).json({ msg: `${err.message}` });
    }
};
const task_put = async (req: RequestX, res: Response) => {
    try {
        const data = await req.cp
            ?.request()
            .input("id", mssql.UniqueIdentifier, req.params.id)
            .execute("uspGetTaskById");

        const { title, description, dueDate } = data?.recordset[0];

        await req.cp
            ?.request()
            .input("id", mssql.UniqueIdentifier, req.params.id)
            .input("title", mssql.VarChar, req.body.title || title)
            .input("description", mssql.VarChar, req.body.description || description)
            .input("dueDate", mssql.SmallDateTime, req.body.dueDate || dueDate)
            .execute("uspCreateOrUpdateTask");

        res.json({ msg: "Task successfully updated" });
    } catch (err: any) {
        res.status(400).json({ msg: `${err.name}: ${err.message}` });
    }
};
const task_patch = async (req: RequestX, res: Response) => {
    try {
        await req.cp?.request().input("id", mssql.UniqueIdentifier, req.params.id).execute("uspUpdateTaskStatus");
        const data = await req.cp
            ?.request()
            .input("id", mssql.UniqueIdentifier, req.params.id)
            .execute("uspCheckTaskStatus");
        if (data?.recordset[0].isComplete) return res.json({ msg: "Task marked as complete" });
        res.json({ msg: "Task marked as incomplete" });
    } catch (err: any) {
        res.status(400).json({ msg: `${err.name}: ${err.message}` });
    }
};
const task_delete = async (req: RequestX, res: Response) => {
    try {
        await req.cp?.request().input("id", mssql.UniqueIdentifier, req.params.id).execute("uspDeleteTask");
        res.json({ msg: "Task successfully deleted" });
    } catch (err: any) {
        res.status(400).json({ msg: `${err.name}: ${err.message}` });
    }
};

app.use(async (req: RequestX, res, next) => {
    try {
        req.cp = await pool.connect();
        next();
    } catch (err: any) {
        res.json({ msg: `${err.name}: ${err.message}` });
    }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.redirect("tasks"));
app.get("/tasks", tasks_get);
app.get("/tasks/:id", task_get);
app.post("/tasks/create", task_post);
app.put("/tasks/:id/update", task_put);
app.patch("/tasks/:id/status", task_patch);
app.delete("/tasks/:id/delete", task_delete);

app.listen(7000, () => console.log("DB and Server are up and running!"));
