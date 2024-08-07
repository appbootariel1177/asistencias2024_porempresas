document.addEventListener('DOMContentLoaded', function() {
    const empresaFilter = document.getElementById('empresa-filter');
    const tableBody = document.getElementById('data-table').querySelector('tbody');
    const tableHead = document.getElementById('data-table').querySelector('thead');
    const printButton = document.getElementById('print-button');

    fetch('https://script.google.com/macros/s/AKfycbxa9QgEt12cm44D2_pUMQUHYKcCDWP0Jjy8X8NlvY82c_5UQFu693kgx-YimA18x3sx/exec')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const headers = data[0];

                // Crear encabezado de tabla
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                tableHead.appendChild(headerRow);

                const empresasSet = new Set();
                data.slice(1).forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach((cell, index) => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });

                    // Captura y agrega las empresas al filtro
                    const empresaIndex = headers.indexOf('Empresa');
                    if (empresaIndex !== -1) {
                        const empresa = row[empresaIndex];
                        if (empresa) {
                            empresasSet.add(empresa);
                            // Asignar color de fondo dinámico según la empresa
                            tr.style.backgroundColor = getColorByEmpresa(empresa);
                        }
                    }
                    tableBody.appendChild(tr);
                });

                // Llenar el filtro de empresa
                empresasSet.forEach(empresa => {
                    const option = document.createElement('option');
                    option.value = empresa;
                    option.textContent = empresa;
                    empresaFilter.appendChild(option);
                });

                empresaFilter.addEventListener('change', function() {
                    const selectedEmpresa = this.value;
                    const rows = tableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const empresaCell = row.cells[empresaIndex];
                        if (selectedEmpresa === 'All' || empresaCell.textContent === selectedEmpresa) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    // Funcionalidad del botón de impresión
    printButton.addEventListener('click', function() {
        window.print();
    });

    function getColorByEmpresa(empresa) {
        const hash = Array.from(empresa).reduce((acc, char) => (acc + char.charCodeAt(0)), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 90%)`;
    }
});
