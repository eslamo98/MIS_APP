import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

export interface QrCodeOptions {
  width?: number;        // px, default 256
  margin?: number;       // quiet zone, default 4
  color?: {
    dark?: string;       // e.g. '#000000'
    light?: string;      // e.g. '#ffffff'
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // default 'M'
}

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {

  /**
   * Generate a QR code as a Base64 Data URL (PNG).
   * @param barcode  The barcode string to encode.
   * @param options  Optional display options.
   * @returns        Promise<string> — a data:image/png;base64,... URL.
   */
  async generateDataUrl(barcode: string, options: QrCodeOptions = {}): Promise<string> {
    if (!barcode?.trim()) {
      throw new Error('Barcode string must not be empty.');
    }

    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      width: options.width ?? 256,
      margin: options.margin ?? 4,
      color: {
        dark: options.color?.dark ?? '#000000',
        light: options.color?.light ?? '#ffffff',
      },
      errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    };

    return QRCode.toDataURL(barcode, qrOptions);
  }

  /**
   * Draw a QR code directly onto an HTMLCanvasElement.
   * @param barcode  The barcode string to encode.
   * @param canvas   Target <canvas> element.
   * @param options  Optional display options.
   */
  async drawToCanvas(
    barcode: string,
    canvas: HTMLCanvasElement,
    options: QrCodeOptions = {}
  ): Promise<void> {
    if (!barcode?.trim()) {
      throw new Error('Barcode string must not be empty.');
    }

    await QRCode.toCanvas(canvas, barcode, {
      width: options.width ?? 256,
      margin: options.margin ?? 4,
      color: {
        dark: options.color?.dark ?? '#000000',
        light: options.color?.light ?? '#ffffff',
      },
      errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
  }

  /**
   * Generate a QR code as an SVG string.
   * @param barcode  The barcode string to encode.
   * @param options  Optional display options.
   * @returns        Promise<string> — raw SVG markup.
   */
  async generateSvg(barcode: string, options: QrCodeOptions = {}): Promise<string> {
    if (!barcode?.trim()) {
      throw new Error('Barcode string must not be empty.');
    }

    return QRCode.toString(barcode, {
      type: 'svg',
      width: options.width ?? 256,
      margin: options.margin ?? 4,
      color: {
        dark: options.color?.dark ?? '#000000',
        light: options.color?.light ?? '#ffffff',
      },
      errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
  }
}
