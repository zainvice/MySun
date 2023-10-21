import ExcelJS from "exceljs";

export async function exportToExcel(projectData) {
  // Create a workbook and add a worksheet
  const excel = new ExcelJS.Workbook();
  const sheet = excel.addWorksheet("Projects");

  // Create an array to store the header row
  const headerRow = [];

  // Iterate over the projectData to dynamically generate headers
  projectData.forEach((project) => {
    for (const key in project) {
      if (!headerRow.includes(key)) {
        headerRow.push(key);
      }
    }
  });

  // Add the header row to the worksheet
  sheet.addRow(headerRow);

  // Iterate over the projectData to populate the worksheet
  projectData.forEach((project) => {
    const rowData = [];
    headerRow.forEach((header) => {
      rowData.push(project[header] || ''); // Use an empty string if the property is missing
    });
    sheet.addRow(rowData);
  });

  // Auto-size columns to fit content
  sheet.columns.forEach((column, index) => {
    sheet.getColumn(index + 1).eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value && typeof cell.value === "string") {
        const columnLength = cell.value.length;
        if (!column.width || columnLength > column.width) {
          column.width = columnLength;
        }
      }
    });
  });

  // Generate the Excel file and return it as a blob
  const data = await excel.xlsx.writeBuffer();
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  return blob;
}




export const formatDate = (date) => {
  const formatedDate = new Date(date);
  return formatedDate.toLocaleDateString('en', {
    weekday: 'short', 
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}