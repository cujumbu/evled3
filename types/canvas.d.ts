declare module 'canvas' {
  export interface Canvas {
    getContext(contextId: '2d'): NodeCanvasRenderingContext2D;
    toBuffer(mimeType: string): Buffer;
    width: number;
    height: number;
  }

  export interface NodeCanvasRenderingContext2D {
    canvas: Canvas;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    drawImage(image: Canvas, dx: number, dy: number): void;
    drawImage(image: Canvas, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: Canvas, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    createPattern(image: Canvas | null, repetition: string | null): CanvasPattern | null;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    roundRect(x: number, y: number, width: number, height: number, radius: number): void;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    fillRect(x: number, y: number, width: number, height: number): void;
    strokeRect(x: number, y: number, width: number, height: number): void;
    font: string;
    textAlign: CanvasTextAlign;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    beginPath(): void;
    fill(): void;
    stroke(): void;
    clip(): void;
    save(): void;
    restore(): void;
    translate(x: number, y: number): void;
    rotate(angle: number): void;
    scale(x: number, y: number): void;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    globalAlpha: number;
    getContextAttributes(): any;
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    globalCompositeOperation: string;
    lineWidth: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    miterLimit: number;
  }

  export function createCanvas(width: number, height: number): Canvas;
  export function loadImage(src: string): Promise<Canvas>;
  
  export interface CanvasGradient {
    addColorStop(offset: number, color: string): void;
  }

  export interface CanvasPattern {
    setTransform(transform?: DOMMatrix2DInit): void;
  }
}
