const trigger = document.getElementById("book-trigger");
const modal = document.getElementById("book-modal");

if (trigger && modal) {
  const closeTargets = modal.querySelectorAll("[data-close]");

  function openModal() {
    modal.classList.add("is-open");
    document.body.classList.add("book-modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("book-modal-open");
    trigger.focus();
  }

  trigger.addEventListener("click", openModal);
  closeTargets.forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
