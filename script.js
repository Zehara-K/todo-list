const button = document.getElementById("submit");
const todolist = document.getElementById("todolist");
const input = document.getElementById("addtask");
const searchInput = document.getElementById("searchtask");

let todos = [];

window.onload = () => {
    todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(renderTodo);
};

button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return alert("Please enter a task");

    const todo = {
        id: Date.now(),
        text,
        completed: false
    };

    todos.push(todo);
    save();
    renderTodo(todo);
    input.value = "";
});

input.addEventListener("keypress", e => {
    if (e.key === "Enter") button.click();
});

function renderTodo(todo) {
    const task = document.createElement("div");
    task.className = "task";
    if (todo.completed) task.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const span = document.createElement("span");
    span.textContent = todo.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        task.classList.toggle("completed");
        save();
    });

    editBtn.addEventListener("click", e => {
        e.stopPropagation();
        inlineEdit(task, span, todo);
    });

    deleteBtn.addEventListener("click", e => {
        e.stopPropagation();
        todos = todos.filter(t => t.id !== todo.id);
        task.remove();
        save();
    });

    task.append(checkbox, span, editBtn, deleteBtn);
    todolist.appendChild(task);
}


function inlineEdit(task, span, todo) {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = todo.text;
    inputField.className = "edit-input";

    task.replaceChild(inputField, span);
    inputField.focus();

    let finished = false;

    function finishEdit() {
        if (finished) return;
        finished = true;

        const newText = inputField.value.trim();
        if (!newText) {
            task.replaceChild(span, inputField);
            return;
        }

        todo.text = newText;
        span.textContent = newText;
        task.replaceChild(span, inputField);
        save();
    }

    inputField.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            finishEdit();
        }
    });

    inputField.addEventListener("blur", finishEdit);
}


function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

/* Search */
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".task").forEach(task => {
        const text = task.querySelector("span").textContent.toLowerCase();
        task.style.display = text.includes(value) ? "flex" : "none";
    });
});
