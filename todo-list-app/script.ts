interface TaskOptions {
    title: string;
    description?: string;
    dueAt?: Date;
}

class Task {
    title: string;
    description?: string;
    private dueAt?: Date;
    private createdAt = new Date();
    isComplete = false;
    private completedAt?: Date;

    get dateDue(): string | never {
        if (this.dueAt) return this.dueAt.toLocaleString();
        else throw new Error("Due date not yet set");
    }
    set dateDue(dateString: string) {
        this.dueAt = new Date(dateString);
    }

    get dateCreated() {
        return this.createdAt.toLocaleString();
    }

    get dateCompleted(): string | never {
        if (this.isComplete && this.completedAt) return this.completedAt.toLocaleString();
        else throw new Error("Task is still incomplete");
    }
    set dateCompleted(dateString: string) {
        this.completedAt = new Date(dateString);
    }

    constructor(opts: TaskOptions) {
        this.title = opts.title;
        this.description = opts.description;
        this.dueAt = opts.dueAt;
    }

    masrkAsComplete(): void {
        this.completedAt = new Date();
        this.isComplete = true;
    }

    markAsIncomplete(): void {
        delete this.completedAt;
        this.isComplete = false;
    }
}

class TaskManager {
    private static taskMan: TaskManager;
    private tasks: Task[] = [];

    private constructor(...taskObjs: TaskOptions[]) {
        taskObjs.forEach((taskObj) => this.createTask(taskObj));
    }

    createTask(opts: TaskOptions): void {
        const task = new Task(opts);
        this.tasks.push(task);
    }

    listTasks(options: { complete: boolean }) {
        if (options.complete) return this.tasks.filter((task) => task.isComplete);
        return this.tasks.filter((task) => !task.isComplete);
    }

    dumpCompleteTasks() {
        return this.listTasks({ complete: true }).map(
            (task) => `
            <li>
                <button>
                    <img src="icons/checkmark-circle.svg" alt="">
                </button>
                ${task.title}
            </li>
            `
        );
    }

    dumpIncompleteTasks() {
        return this.listTasks({ complete: false }).map(
            (task) => `
            <li>
                <button>
                    <img src="icons/ellipse-outline.svg" alt="">
                </button>
                ${task.title}
            </li>
            `
        );
    }

    updateTask(taskId: number, opts: TaskOptions): void {
        Object.assign(this.tasks[taskId], opts);
    }

    deleteTask(taskId: number): void {
        this.tasks.splice(taskId, 1);
    }

    static getTaskMan(...taskObjs: TaskOptions[]) {
        return TaskManager.taskMan || (TaskManager.taskMan = new TaskManager(...taskObjs));
    }
}

const todoList: TaskOptions[] = [
    {
        title: "Set up Docker",
        dueAt: new Date(),
        description: "Need that to set up SQL Server 2019 on Fedora",
    },
    {
        title: "Review SQL Stored Procedures",
        dueAt: new Date(),
        description: "",
    },
    {
        title: "Prepare class on SQL Views",
        dueAt: new Date(),
        description: "Just build custom to-do list app",
    },
];

document.addEventListener("DOMContentLoaded", (event) => {
    const taskMan = TaskManager.getTaskMan(...todoList);
    console.log(taskMan);

    const addTaskButton = document.querySelector("main > div:nth-child(2) button") as HTMLButtonElement;
    const createTaskForm = document.querySelector("main > div:nth-child(2) form") as HTMLFormElement;
    const taskTitleInput = document.querySelector("main > div:nth-child(2) input") as HTMLInputElement;
    const incompleteTaskUl = document.querySelector("main > ul:nth-child(3)") as HTMLUListElement;
    const completeTaskUl = document.querySelector("main > ul:nth-child(5)") as HTMLUListElement;

    incompleteTaskUl.innerHTML = taskMan.dumpIncompleteTasks().join("\n");
    completeTaskUl.innerHTML = taskMan.dumpCompleteTasks().join("\n");

    addTaskButton.addEventListener("click", (event) => taskTitleInput.focus());
    createTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        taskMan.createTask({ title: taskTitleInput.value });
        completeTaskUl.innerHTML = taskMan.dumpCompleteTasks().join("\n");
        incompleteTaskUl.innerHTML = taskMan.dumpIncompleteTasks().join("\n");

        taskTitleInput.value = "";
    });
});
