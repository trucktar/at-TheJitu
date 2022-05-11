import express, { Request, Response } from "express";
import mssql, { ConnectionPool } from "mssql";
import cors from "cors";
import env from "dotenv";

import sendMail from "./mailer";

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
            .input("dueDate", mssql.SmallDateTime, req.body.dueDate || null)
            .input("assignee", mssql.VarChar, req.body.assignee || "")
            .input("description", mssql.VarChar, req.body.description || "")
            .execute("uspCreateOrUpdateTask");

        if (req.body.assignee)
            await sendMail(req.body.assignee, {
                subject: `You've been assigned a new task.`,
                html: `
                    Hi ${req.body.assignee},
                    <br>
                    <br>
                    Below are the details for the assigned task:
                    <br>
                    <p><b>Title:</b> ${req.body.title}</p>
                    <p><b>Description:</b> ${req.body.description}</p>
                    <p><b>Due Date:</b> ${req.body.dueDate}</p>
                    <br>
                `,
            });

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

        const { title, dueDate, assignee, description } = data?.recordset[0];

        await req.cp
            ?.request()
            .input("id", mssql.UniqueIdentifier, req.params.id)
            .input("title", mssql.VarChar, req.body.title || title)
            .input("dueDate", mssql.SmallDateTime, req.body.dueDate || dueDate)
            .input("assignee", mssql.VarChar, req.body.assignee || assignee)
            .input("description", mssql.VarChar, req.body.description || description)
            .execute("uspCreateOrUpdateTask");

        if (req.body.assignee !== assignee) {
            await sendMail(req.body.assignee, {
                subject: `You've been assigned a new task.`,
                html: `
                    Hi ${req.body.assignee},
                    <br>
                    <br>
                    Below are the details for the assigned task:
                    <br>
                    <p><b>Title:</b> ${req.body.title}</p>
                    <p><b>Description:</b> ${req.body.description}</p>
                    <p><b>Due Date:</b> ${req.body.dueDate}</p>
                    <br>
                `,
            });

            if (assignee)
                await sendMail(assignee, {
                    subject: `You've been unassigned from the previous task.`,
                    html: `
                        Hi ${req.body.assignee},
                        <br>
                        <br>
                        Below are the details for the unassigned task:
                        <br>
                        <p><b>Title:</b> ${req.body.title}</p>
                        <p><b>Description:</b> ${req.body.description}</p>
                        <p><b>Due Date:</b> ${req.body.dueDate}</p>
                        <br>
                    `,
                });
        }

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

        const task = (
            await req.cp?.request().input("id", mssql.UniqueIdentifier, req.params.id).execute("uspGetTaskById")
        )?.recordset[0];

        await sendMail(<string>process.env.EMAIL, {
            subject: `Task has been completed.`,
            html: `
                Hi ${process.env.EMAIL},
                <br>
                <br>
                The task you assigned has been completed. Below are the task details:
                <br>
                <p><b>Title:</b> ${task.title}</p>
                <p><b>Description:</b> ${task.description}</p>
                <p><b>Due Date:</b> ${task.dueDate}</p>
                <p><b>Completion Date:</b> ${task.dateCompleted}</p>
                <br>
            `,
        });

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
