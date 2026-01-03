export const exportUtils = {
  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    helpers.downloadFile(blob, `${filename}.csv`);
  },

  exportToJSON: (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    helpers.downloadFile(blob, `${filename}.json`);
  },

  printDocument: (elementId) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) return;
    
    const windowPrint = window.open('', '', 'width=900,height=650');
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  },
};