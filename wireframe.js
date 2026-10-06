// Toggle the pink wireframe annotation labels on/off
const toggle = document.getElementById("notesToggle");

toggle.addEventListener("click", () => {
  const hidden = document.body.classList.toggle("hide-notes");
  toggle.textContent = hidden ? "Show notes" : "Hide notes";
});
