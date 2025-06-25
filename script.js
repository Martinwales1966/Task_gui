// Dummy data
const tasks = [
    { name: "Task A", time: "9:00 AM" },
    { name: "Task B", time: "11:00 AM" },
    { name: "Task C", time: "2:00 PM" }
];

const allocatedResources = [
    { name: "John", task: "Task A" },
    { name: "Maria", task: "Task B" },
    { name: "Leo", task: "Task C" }
];

const availableResources = [
    { name: "Emma", idleHours: 4 },
    { name: "Liam", idleHours: 2 },
    { name: "Sophia", idleHours: 1 }
];

// Sort available resources by idle time (descending)
availableResources.sort((a, b) => b.idleHours - a.idleHours);

// Helper to create list items
function populateList(containerId, items, formatter) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = formatter(item);
        container.appendChild(li);
    });
}

// Populate dashboard
window.onload = function () {
    populateList("taskList", tasks, t => `${t.name} - ${t.time}`);
    populateList("allocatedList", allocatedResources, r => `${r.name} - ${r.task}`);
    populateList("availableList", availableResources, r => `${r.name} - Idle ${r.idleHours}h`);
};
