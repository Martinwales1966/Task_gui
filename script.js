document.addEventListener('DOMContentLoaded', () => {
  // Dummy data sets
  const data = {
    pending: [
      { time: "02/07/25 21:41", meta: "Req A | W‑A→W‑B | High | Chair | Patient", link: "#" },
      { time: "03/07/25 10:15", meta: "Req B | W‑C→W‑D | Emergency | Wheelchair | John Doe", link: "#" }
    ],
    inProgress: [
      { time: "01/07/25 10:00", meta: "W‑B→W‑C | Very High | Patient | Alice" },
      { time: "02/07/25 14:30", meta: "W‑D→W‑E | High | Chair | Bob" }
    ],
    resources: [
      { meta: "John – Idle 2h | Last Loc: W‑C" },
      { meta: "Emma – Break 15m | Last Loc: Cafeteria" },
      { meta: "Rick – On Task | Last Loc: W‑A" }
    ]
  };

  // Grab the three panels (skip the nav)
  const panels = document.querySelectorAll('.panel');

  function populate(panelIndex, items, withLink) {
    const ul = panels[panelIndex].querySelector('.item-list');
    ul.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');

      // Time (if present)
      if (item.time) {
        const spanTime = document.createElement('span');
        spanTime.className = 'time';
        spanTime.textContent = item.time;
        li.appendChild(spanTime);
      }

      // Meta info
      const spanMeta = document.createElement('span');
      spanMeta.className = 'meta';
      spanMeta.textContent = item.meta;
      li.appendChild(spanMeta);

      // Details link for pending tasks
      if (withLink && item.link) {
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = 'Details ↗';
        a.className = 'details';
        li.appendChild(a);
      }

      ul.appendChild(li);
    });
  }

  // Populate each panel (0 = Pending, 1 = In Progress, 2 = Resources)
  populate(0, data.pending, true);
  populate(1, data.inProgress, false);
  populate(2, data.resources, false);
});
