const ExcelJS = require('exceljs');

const inputExitExcel = async (excelPath, sheetName, number) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.getWorksheet(sheetName);

    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    let exitTimeColumn;
    let numberColumn;
    let exitTimeRow;
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
            if (cell.value === '退場時間') {
                exitTimeColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if (cell.value === 'No.') {
                numberColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if (cell.value === number && numberColumn === worksheet.getColumn(colIndex + 1).letter) {
                exitTimeRow = rowIndex + 1;
            }
        });
    });

    if ( exitTimeColumn && exitTimeRow ) {
        worksheet.getCell(`${ exitTimeColumn }${ exitTimeRow }`).value = `${ hour }:${ minutes }`;
        await workbook.xlsx.writeFile(excelPath);
    } else {
        return `会員番号${ number }は入場していません。`
    }

};

module.exports = inputExitExcel;