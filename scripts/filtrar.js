let selectedFile;

document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
});

document.getElementById('button').addEventListener("click", () => {
    if (selectedFile) {
        const filterType = document.querySelector('input[name="filterType"]:checked').value;
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            let filteredData = [];
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                if (filterType === "altas") {
                    filteredData = rowObject.filter(item => item["REPORTE DE ALTAS"] === "INCLUIDA NO REPORTADA")
                        .map(({ Familia, NumeroDocumento, Nombres, Apellidos }) => ({ Familia, NumeroDocumento, Nombres, Apellidos }));
                } else if (filterType === "bajas") {
                    filteredData = rowObject.filter(item => item["REPORTE BAJAS"] === "EXCLUIDA NO REPORTADA")
                        .map(({ Familia, NumeroDocumento, Nombres, Apellidos }) => ({ Familia, NumeroDocumento, Nombres, Apellidos }));
                }
            });
            displayData(filteredData);
        };
    }
});

function displayData(data) {
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    // Generar las cabeceras de la tabla
    tableHead.innerHTML = `
        <tr>
            <th>Nombre Completo</th>
            <th>Nº Documento</th>
            <th>Familia</th>
        </tr>
    `;

    // Limpiar el contenido actual de la tabla
    tableBody.innerHTML = ""; 

    // Agregar las filas de datos
    data.forEach(item => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = item.Nombres + " " + item.Apellidos;
        const documentCell = document.createElement("td");
        documentCell.textContent = item.NumeroDocumento;
        const familyCell = document.createElement("td");
        familyCell.textContent = item.Familia;
        row.appendChild(nameCell);
        row.appendChild(documentCell);
        row.appendChild(familyCell);
        tableBody.appendChild(row);
    });
}