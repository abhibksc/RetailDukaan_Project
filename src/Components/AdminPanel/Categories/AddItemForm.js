import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const AddItemForm = () => {
    const [excelData, setExcelData] = useState([]);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            processExcelData(binaryStr);
        };

        reader.readAsArrayBuffer(file);
    };

    // Process Excel data
    const processExcelData = (binaryStr) => {
        const wb = XLSX.read(binaryStr, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const headers = data[0];
        const result = data.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });

        setExcelData(result);
        console.log(result);
    };

    // Handle file download
    const handleDownloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button onClick={handleDownloadExcel} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Download Excel
            </button>
            <h3 className="mt-6 text-xl font-bold">Excel Data</h3>
            <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
    );
};

export default AddItemForm;
