import { get_encoding } from "tiktoken";
import { mergeSplits } from "../middleware/mergeSplits.js";

const enc = get_encoding("cl100k_base");

export class RecursiveTokenChunker {
  constructor({
    chunkSize = 200,
    chunkOverlap = 0,
    separators = ["\n\n", "\n", ".", "?", "!", " ", ""],
    keepSeparator = true,
  } = {}) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.separators = separators;
    this.keepSeparator = keepSeparator;
  }

  lengthFn(text) {
    return enc.encode(text).length;
  }

  _splitTextWithRegex(text, separator) {
    if (!separator) return text.split("");

    const pattern = new RegExp(separator, "g");
    const parts = text.split(pattern);

    if (this.keepSeparator && separator !== "") {
      return parts
        .map((p, i) => (i < parts.length - 1 ? p + separator : p))
        .filter(Boolean);
    }

    return parts.filter(Boolean);
  }

  _splitTextRecursive(text, separators) {
    const finalChunks = [];

    if (!separators.length) {
      finalChunks.push(text);
      return finalChunks;
    }

    let separator = separators[separators.length - 1];
    let newSeparators = [];

    for (let i = 0; i < separators.length; i++) {
      const sep = separators[i];
      if (sep === "" || text.includes(sep)) {
        separator = sep;
        newSeparators = separators.slice(i + 1);
        break;
      }
    }

    const splits = this._splitTextWithRegex(text, separator);

    let goodSplits = [];
    const mergeSeparator = this.keepSeparator ? "" : separator;

    for (const s of splits) {
      if (this.lengthFn(s) < this.chunkSize) {
        goodSplits.push(s);
      } else {
        if (goodSplits.length > 0) {
          const merged = mergeSplits({
            splits: goodSplits,
            separator: mergeSeparator,
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
          });
          finalChunks.push(...merged);
          goodSplits = [];
        }
        if (newSeparators.length === 0) {
          finalChunks.push(s);
        } else {
          finalChunks.push(...this._splitTextRecursive(s, newSeparators));
        }
      }
    }

    if (goodSplits.length > 0) {
      const merged = mergeSplits({
        splits: goodSplits,
        separator: mergeSeparator,
        chunkSize: this.chunkSize,
        chunkOverlap: this.chunkOverlap,
      });
      finalChunks.push(...merged);
    }

    return finalChunks;
  }

  splitText(text) {
    return this._splitTextRecursive(text, this.separators);
  }
}
