let tasks = [];

function updateDashboard() {
    const taskList = document.getElementById("tasks");
    const taskCount = document.getElementById("taskCount");
    const completedCount = document.getElementById("completedCount");

    taskList.innerHTML = "";
    let completed = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.style.textDecoration = task.done ? "line-through" : "none";
        li.onclick = () => toggleTask(index);
        taskList.appendChild(li);
        if (task.done) completed++;
    });

    taskCount.textContent = tasks.length;
    completedCount.textContent = completed;
}

function addTask() {
    const input = document.getElementById("newTask");
    if (input.value.trim()) {
        tasks.push({ text: input.value, done: false });
        input.value = "";
        updateDashboard();
    }
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    updateDashboard();
}

updateDashboard();
