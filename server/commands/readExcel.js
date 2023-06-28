const ExcelJS = require('exceljs');
const searchNameExcel = require('./searchNameExcel');

const readExcel = async (excelPath, listPath, sheetName) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.getWorksheet(sheetName);

    const rows = [];

    worksheet.eachRow({ includeEmpty: true }, (row) => {
        const rowData = [];

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const cellData = {
                value: null,
                colspan: 1,
                rowspan: 1,
                isMerged: false,
            };

            // 値を取得
            if (cell.value) {
                if (!cell.isMerged) {
                    if (cell.type === ExcelJS.ValueType.Formula) {
                        // セルに関数が入力されている場合は計算結果を取得
                        const result = cell.result;
                        if (result instanceof Date) {
                            // 計算結果が日時の場合は"〇月〇日"の形式で表示
                            const month = (result.getUTCMonth() + 1).toString();
                            const day = result.getUTCDate().toString();
                            cellData.value = `${month}月${day}日`;
                        } else {
                            cellData.value = result !== null && result !== undefined && result !== 0 ? result.toString() : '0';
                        }
                    } else if (cell.type === ExcelJS.ValueType.Date) {
                        // 日時の場合はフォーマットを変更して取得
                        const dateValue = cell.value;
                        const hours = dateValue.getUTCHours().toString().padStart(2, '0');
                        const minutes = dateValue.getUTCMinutes().toString().padStart(2, '0');
                        cellData.value = `${hours}:${minutes}`;
                    } else {
                        cellData.value = cell.value.toString();
                    }
                } else {
                    const mergedCell = cell.master;

                        if (mergedCell === cell) {
                            cellData.value = cell.value;
                            cellData.isMerged = true;
                        } else {
                            cellData.value = '';
                        }
                }
            }
            rowData.push(cellData);
        });

        rows.push(rowData);
    });

    let html = '<table>';
    let nameColumn;
    let numberColumn;
    let number;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        let confhtml = '<tr>';
        let preCellValue = '';

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cell = row[colIndex];
            const value = cell.value !== null ? cell.value.toString() : '';
            if ( cell.value === '氏名' ) {
                nameColumn = worksheet.getColumn(colIndex + 1).letter;
            } else if ( cell.value === 'No.' ) {
                numberColumn = worksheet.getColumn(colIndex + 1).letter;
            }
            if ( ( cell.value === '' || cell.value === null ) && worksheet.getColumn(colIndex + 1).letter === nameColumn && !(isNaN(worksheet.getCell(`${ numberColumn }${ rowIndex + 1 }`).value)) && worksheet.getCell(`${ numberColumn }${ rowIndex + 1 }`).value !== null ) {
                number = worksheet.getCell(`${ numberColumn }${ rowIndex + 1 }`).value;
                const searchValue = await searchNameExcel( listPath, number );
                confhtml += `<td>${ searchValue }</td>`;
                preCellValue = searchValue;
                worksheet.getCell(`${ nameColumn }${ rowIndex + 1 }`).value = `${ searchValue }`;
                await workbook.xlsx.writeFile(excelPath);
            } else if (( preCellValue === '' && cell.value === '' ) || ( preCellValue === '入退場者記録' && cell.value === '' ) || ( preCellValue === 'ボルダー' && cell.value === '' ) || ( preCellValue === 'コンペ' && cell.value === '' )) {
                preCellValue = cell.value;
            } else {
                if (cell.isMerged && (cell.value === '入退場者記録' || cell.value === 'ボルダー')) {
                    if (cell.value === '入退場者記録') {
                        confhtml += `<td colspan="3" class="mergedCell">${value}</td>`;
                    } else if (cell.value === 'ボルダー') {
                        confhtml += `<td colspan="2" class="mergedCell">${value}</td>`;
                    }
                    preCellValue = cell.value;
                } else if (cell.isMerged) {
                    confhtml += `<td rowspan="2" class="mergedCell">${value}</td>`;
                    preCellValue = cell.value;
                } else {
                    confhtml += `<td>${value}</td>`;
                    preCellValue = cell.value;
                }
            }
        }

        confhtml += '</tr>';
        if (confhtml !== '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>') {
            html += confhtml;
        }
    }

    html += '</table>';
    return html;
};

module.exports = readExcel;
