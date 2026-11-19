const noteForm = document.querySelector('.booking-note');

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(noteForm);
  const subject = encodeURIComponent(fields.get('subject'));
  const body = encodeURIComponent(fields.get('body').replace(/\r?\n/g, '\r\n'));
  window.location.href = noteForm.action + '?subject=' + subject + '&body=' + body;
});
