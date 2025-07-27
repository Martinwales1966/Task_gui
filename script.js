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

  // Sort by priority (Emergency first)
  const sorted = [...pendingTasks].sort((a, b) => {
    if (a.priority === "Emergency" && b.priority !== "Emergency") return -1;
    if (b.priority === "Emergency" && a.priority !== "Emergency") return 1;
    return 0;
  });

  sorted.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.priority === "Emergency") li.classList.add("urgent");
    if (task.priority === "High") li.classList.add("kpi-orange");

    li.innerHTML = `
      <strong>${task.id}</strong> | ${task.time}<br>
      ${task.requester} - ${task.escort}<br>
      ${task.from} → ${task.to}<br>
      ${task.priority} | Escort<br>
      <small>Elapsed: 0s</small><br>
    `;

    const select = document.createElement("select");
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Assign Resource";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    resources.forEach(r => {
      const option = document.createElement("option");
      option.value = r.name;
      option.textContent = r.name;
      select.appendChild(option);
    });

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.addEventListener("click", () => {
      const selectedResource = select.value;
      if (!selectedResource || selectedResource === "Assign Resource") {
        alert("Please assign a resource first.");
        return;
      }
      // Move to In Progress
      inProgressTasks.push({ ...task, assigned: selectedResource });
      pendingTasks = pendingTasks.filter(t => t.id !== task.id);
      renderTasks();
    });

    const holdBtn = document.createElement("button");
    holdBtn.textContent = "Hold";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";

    li.appendChild(select);
    li.appendChild(startBtn);
    li.appendChild(holdBtn);
    li.appendChild(cancelBtn);

    pendingList.appendChild(li);
  });

  inProgressTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item kpi-red";
    li.innerHTML = `
      <strong>${task.id}</strong> | ${task.time}<br>
      Assigned: ${task.assigned}<br>
      ${task.from} → ${task.to}<br>
      ${task.priority} | In Progress<br>
      <small>Started at: ${task.time}</small><br>
      <button>End</button>
    `;
    progressList.appendChild(li);
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
