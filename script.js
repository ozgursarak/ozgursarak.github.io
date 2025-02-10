// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  // Trigger the fade-in animation by adding the class to the body
  document.body.classList.add('fade-in');

  // Add a playful highlight effect on table row clicks
  const tableRows = document.querySelectorAll('table tr');
  tableRows.forEach(row => {
    row.addEventListener('click', function () {
      row.classList.add('selected');
      setTimeout(() => {
        row.classList.remove('selected');
      }, 300); // Highlight lasts for 300ms
    });
  });
}); 