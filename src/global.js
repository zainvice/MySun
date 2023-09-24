import ExcelJS from "exceljs";

export async function exportToExcel(projectData) {
    console.log("Data received for export:", projectData); 
  const excel = new ExcelJS.Workbook();
  const sheet = excel.addWorksheet("Projects");

  
  sheet.addRow([
    "Property number",
    "Payment number",
    "Classification",
    "Classification explained",
    "Property old area",
    "Owner Type",
    "Owner Id",
    "Property Address",
    "Owner name",
    "Notes",
  ]);

  projectData.forEach((project) => {
    sheet.addRow([
      project["Property number"],
      project["Payment number"],
      project["Classification"],
      project["Classification explained"],
      project["Property old area"],
      project["Owner Type"],
      project["Owner Id"],
      project["Property Address"],
      project["Owner name"],
      project["Notes"],
    ]);
  });


  const data_1 = await excel.xlsx.writeBuffer();
    const blob = new Blob([data_1], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
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