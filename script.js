let taskIdCounter = 1;
let pendingTasks = [];
let inProgressTasks = [];

const resources = [
  { name: "Alice", status: "Available", last: "ER" },
  { name: "Bob", status: "Available", last: "MRI" },
  { name: "Cara", status: "Available", last: "ICU" }
];

const broadcastMessages = [
  { text: "🔴 Lift B is out of order", urgent: true },
  { text: "⚠️ Remember to sanitize after each use", urgent: false }
];
let broadcastIndex = 0;

function rotateBroadcast() {
  const msg = broadcastMessages[broadcastIndex];
  const el = document.getElementById("broadcast");
  el.textContent = msg.text;
  el.className = msg.urgent ? "broadcast urgent" : "broadcast";
  broadcastIndex = (broadcastIndex + 1) % broadcastMessages.length;
}
setInterval(rotateBroadcast, 10000);

function renderResources() {
  const list = document.getElementById("resources");
  list.innerHTML = "";
  resources.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} | ${r.status} | Last: ${r.last}`;
    list.appendChild(li);
  });
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function openTaskForm() {
  generatePendingTask({
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: new Date().toLocaleTimeString(),
    requester: "Dr. B",
    escort: "Emma",
    from: "Ward A",
    to: "X-Ray",
    priority: Math.random() < 0.2 ? "Emergency" : "High"
  });
}

function generatePendingTask(task) {
  pendingTasks.push(task);
  renderTasks();
}

function renderTasks() {
  const pendingList = document.getElementById("pending");
  const progressList = document.getElementById("in-progress");

  pendingList.innerHTML = "";
  progressList.innerHTML = "";

  // ✅ Sort so Emergency tasks come first
  const sortedPending = [...pendingTasks].sort((a, b) => {
    if (a.priority === "Emergency" && b.priority !== "Emergency") return -1;
    if (a.priority !== "Emergency" && b.priority === "Emergency") return 1;
    return 0;
  });

  sortedPending.forEach(task => {
    const li = document.createElement("li");

    // ✅ Add styling classes based on priority
    li.className = "task-item";
    if (task.priority === "Emergency") li.classList.add("urgent", "kpi-red");
    else if (task.priority === "High") li.classList.add("kpi-orange");

    li.innerHTML = `
      <strong>${task.id}</strong> | ${task.time}<br>
      ${task.requester} - ${task.escort}<br>
      ${task.from} → ${task.to}<br>
      ${task.priority} | Escort<br>
      <small>Elapsed: 0s</small><br>
      <select><option>Assign Resource</option></select>
      <button>Start</button>
      <button>Hold</button>
      <button>Cancel</button>
    `;
    pendingList.appendChild(li);
  });

  updateCounters();
  renderResources();
}

function updateCounters() {
  document.getElementById("pending-counter").textContent = pendingTasks.length;
  document.getElementById("inprogress-counter").textContent = inProgressTasks.length;
}

document.addEventListener("DOMContentLoaded", () => {
  renderResources();
  rotateBroadcast();
  document.getElementById("new-task-btn").addEventListener("click", openTaskForm);
});
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("new-task-btn").addEventListener("click", openTaskForm);
});
