let selectedFile;

// Función para convertir Excel a JSON
const excelToJson = (data) => {
    let workbook = XLSX.read(data, { type: "array" });
    let jsonData = [];
    workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
        jsonData.push(...rowObject);
    });
    return jsonData;
};

// Mapeo de nombres de columnas vacías a nombres descriptivos
const columnMapping = {
    "__EMPTY_1": "RESGUARDO INDIGENA",
    "__EMPTY_2": "COMUNIDAD INDIGENA",
    "__EMPTY_3": "FAMILIA",
    "__EMPTY_4": "TIPO IDENTIFICACION",
    "__EMPTY_5": "NUMERO DOCUMENTO",
    "__EMPTY_6": "NOMBRE",
    "__EMPTY_7": "APELLIDOS",
    "__EMPTY_8": "FECHA NACIMIENTO",
    "__EMPTY_9": "PARENTESCO",
    "__EMPTY_10": "SEXO",
    "__EMPTY_11": "ESTADO CIVIL",
    "__EMPTY_12": "PROFESION",
    "__EMPTY_13": "ESCOLARIDAD",
    "__EMPTY_14": "INTEGRANTES",
    "__EMPTY_15": "DIRECCION",
    "__EMPTY_16": "USUARIO"
};

// Función para procesar el archivo Excel
const processExcel = (data) => {
    let jsonData = excelToJson(data);
    const filterType = document.querySelector('input[name="filterType"]:checked').value;
    let filteredData;

    if (filterType === "altas") {
        filteredData = jsonData.filter(item => item["REPORTE DE ALTAS"] === "INCLUIDA NO REPORTADA");
    } else if (filterType === "bajas") {
        filteredData = jsonData.filter(item => item["REPORTE BAJAS"] === "EXCLUIDA NO REPORTADA");
    } else {
        filteredData = jsonData;
    }

    const formattedData = filteredData.reduce((acc, dato) => {
        let formattedDato = {};
        Object.keys(dato).forEach((key) => {
            if (columnMapping[key]) {
                if (dato[key] !== columnMapping[key]) {
                    if (columnMapping[key] === "FECHA NACIMIENTO") {
                        formattedDato[columnMapping[key]] = new Date((dato[key] - (25567 + 2)) * 86400 * 1000).toLocaleDateString();
                    } else {
                        formattedDato[columnMapping[key]] = dato[key];
                    }
                }
            }
        });
        if (Object.keys(formattedDato).length > 0) {
            acc.push(formattedDato);
        }
        return acc;
    }, []);
    displayData(formattedData);
};

// Escucha el evento change del input
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
});

// Escucha el evento click del botón
document.getElementById('button').addEventListener("click", () => {
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            processExcel(data);
        };
    }
});

// Función para mostrar los datos en la tabla
function displayData(data) {
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    // Generar las cabeceras de la tabla
    tableHead.innerHTML = `
        <tr>
            <th>RESGUARDO INDIGENA</th>
            <th>COMUNIDAD INDIGENA</th>
            <th>FAMILIA</th>
            <th>TIPO IDENTIFICACION</th>
            <th>NUMERO DOCUMENTO</th>
            <th>NOMBRE</th>
            <th>APELLIDOS</th>
            <th>FECHA NACIMIENTO</th>
            <th>PARENTESCO</th>
            <th>SEXO</th>
            <th>ESTADO CIVIL</th>
            <th>PROFESION</th>
            <th>ESCOLARIDAD</th>
            <th>INTEGRANTES</th>
            <th>DIRECCION</th>
            <th>USUARIO</th>
        </tr>
    `;

    // Limpiar el contenido actual de la tabla
    tableBody.innerHTML = "";

    // Agregar las filas de datos
    data.forEach(item => {
        const row = document.createElement("tr");
        Object.keys(columnMapping).forEach((key) => {
            const cell = document.createElement("td");
            cell.textContent = item[columnMapping[key]] || "";
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}