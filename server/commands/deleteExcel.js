const deleteExcel = async (excelPath, day) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);

    const worksheet = workbook.getWorksheet(day);

    // データの削除
    worksheet.getCell('A2').value = null;
    worksheet.getCell('B2').value = null;

    // Excelファイルの保存
    await workbook.xlsx.writeFile('path/to/excel/file.xlsx');
};

module.exports = deleteExcel;

