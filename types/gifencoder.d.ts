declare module 'gifencoder' {
  class GIFEncoder {
    constructor(width: number, height: number);
    start(): void;
    setRepeat(repeat: number): void;
    setDelay(delay: number): void;
    setQuality(quality: number): void;
    addFrame(context: NodeCanvasRenderingContext2D): void;
    finish(): void;
    out: {
      getData(): Buffer;
    };
  }
  export = GIFEncoder;
}