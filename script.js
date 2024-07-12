document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const tableBody = document.getElementById('inventarioTable').getElementsByTagName('tbody')[0];

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addItem();
  });

  // Load stored data from localStorage
  loadStoredData();

  function addItem() {
    const variedad = document.getElementById('variedad').value;
    const estado = document.getElementById('estado').value;
    const quintalaje = document.getElementById('quintalaje').value;
    const valor = document.getElementById('valor').value;
    const fecha = document.getElementById('fecha').value;

    const formattedDate = formatDate(fecha);

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${variedad}</td>
      <td>${estado}</td>
      <td>${quintalaje}</td>
      <td>$${valor}</td>
      <td>${formattedDate}</td>
      <td>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Eliminar</button>
      </td>
    `;

    row.querySelector('.edit-button').addEventListener('click', () => editItem(row));
    row.querySelector('.delete-button').addEventListener('click', () => deleteItem(row));

    storeData();
    form.reset();
  }

  function editItem(row) {
    const cells = row.getElementsByTagName('td');

    document.getElementById('variedad').value = cells[0].innerText;
    document.getElementById('estado').value = cells[1].innerText.toLowerCase();
    document.getElementById('quintalaje').value = cells[2].innerText;
    document.getElementById('valor').value = cells[3].innerText.replace('$', '');
    document.getElementById('fecha').value = reverseFormatDate(cells[4].innerText);

    tableBody.removeChild(row);
    storeData();
  }

  function deleteItem(row) {
    tableBody.removeChild(row);
    storeData();
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function reverseFormatDate(formattedDate) {
    const [day, month, year] = formattedDate.split('/');
    return `${year}-${month}-${day}`;
  }

  function storeData() {
    const rows = tableBody.getElementsByTagName('tr');
    const data = [];

    for (let row of rows) {
      const cells = row.getElementsByTagName('td');
      data.push({
        variedad: cells[0].innerText,
        estado: cells[1].innerText,
        quintalaje: cells[2].innerText,
        valor: cells[3].innerText.replace('$', ''),
        fecha: cells[4].innerText
      });
    }

    localStorage.setItem('inventario', JSON.stringify(data));
  }

  function loadStoredData() {
    const storedData = JSON.parse(localStorage.getItem('inventario') || '[]');

    for (let item of storedData) {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td>${item.variedad}</td>
        <td>${item.estado}</td>
        <td>${item.quintalaje}</td>
        <td>$${item.valor}</td>
        <td>${item.fecha}</td>
        <td>
          <button class="edit-button">Editar</button>
          <button class="delete-button">Eliminar</button>
        </td>
      `;

      row.querySelector('.edit-button').addEventListener('click', () => editItem(row));
      row.querySelector('.delete-button').addEventListener('click', () => deleteItem(row));
    }
  }
});
