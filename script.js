let taskIdCounter = 1;
let pendingTasks = [];
let inProgressTasks = [];

function openTaskForm() {
  generatePendingTask({
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: new Date().toLocaleString(),
    from: "Ward A",
    to: "X-Ray",
    priority: "High",
    escort: "Emma",
    requester: "Dr. B"
  });
}

function generatePendingTask(task) {
  pendingTasks.push(task);
  renderTasks();
}

function renderTasks() {
  const pendingList = document.getElementById("pending-tasks-list");
  const progressList = document.getElementById("inprogress-tasks-list");

  pendingList.innerHTML = "";
  progressList.innerHTML = "";

  pendingTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.id}</strong> | ${task.time}<br>
      ${task.requester} | ${task.from} → ${task.to} | ${task.priority} | Escort: ${task.escort}
      <div>
        <select><option>Assign Resource</option></select>
        <button>Start</button>
        <button>Hold</button>
        <button>Cancel</button>
      </div>
    `;
    pendingList.appendChild(li);
  });

  inProgressTasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = `${task.id} in progress...`;
    progressList.appendChild(li);
  });

  updateCounters();
}

function updateCounters() {
  const pendingCounter = document.getElementById("pending-counter");
  const inprogressCounter = document.getElementById("inprogress-counter");

  if (pendingCounter) pendingCounter.textContent = pendingTasks.length;
  if (inprogressCounter) inprogressCounter.textContent = inProgressTasks.length;
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});
