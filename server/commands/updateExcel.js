const updateExcel = async (excelPath, day) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);

    const worksheet = workbook.getWorksheet(day);

    // データの更新
    worksheet.getCell('B2').value = 30;

    // Excelファイルの保存
    await workbook.xlsx.writeFile(excelPath);
};

module.exports = updateExcel;