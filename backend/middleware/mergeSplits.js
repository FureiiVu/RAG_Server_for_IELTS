import { get_encoding } from "tiktoken";

const enc = get_encoding("cl100k_base");

export const mergeSplits = ({
  splits,
  separator = " ",
  chunkSize = 4000,
  chunkOverlap = 200,
  lengthFn = (text) => {
    const tokenIds = enc.encode(text);
    return tokenIds.length;
  },
}) => {
  const separatorLen = lengthFn(separator);
  const docs = [];
  let currentDoc = [];
  let total = 0;

  console.log(
    `[MERGING] Merging ${splits.length} splits into chunks of size ${chunkSize} with overlap ${chunkOverlap}`
  );

  for (const d of splits) {
    const dLen = lengthFn(d);

    if (total + dLen + (currentDoc.length > 0 ? separatorLen : 0) > chunkSize) {
      if (currentDoc.length > 0) {
        const chunk = currentDoc.join(separator).trim();
        if (chunk) docs.push(chunk);

        while (
          total > chunkOverlap ||
          (total + dLen + (currentDoc.length > 0 ? separatorLen : 0) >
            chunkSize &&
            total > 0)
        ) {
          const removedLen =
            lengthFn(currentDoc[0]) +
            (currentDoc.length > 1 ? separatorLen : 0);
          total -= removedLen;
          currentDoc.shift();
        }
      }
    }

    currentDoc.push(d);
    total += dLen + (currentDoc.length > 1 ? separatorLen : 0);
  }

  const lastChunk = currentDoc.join(separator).trim();
  if (lastChunk) docs.push(lastChunk);

  console.log(`[MERGING] Finished merging chunks.`);

  return docs;
};
