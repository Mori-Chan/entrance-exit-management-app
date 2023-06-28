const ExcelJS = require('exceljs');
const path = require('path');

const inputEntranceExcel = async ( excelPath, sheetName, number, area, disabled, caregiver, card ) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.getWorksheet(sheetName);

    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    let entranceTimeColumn;
    let numberColumn;
    let areaColumn;
    let disabledColumn;
    let caregiverColumn;
    let cardColumn;
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
    rows.forEach((row) => {
        row.forEach((cell, colIndex) => {
            if ( cell.value === '入場時間' ) {
                entranceTimeColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value === 'No.' ) {
                numberColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value === area ) {
                areaColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value === '手帳' ) {
                disabledColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value === '介助者' ) {
                caregiverColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( cell.value === 'カード' ) {
                cardColumn = worksheet.getColumn(colIndex + 1).letter;
            }
        });
    });

    const columnA = worksheet.getColumn(`${ numberColumn }`);
    let lastRowNumber = columnA.values.length;

    while (lastRowNumber > 0 && !worksheet.getCell(`${ numberColumn }${ lastRowNumber }`).value) {
        lastRowNumber--;
    }

    worksheet.getCell(`${ entranceTimeColumn }${ lastRowNumber + 1 }`).value = `${ hour }:${ minutes }` ;
    worksheet.getCell(`${ numberColumn }${ lastRowNumber + 1 }`).value = parseInt(number);
    worksheet.getCell(`${ areaColumn }${ lastRowNumber + 1 }`).value = '〇';

    if ( disabled ) {
        worksheet.getCell(`${ disabledColumn }${ lastRowNumber + 1 }`).value = '〇';
    }
    if ( caregiver ) {
        worksheet.getCell(`${ caregiverColumn }${ lastRowNumber + 1 }`).value = '〇';
    }
    if ( card ) {
        worksheet.getCell(`${ cardColumn }${ lastRowNumber + 1 }`).value = '〇';
    }

    await workbook.xlsx.writeFile(excelPath);
};

module.exports = inputEntranceExcel;