function sortTable(table, isNumeric = false, initialSort = 'desc') {
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const index = isNumeric ? 1 : 0;
  const isDescending = initialSort === 'desc';

  rows.sort((a, b) => {
    let aValue = a.children[index].textContent;
    let bValue = b.children[index].textContent;

    if (isNumeric) {
      aValue = parseInt(aValue, 10);
      bValue = parseInt(bValue, 10);
      return isDescending ? bValue - aValue : aValue - bValue;
    }
      aValue = new Date(aValue);
      bValue = new Date(bValue);
      return isDescending ? bValue - aValue : aValue - bValue;
  });

  table.querySelector('tbody').append(...rows);
}

document.addEventListener('DOMContentLoaded', () => {
  const standingsTable = document.querySelector('.standings table');
  const gamesTable = document.querySelector('.games table');

  if (standingsTable) {
    sortTable(standingsTable, true, 'desc');
  }
  if (gamesTable) {
    sortTable(gamesTable, false, 'asc');
  }
});
