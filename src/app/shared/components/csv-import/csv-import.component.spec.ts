import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { CsvImportComponent, CsvParsedEvent } from './csv-import.component';

function setupFileReaderMock(csvContent: string): void {
  class MockFileReader extends FileReader {
    override readAsText(_file: Blob): void {
      setTimeout(() => {
        Object.defineProperty(this, 'result', {
          value: csvContent,
          configurable: true,
        });
        this.onload?.(new ProgressEvent('load') as ProgressEvent<FileReader>);
      }, 0);
    }
  }
  Object.defineProperty(window, 'FileReader', {
    writable: true,
    configurable: true,
    value: MockFileReader,
  });
}

describe('Csv Import Component', () => {
  let component: CsvImportComponent;
  let fixture: ComponentFixture<CsvImportComponent>;
  let fileInputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsvImportComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvImportComponent);
    component = fixture.componentInstance;
    fileInputElement = fixture.debugElement.query(By.css('input[type=file]')).nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(fileInputElement).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should reject non-csv file format', () => {
    const fakeFile = new File(['content'], 'file.txt', { type: 'text/plain' });
    const event = { target: { files: [fakeFile] } } as unknown as Event;

    component.onFileChange(event);
    expect(component.status).toBe('InvalidFormat');
  });

  it('should reject CSV with invalid headers', fakeAsync(() => {
    component.expectedHeaders = ['col1', 'col2'];
    const csvContent = 'wrong1,wrong2\nval1,val2';
    setupFileReaderMock(csvContent);

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const fakeFile = new File([blob], 'data.csv', { type: 'text/csv' });

    component.onFileChange({ target: { files: [fakeFile] } } as Event & { target: { files: File[] } });
    tick();

    expect(component.status).toBe('InvalidHeader');
  }));

  it('should parse valid CSV and emit event', fakeAsync(() => {
    component.expectedHeaders = ['h1', 'h2', 'h3'];
    const csvContent = `h1,h2,h3\na,b,c\nd,e,f`;
    setupFileReaderMock(csvContent);

    let emitted: CsvParsedEvent | undefined;
    component.csvParsed.subscribe(e => (emitted = e));

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const fakeFile = new File([blob], 'valid.csv', { type: 'text/csv' });

    component.onFileChange({ target: { files: [fakeFile] } } as Event & { target: { files: File[] } });
    tick();

    expect(component.status).toBe('ValidFormat');
    expect(emitted).toEqual({
      headers: ['h1', 'h2', 'h3'],
      data: ['a,b,c', 'd,e,f'],
    });
  }));

  it('should reset status and clear file input', fakeAsync(() => {
    component.status = 'ValidFormat';
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileChange(event);
    tick();

    component.reset();

    expect(component.status).toBe('Default');
    expect(fileInputElement.value).toBeEmpty();
  }));
});
