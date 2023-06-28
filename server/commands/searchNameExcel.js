const ExcelJS = require('exceljs');

const searchNameExcel = async (excelPath, number) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.getWorksheet(1);
    let nameColumn;
    let numberColumn;
    let listName;
    const rows = [];

    worksheet.eachRow({ includeEmpty: true }, (row) => {
        const rowData = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
            const cellData = {
                value: null,
                colspan: 1,
                rowspan: 1,
                isMerged: false,
            };
            if (cell.value) {
                cellData.value = cell.value.toString();
            }
            rowData.push(cellData);
        });
        rows.push(rowData);
    });
    rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
        });
    });
    rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if ( cell.value === 'No.' ) {
                numberColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value === '氏名' ) {
                nameColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value == number ) {
                if ( numberColumn === worksheet.getColumn(colIndex + 1).letter ) {
                    listName = worksheet.getCell(`${ nameColumn }${ rowIndex + 1 }`).value;
                    
                }
            }
        });
    });
    if ( listName === undefined ) {
        listName = '';
    }
    return listName;
};

module.exports = searchNameExcel;