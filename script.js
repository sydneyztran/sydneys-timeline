function openModal(img) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = img.src;
  modalImg.alt = img.alt || "Expanded image";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function sortTimelineItems(items) {
  return items.sort((a, b) => {
    const aStart = Number(a.dataset.start);
    const bStart = Number(b.dataset.start);
    const aEnd = Number(a.dataset.end);
    const bEnd = Number(b.dataset.end);

    if (aStart !== bStart) return aStart - bStart;
    if (aEnd !== bEnd) return aEnd - bEnd;
    return 0;
  });
}

function layoutTimeline() {
  const timeline = document.getElementById("timeline");
  let items = Array.from(timeline.querySelectorAll(".event"));

  items = sortTimelineItems(items);

  items.forEach(item => timeline.appendChild(item));

  if (window.innerWidth <= 900) {
    timeline.style.minHeight = "auto";
    return;
  }

  const starts = items.map(item => Number(item.dataset.start));
  const minStart = Math.min(...starts);
  const maxStart = Math.max(...starts);

  const timelineHeight = 7000;
  const topPadding = 40;
  const bottomPadding = 80;
  const minGap = 34;

  timeline.style.minHeight = `${timelineHeight}px`;

  let lastY = -Infinity;

  items.forEach(item => {
    const start = Number(item.dataset.start);
    const percent = (start - minStart) / (maxStart - minStart);
    let y = topPadding + percent * (timelineHeight - topPadding - bottomPadding);

    if (y < lastY + minGap) {
      y = lastY + minGap;
    }

    item.style.top = `${y}px`;
    lastY = y + item.offsetHeight;
  });

  let maxBottom = 0;
  items.forEach(item => {
    const itemTop = parseFloat(item.style.top) || 0;
    const itemBottom = itemTop + item.offsetHeight;
    if (itemBottom > maxBottom) maxBottom = itemBottom;
  });

  timeline.style.minHeight = `${maxBottom + 80}px`;
}

window.addEventListener("load", layoutTimeline);
window.addEventListener("resize", layoutTimeline);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});