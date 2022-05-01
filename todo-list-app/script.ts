interface TaskOptions {
    title: string;
    description?: string;
    dueDate?: Date;
}

class Task {
    title: string;
    description: string = "";
    dueDate: Date | null = null;

    dateCreated = new Date();
    dateCompleted: Date | null = null;
    isComplete = false;

    constructor(opts: TaskOptions) {
        this.title = opts.title;
        if (opts.description) this.description = opts.description;
        if (opts.dueDate) this.dueDate = opts.dueDate;
    }

    markAsComplete() {
        this.dateCompleted = new Date();
        this.isComplete = true;
    }

    markAsIncomplete() {
        this.dateCompleted = null;
        this.isComplete = false;
    }
}

class TaskManager {
    tasks: Task[] = [];
    private static taskMan: TaskManager;

    private constructor(...taskObjs: TaskOptions[]) {
        taskObjs.forEach((taskObj) => this.createTask(taskObj));
    }

    static getTaskMan(...taskObjs: TaskOptions[]) {
        return TaskManager.taskMan || (TaskManager.taskMan = new TaskManager(...taskObjs));
    }

    createTask(opts: TaskOptions) {
        const task = new Task(opts);
        this.tasks.push(task);
    }

    listTasks(options: { complete: boolean }) {
        if (options.complete) return this.tasks.filter((task) => task.isComplete);
        return this.tasks.filter((task) => !task.isComplete);
    }

    updateTask(taskId: number, opts: TaskOptions) {
        Object.assign(this.tasks[taskId], opts);
    }

    deleteTask(taskId: number) {
        this.tasks.splice(taskId, 1);
    }
}

const todoList: TaskOptions[] = [
    {
        title: "Set up Docker",
        // dueDate: new Date(),
        description: "Need that to set up SQL Server 2019 on Fedora",
    },
    {
        title: "Review SQL Stored Procedures",
        dueDate: new Date(),
        description: "",
    },
    {
        title: "Prepare class on SQL Views",
        dueDate: new Date(),
        description: "Just build custom to-do list app",
    },
];

const taskMan = TaskManager.getTaskMan(...todoList);

document.addEventListener("DOMContentLoaded", (event) => {
    let appHeader = <HTMLHeadingElement>document.querySelector("header h1");
    let appHeaderButton = <HTMLButtonElement>document.querySelector("header button");

    let taskTitleDiv = <HTMLDivElement>document.querySelector(".taskDetail__title");
    let taskAddButton = <HTMLButtonElement>document.querySelector(".taskDetail__title button");
    let taskTitleForm = <HTMLFormElement>document.querySelector(".taskDetail__title form");
    let taskTitleInput = <HTMLInputElement>document.querySelector(".taskDetail__title input");
    let taskDueDateDiv = <HTMLDivElement>document.querySelector(".taskDetail__dueDate");
    let taskDueDateInput = <HTMLInputElement>document.querySelector(".taskDetail__dueDate input");
    let taskDescriptionDiv = <HTMLDivElement>document.querySelector(".taskDetail__description");
    let taskDescriptionInput = <HTMLTextAreaElement>document.querySelector(".taskDetail__description textarea");

    let taskListViewDiv = <HTMLElement>document.querySelector(".taskList");
    let incompleteTasksUList = <HTMLUListElement>document.querySelector(".taskList__incompleteTasks");
    let completeTasksUList = <HTMLUListElement>document.querySelector(".taskList__completeTasks");

    let activeView: "taskListView" | "taskDetailView";
    let activeTaskTitle: string;

    appHeaderButton.addEventListener("click", (event) => renderTaskListView());
    taskAddButton.addEventListener("click", (event) => taskTitleInput.focus());
    taskTitleForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (taskTitleInput.value.trim())
            if (activeView === "taskDetailView") {
                const taskId = taskMan.tasks.findIndex((task) => task.title === activeTaskTitle);

                if (activeTaskTitle !== taskTitleInput.value.trim())
                    taskMan.updateTask(taskId, { title: taskTitleInput.value });
                taskTitleInput.blur();
            } else {
                taskMan.createTask({ title: taskTitleInput.value });
                renderTaskListView();
            }
    });

    function renderTaskListView() {
        updateActiveViewState({
            appHeaderButton: "hidden",
            appHeaderText: "Tasks",
            taskDueDateDiv: "none",
            taskDescriptionDiv: "none",
            taskListViewDiv: "block",
        });

        taskTitleDiv.firstElementChild?.remove();
        taskTitleDiv.prepend(taskAddButton);

        incompleteTasksUList.innerHTML = taskMan
            .listTasks({ complete: false })
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

        completeTasksUList.innerHTML = taskMan
            .listTasks({ complete: true })
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
            const task = taskMan.tasks.find((task) => task.title === taskLI.innerText.trim());

            taskLI.addEventListener("click", (event) => {
                updateActiveViewState({
                    appHeaderButton: "visible",
                    appHeaderText: "Task Details",
                    taskTitleText: taskLI.innerText.trim(),
                    taskDueDateDiv: "flex",
                    taskDescriptionDiv: "block",
                    taskListViewDiv: "none",
                });

                taskAddButton = taskTitleDiv.removeChild(taskAddButton);
                taskTitleDiv.prepend(taskCompleteButton);

                if (task?.dueDate) taskDueDateInput.valueAsDate = task.dueDate;
                if (task?.description) taskDescriptionInput.value = task.description;
            });

            taskCompleteButton.addEventListener("click", (event) => {
                event.stopPropagation();

                const taskButtonImg = <HTMLImageElement>taskCompleteButton.firstElementChild;

                if (task?.isComplete) {
                    task?.markAsIncomplete();
                    taskButtonImg.src = location.origin + "/icons/ellipse-outline.svg";
                } else {
                    task?.markAsComplete();
                    taskButtonImg.src = location.origin + "/icons/checkmark-circle.svg";
                }

                if (activeView === "taskListView") renderTaskListView();
            });
        }
    }

    type ViewState = {
        appHeaderButton: "hidden" | "visible";
        appHeaderText: "Tasks" | "Task Details";
        taskTitleText?: string;
        taskDueDateDiv: "none" | "flex";
        taskDescriptionDiv: "none" | "block";
        taskListViewDiv: "none" | "block";
    };

    function updateActiveViewState(viewState: ViewState) {
        appHeaderButton.style.visibility = viewState.appHeaderButton;
        appHeader.innerText = viewState.appHeaderText;
        taskTitleInput.value = viewState.taskTitleText || "";
        taskDueDateDiv.style.display = viewState.taskDueDateDiv;
        taskDescriptionDiv.style.display = viewState.taskDescriptionDiv;
        taskListViewDiv.style.display = viewState.taskListViewDiv;

        activeView = viewState.appHeaderText === "Tasks" ? "taskListView" : "taskDetailView";
        activeTaskTitle = taskTitleInput.value;
    }

    renderTaskListView();
});
