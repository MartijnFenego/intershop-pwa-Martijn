import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface CsvParsedEvent {
  data: string[];
  headers: string[];
}

@Component({
  selector: 'ish-csv-import',
  templateUrl: './csv-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslatePipe],
})
export class CsvImportComponent {
  @Input() accept = '.csv';
  @Input() subtitleKey: string;
  @Input() sampleTextKey: string;
  @Input() expectedHeaders: string[] = [];

  @Output() csvParsed = new EventEmitter<CsvParsedEvent>();

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;

  status: 'Default' | 'ValidFormat' | 'InvalidHeader' | 'InvalidFormat' = 'Default';

  constructor(private cdRef: ChangeDetectorRef) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.endsWith('.csv')) {
        this.status = 'InvalidFormat';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        const lines = fileContent.split('\n').filter(Boolean);
        let fileHeaders: string[] = [];

        if (this.expectedHeaders && this.expectedHeaders.length > 0) {
          const headerLine = lines[0];
          fileHeaders = headerLine.split(',').map(h => h.trim());

          if (!this.validateHeaders(fileHeaders)) {
            this.status = 'InvalidHeader';
            this.cdRef.markForCheck();
            return;
          }
        }

        this.csvParsed.emit({ data: lines.slice(1), headers: fileHeaders });
        this.status = 'ValidFormat';
      };
      reader.onerror = () => {
        this.status = 'InvalidFormat';
      };
      reader.readAsText(file);
    }
  }

  validateHeaders(fileHeaders: string[]): boolean {
    if (!fileHeaders || fileHeaders.length === 0) {
      return false;
    }
    if (fileHeaders.length !== this.expectedHeaders.length) {
      return false;
    }
    return this.expectedHeaders.every(expected => fileHeaders.includes(expected));
  }

  reset(): void {
    this.status = 'Default';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.cdRef.markForCheck();
  }
}
