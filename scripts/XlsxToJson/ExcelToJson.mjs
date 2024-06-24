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
  // Formatea los datos según sea necesario
  const formattedData = jsonData.reduce((acc, dato) => {
      let formattedDato = {};
      // Renombra las claves del objeto JSON
      Object.keys(dato).forEach((key) => {
          if (columnMapping[key]) {
              // Evita la repetición de datos
              if (dato[key] !== columnMapping[key]) {
                  // Verifica si la clave es FECHA NACIMIENTO
                  if (columnMapping[key] === "FECHA NACIMIENTO") {
                      // Convierte el número a fecha legible
                      formattedDato[columnMapping[key]] = new Date((dato[key] - (25567 + 2)) * 86400 * 1000).toLocaleDateString();
                  } else {
                      formattedDato[columnMapping[key]] = dato[key];
                  }
              }
          }
      });
      // Verifica si el objeto no está vacío
      if (Object.keys(formattedDato).length > 0) {
          acc.push(formattedDato);
      }
      return acc;
  }, []);
  // Muestra los datos en pantalla
  document.getElementById("jsondata").innerHTML = JSON.stringify(formattedData, undefined, 4);
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
