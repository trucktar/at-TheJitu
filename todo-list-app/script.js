const todoList = [
    {
        title: "Set up Docker",
        due_date: new Date(),
        description: "Just need to get a new phone",
    },
    {
        title: "Review TS annotations",
        due_date: new Date(),
        description: "Just mimic microsoft to do",
    },
    {
        title: "Prepare class on SQL Views",
        due_date: new Date(),
        description: "Just build custom to-do list app",
    },
];

document.addEventListener("DOMContentLoaded", (event) => {
    let addTaskBtn = document.querySelector("main > div:nth-child(2) button");
    let addTaskForm = document.querySelector("main > div:nth-child(2) form");
    let addTaskInput = document.querySelector("main > div:nth-child(2) input");

    addTaskBtn.addEventListener("click", (event) => addTaskInput.focus());
    addTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        tasks.insertAdjacentHTML(
            "beforeend",
            `
            <li>
                <button>
                    <img src="icons/ellipse-outline.svg" alt="">
                </button>
                ${addTaskInput.value}
            </li>
            `
        );
        // Clear the input field
        addTaskInput.value = "";
    });

    const tasks = document.querySelector("main > ul:nth-child(3)");
    tasks.replaceChildren();

    todoList.forEach((task) =>
        tasks.insertAdjacentHTML(
            "beforeend",
            `
            <li>
                <button>
                    <img src="icons/ellipse-outline.svg" alt="">
                </button>
                ${task.title}
            </li>
            `
        )
    );

    const taskItems = document.querySelectorAll("main > ul > li");
    taskItems.forEach((taskItem, index) =>
        taskItem.addEventListener("click", (event) => {
            if (navTitle.textContent == "Tasks") {
                navTitle.textContent = "Task details";
                navBtnIcon.setAttribute("src", "icons/arrow-back-outline.svg");
            }
        })
    );
});
