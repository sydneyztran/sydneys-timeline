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

function layoutTimeline() {
  const timeline = document.getElementById("timeline");
  const items = Array.from(document.querySelectorAll(".timeline .event, .timeline .world-event"));

  if (window.innerWidth <= 900) {
    timeline.style.minHeight = "auto";
    return;
  }

  const years = items.map(item => Number(item.dataset.year));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const timelineHeight = 7000;
  const topPadding = 40;
  const bottomPadding = 80;

  timeline.style.minHeight = `${timelineHeight}px`;

  items.forEach((item, index) => {
    item.classList.remove("left", "right");
    item.classList.add(index % 2 === 0 ? "left" : "right");
  });

  const placed = [];

  items.forEach((item) => {
    const year = Number(item.dataset.year);
    const percent = (year - minYear) / (maxYear - minYear);
    let y = topPadding + percent * (timelineHeight - topPadding - bottomPadding);

    const itemSide = item.classList.contains("left") ? "left" : "right";

    for (const prev of placed) {
      const sameSide = prev.side === itemSide;
      const tooClose = Math.abs(y - prev.y) < prev.height + 30;

      if (sameSide && tooClose) {
        y = prev.y + prev.height + 30;
      }
    }

    item.style.top = `${y}px`;

    placed.push({
      y,
      side: itemSide,
      height: item.offsetHeight
    });
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