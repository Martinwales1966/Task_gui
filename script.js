let taskIdCounter = 1;
let pendingTasks = [];
let inProgressTasks = [];

let resources = [
  { name: "Alice", status: "Available", last: "ER" },
  { name: "Bob", status: "Available", last: "MRI" },
  { name: "Cara", status: "Available", last: "ICU" }
];

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function openTaskForm() {
  // This simulates a new task creation
  generatePendingTask({
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: new Date().toLocaleTimeString(),
    requester: "Dr. B",
    escort: "Emma",
    from: "Ward A",
    to: "X-Ray",
    priority: ["Emergency", "High", "Normal"][Math.floor(Math.random() * 3)]
  });
}

function generatePendingTask(task) {
  pendingTasks.push(task);
  renderTasks();
}

function renderResources() {
  const list = document.getElementById("resource-list");
  if (!list) return;

  list.innerHTML = "";
  resources.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} | ${r.status} | Last: ${r.last}`;
    list.appendChild(li);
  });
}

function updateCounters() {
  const pendingCounter = document.getElementById("pending-counter");
  const inprogressCounter = document.getElementById("inprogress-counter");

  if (pendingCounter) pendingCounter.textContent = pendingTasks.length;
  if (inprogressCounter) inprogressCounter.textContent = inProgressTasks.length;
}

function renderTasks() {
  const pendingList = document.getElementById("pending");
  const progressList = document.getElementById("in-progress");

  if (!pendingList || !progressList) {
    console.error("Missing task list elements in DOM.");
    return;
  }

  pendingList.innerHTML = "";
  progressList.innerHTML = "";

  // Sort by priority (Emergency first)
  const sorted = [...pendingTasks].sort((a, b) => {
    const p = { "Emergency": 1, "High": 2, "Normal": 3 };
    return p[a.priority] - p[b.priority];
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
