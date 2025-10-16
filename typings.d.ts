declare module '@ai4bharat/indic-transliteration' {
  export class Transliteration {
    constructor(config: { source: string; target: string });
    transliterate(text: string): string;
  }
}
