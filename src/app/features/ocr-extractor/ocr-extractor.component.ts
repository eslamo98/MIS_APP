import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Declare Tesseract as a global (loaded via CDN script tag)
declare const Tesseract: any;

@Component({
  selector: 'app-ocr-extractor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ocr-extractor.component.html',
  styleUrls: ['./ocr-extractor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcrExtractorComponent implements OnDestroy {
  // State
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  selectedLanguage = 'eng';

  // Processing
  isProcessing = false;
  progress = 0;
  progressStatus = '';

  // Results
  extractedText: string | null = null;
  confidence = 0;
  copied = false;

  // UI
  isDragging = false;
  private copyTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  // ─── Drag & Drop ────────────────────────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.loadFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.loadFile(file);
    }
  }

  private loadFile(file: File): void {
    this.selectedFile = file;
    this.extractedText = null;
    this.confidence = 0;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  clearImage(event: MouseEvent): void {
    event.stopPropagation();
    this.imagePreview = null;
    this.selectedFile = null;
    this.extractedText = null;
    this.confidence = 0;
    this.progress = 0;
  }

  // ─── OCR Extraction ─────────────────────────────────────────────────────────

  async extractText(): Promise<void> {
    if (!this.imagePreview || this.isProcessing) return;

    this.isProcessing = true;
    this.extractedText = null;
    this.progress = 0;
    this.progressStatus = 'Initializing…';
    this.cdr.markForCheck();

    try {
      // Ensure Tesseract is available
      if (typeof Tesseract === 'undefined') {
        throw new Error(
          'Tesseract.js is not loaded. Please add the CDN script to index.html.'
        );
      }

      const result = await Tesseract.recognize(
        this.imagePreview,
        this.selectedLanguage,
        {
          logger: (info: any) => {
            if (info.status === 'recognizing text') {
              this.progress = Math.round(info.progress * 100);
              this.progressStatus = 'Recognizing text…';
            } else if (info.status === 'loading tesseract core') {
              this.progressStatus = 'Loading OCR engine…';
              this.progress = 10;
            } else if (info.status === 'initializing api') {
              this.progressStatus = 'Initializing…';
              this.progress = 30;
            } else if (info.status === 'loading language traineddata') {
              this.progressStatus = `Loading ${this.selectedLanguage} language data…`;
              this.progress = 50;
            }
            this.cdr.markForCheck();
          },
        }
      );

      this.extractedText = result.data.text;
      this.confidence = result.data.confidence;
    } catch (error: any) {
      console.error('OCR Error:', error);
      this.extractedText = `Error: ${error.message || 'OCR extraction failed. Please try again.'}`;
      this.confidence = 0;
    } finally {
      this.isProcessing = false;
      this.progress = 100;
      this.cdr.markForCheck();
    }
  }

  // ─── Utilities ──────────────────────────────────────────────────────────────

  get wordCount(): number {
    if (!this.extractedText?.trim()) return 0;
    return this.extractedText.trim().split(/\s+/).length;
  }

  copyText(): void {
    if (!this.extractedText) return;
    navigator.clipboard.writeText(this.extractedText).then(() => {
      this.copied = true;
      this.cdr.markForCheck();
      clearTimeout(this.copyTimeout);
      this.copyTimeout = setTimeout(() => {
        this.copied = false;
        this.cdr.markForCheck();
      }, 2000);
    });
  }

  downloadText(): void {
    if (!this.extractedText) return;
    const blob = new Blob([this.extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-result-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    clearTimeout(this.copyTimeout);
  }
}
