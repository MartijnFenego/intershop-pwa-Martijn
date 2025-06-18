export class CsvImportHelper {
  parseCSVFileContent(fileContent: string): string[] {
    return fileContent.split('\n').filter(line => line.trim() !== '');
  }

  validateHeaders(fileHeaders: string[], expectedHeaders: string[]): boolean {
    if (!fileHeaders || fileHeaders.length === 0) {
      return false;
    }
    if (fileHeaders.length !== expectedHeaders.length) {
      return false;
    }
    return expectedHeaders.every(expected => fileHeaders.includes(expected));
  }

  processCsvFileChange(file: File, expectedHeaders: string[] = []): Promise<{ data: string[]; headers: string[] }> {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.csv')) {
        return reject('InvalidFormat');
      }
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const fileContent = reader.result as string;
        const lines = this.parseCSVFileContent(fileContent);
        let headers: string[] = [];
        if (expectedHeaders.length > 0 && lines.length > 0) {
          headers = lines[0].split(',').map(h => h.trim());
          if (!this.validateHeaders(headers, expectedHeaders)) {
            return reject('InvalidHeader');
          }
        }
        resolve({ data: lines.slice(expectedHeaders.length > 0 ? 1 : 0), headers });
      };
      reader.onerror = () => {
        reject('InvalidFormat');
      };
    });
  }
}
