interface TaskOptions {
    id?: string;
    title?: string;
    dueDate?: string | null;
    description?: string;
    assignee?: string;
    dateCreated?: string;
    dateCompleted?: string | null;
    isComplete?: boolean;
}

class Task implements TaskOptions {
    id?: string;
    title?: string;
    dueDate?: string | null;
    assignee?: string;
    description?: string;
    dateCreated?: string;
    dateCompleted?: string | null;
    isComplete?: boolean;

    constructor(opts: TaskOptions) {
        this.id = opts.id;
        this.title = opts.title;
        this.dueDate = opts.dueDate;
        this.assignee = opts.assignee;
        this.description = opts.description;
        this.dateCreated = opts.dateCreated;
        this.dateCompleted = opts.dateCompleted;
        this.isComplete = opts.isComplete;
    }
}

class TaskMan {
    static tasks: Task[];

    private constructor() {}

    static async createTask({ title, dueDate = null, assignee = "", description = "" }: TaskOptions) {
        await fetch("http://localhost:7000/tasks/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, dueDate, assignee, description }),
        });
    }

    static async getAllTasks() {
        const res = await fetch("http://localhost:7000/tasks");
        const data = <TaskOptions[]>await res.json();
        TaskMan.tasks = data.map((opts) => new Task(opts));
    }

    static listTasks(options: { complete: boolean }) {
        if (options.complete) return TaskMan.tasks.filter((task) => task.isComplete);
        return TaskMan.tasks.filter((task) => !task.isComplete);
    }

    static async updateTask({ id, title, dueDate, assignee, description }: TaskOptions) {
        await fetch(`http://localhost:7000/tasks/${id}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, dueDate, assignee, description }),
        });
    }

    static async updateTaskStatus({ id }: TaskOptions) {
        await fetch(`http://localhost:7000/tasks/${id}/status`, { method: "PATCH" });
    }

    static async deleteTask({ id }: TaskOptions) {
        await fetch(`http://localhost:7000/tasks/${id}/delete`, { method: "DELETE" });
    }
}

document.addEventListener("DOMContentLoaded", async (event) => {
    let appHeader = <HTMLHeadingElement>document.querySelector("header h1");
    let appHeaderButton = <HTMLButtonElement>document.querySelector("header button");

    let taskTitleDiv = <HTMLDivElement>document.querySelector(".taskDetail__title");
    let taskAddButton = <HTMLButtonElement>document.querySelector(".taskDetail__title button");
    let taskTitleForm = <HTMLFormElement>document.querySelector(".taskDetail__title form");
    let taskTitleInput = <HTMLInputElement>document.querySelector(".taskDetail__title input");
    let taskDueDateDiv = <HTMLDivElement>document.querySelector(".taskDetail__dueDate");
    let taskDueDateInput = <HTMLInputElement>document.querySelector(".taskDetail__dueDate input");
    let taskAssigneeDiv = <HTMLDivElement>document.querySelector(".taskDetail__assignee");
    let taskAssigneeInput = <HTMLInputElement>document.querySelector(".taskDetail__assignee input");
    let taskDescriptionDiv = <HTMLDivElement>document.querySelector(".taskDetail__description");
    let taskDescriptionInput = <HTMLTextAreaElement>document.querySelector(".taskDetail__description textarea");
    let taskActionsDiv = <HTMLDivElement>document.querySelector(".taskDetail__actions");
    let taskDeleteButton = <HTMLButtonElement>document.querySelector(".taskDetail__actions button:last-child");

    let taskListViewDiv = <HTMLElement>document.querySelector(".taskList");
    let incompleteTasksUList = <HTMLUListElement>document.querySelector(".taskList__incompleteTasks");
    let completeTasksUList = <HTMLUListElement>document.querySelector(".taskList__completeTasks");

    let activeView: "taskListView" | "taskDetailView";
    let activeTask: Task | undefined;

    appHeaderButton.addEventListener("click", async (event) => await renderTaskListView());
    taskAddButton.addEventListener("click", (event) => taskTitleInput.focus());
    taskTitleForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const taskTitleText = taskTitleInput.value.trim();
        if (taskTitleText)
            if (activeView === "taskDetailView") {
                await TaskMan.updateTask({
                    id: activeTask?.id,
                    title: taskTitleText,
                    dueDate: taskDueDateInput.valueAsDate?.toISOString(),
                    assignee: taskAssigneeInput.value,
                    description: taskDescriptionInput.value,
                });
                taskTitleInput.blur();
            } else {
                await TaskMan.createTask({ title: taskTitleText });
                await renderTaskListView();
            }
    });
    taskDeleteButton.addEventListener("click", async (event) => {
        await TaskMan.deleteTask({ id: activeTask?.id });
        await renderTaskListView();
    });

    async function renderTaskListView() {
        await TaskMan.getAllTasks();

        updateActiveViewState({
            appHeaderButton: "hidden",
            appHeaderText: "Tasks",
            taskTitleInput: "",
            taskDueDateDiv: "none",
            taskAssigneeDiv: "none",
            taskDescriptionDiv: "none",
            taskActionsDiv: "none",
            taskListViewDiv: "block",
        });

        taskTitleDiv.firstElementChild?.remove();
        taskTitleDiv.prepend(taskAddButton);

        incompleteTasksUList.innerHTML = TaskMan.listTasks({ complete: false })
            .map(
                (task) => `
            <li>
                <button title="Mark as complete">
                    <img src="/icons/ellipse-outline.svg" alt="">
                </button>
                ${task.title}
            </li>
            `
            )
            .join("");
        addTaskListClickHandlers(incompleteTasksUList);

        completeTasksUList.innerHTML = TaskMan.listTasks({ complete: true })
            .map(
                (task) => `
            <li>
                <button title="Mark as incomplete">
                    <img src="/icons/checkmark-circle.svg" alt="">
                </button>
                ${task.title}
            </li>
            `
            )
            .join("");
        addTaskListClickHandlers(completeTasksUList);
    }

    function addTaskListClickHandlers(tasksUList: HTMLUListElement) {
        for (const taskLI of <HTMLCollectionOf<HTMLLIElement>>tasksUList.children) {
            const taskCompleteButton = <HTMLButtonElement>taskLI.firstElementChild;
            const task = TaskMan.tasks.find((task) => task.title === taskLI.innerText.trim());

            taskLI.addEventListener("click", (event) => {
                updateActiveViewState({
                    appHeaderButton: "visible",
                    appHeaderText: "Task Details",
                    taskTitleInput: taskLI.innerText.trim(),
                    taskDueDateDiv: "flex",
                    taskAssigneeDiv: "flex",
                    taskDescriptionDiv: "block",
                    taskActionsDiv: "flex",
                    taskListViewDiv: "none",
                });

                taskAddButton = taskTitleDiv.removeChild(taskAddButton);
                taskTitleDiv.prepend(taskCompleteButton);

                taskDueDateInput.valueAsDate = task?.dueDate ? new Date(task?.dueDate) : null;
                taskAssigneeInput.value = task?.assignee || "";
                taskDescriptionInput.value = task?.description || "";
            });

            taskCompleteButton.addEventListener("click", async (event) => {
                event.stopPropagation();

                const taskButtonImg = <HTMLImageElement>taskCompleteButton.firstElementChild;
                const match = /([a-z\-]+)\.svg/i.exec(taskButtonImg.src);
                if (match)
                    taskButtonImg.src = taskButtonImg.src.replace(
                        match[1],
                        match[1] === "ellipse-outline" ? "checkmark-circle" : "ellipse-outline"
                    );

                await TaskMan.updateTaskStatus({ id: task?.id });

                if (activeView === "taskListView") await renderTaskListView();
            });
        }
    }

    type ViewState = {
        appHeaderButton: "hidden" | "visible";
        appHeaderText: "Tasks" | "Task Details";
        taskTitleInput: string;
        taskDueDateDiv: "none" | "flex";
        taskAssigneeDiv: "none" | "flex";
        taskDescriptionDiv: "none" | "block";
        taskActionsDiv: "none" | "flex";
        taskListViewDiv: "none" | "block";
    };

    const updateActiveViewState = (viewState: ViewState) => {
        appHeaderButton.style.visibility = viewState.appHeaderButton;
        appHeader.innerText = viewState.appHeaderText;
        let title = (taskTitleInput.value = viewState.taskTitleInput);
        taskDueDateDiv.style.display = viewState.taskDueDateDiv;
        taskAssigneeDiv.style.display = viewState.taskAssigneeDiv;
        taskDescriptionDiv.style.display = viewState.taskDescriptionDiv;
        taskActionsDiv.style.display = viewState.taskActionsDiv;
        taskListViewDiv.style.display = viewState.taskListViewDiv;

        activeView = viewState.appHeaderText === "Tasks" ? "taskListView" : "taskDetailView";
        activeTask = TaskMan.tasks.find((task) => task.title === title);
    };

    await renderTaskListView();
});
