
document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");

  // Load tasks from localStorage on page load
  loadTasks();

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
      addTask(taskText);
      taskInput.value = "";
      saveTasks();
    }
  });

  function addTask(text) {
    const li = document.createElement("li");
    li.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.className = "delete";
    deleteBtn.addEventListener("click", function () {
      li.remove();
      saveTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((li) => {
      tasks.push(li.firstChild.textContent.trim());
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach((task) => addTask(task));
  }
});
