export class ClusterSemanticChunker {
  /**
   * @param {Array<string>} contents - mảng mini-chunks text
   * @param {Array<Array<number>>} vectors - mảng vector của mini-chunks
   * @param {number} minChunkSize - số chunks tối thiểu 1 cluster
   * @param {number} maxChunkSize - số chunks tối đa 1 cluster
   */
  constructor({
    contents = [],
    vectors = [],
    minChunkSize = 20,
    maxChunkSize = 400,
  } = {}) {
    if (!contents.length || !vectors.length) {
      throw new Error("contents[] and vectors[] must not be empty");
    }
    if (contents.length !== vectors.length) {
      throw new Error("contents[] and vectors[] must have the same length");
    }

    this.contents = contents;
    this.vectors = vectors;
    this.minChunkSize = minChunkSize;
    this.maxChunkSize = maxChunkSize;
    this.dim = vectors[0].length;

    // Tạo similarity matrix
    this.similarityMatrix = this._computeSimilarityMatrix();
  }

  // Tính cosine similarity matrix
  _computeSimilarityMatrix() {
    const N = this.vectors.length;
    const mat = Array.from({ length: N }, () => Array(N).fill(0));

    for (let i = 0; i < N; i++) {
      const vecI = this.vectors[i];
      const normI = Math.sqrt(vecI.reduce((sum, v) => sum + v * v, 0));
      for (let j = i; j < N; j++) {
        const vecJ = this.vectors[j];
        const normJ = Math.sqrt(vecJ.reduce((sum, v) => sum + v * v, 0));
        let dot = 0;
        for (let d = 0; d < this.dim; d++) dot += vecI[d] * vecJ[d];
        const sim = dot / (normI * normJ + 1e-8);
        mat[i][j] = sim;
        mat[j][i] = sim;
      }
    }
    return mat;
  }

  // Reward = tổng similarity trong cluster [start..end]
  _calculateReward(start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
      for (let j = start; j <= end; j++) {
        sum += this.similarityMatrix[i][j];
      }
    }
    return sum;
  }

  // DP optimal segmentation
  _optimalSegmentation() {
    const N = this.contents.length;
    const dp = new Array(N).fill(0);
    const segmentation = new Array(N).fill(0);

    for (let i = 0; i < N; i++) {
      for (let size = this.minChunkSize; size <= this.maxChunkSize; size++) {
        const start = i - size + 1;
        if (start < 0) break;

        const reward = this._calculateReward(start, i);
        const adjusted = reward + (start - 1 >= 0 ? dp[start - 1] : 0);

        if (adjusted > dp[i]) {
          dp[i] = adjusted;
          segmentation[i] = start;
        }
      }
    }

    // Backtrack
    const clusters = [];
    let i = N - 1;
    while (i >= 0) {
      const start = segmentation[i];
      clusters.push([start, i]);
      i = start - 1;
    }
    clusters.reverse();
    return clusters;
  }

  // Tính centroid vector
  _computeCentroid(vectors) {
    const centroid = new Array(this.dim).fill(0);
    vectors.forEach((v) => {
      for (let d = 0; d < this.dim; d++) centroid[d] += v[d];
    });
    return centroid.map((v) => v / vectors.length);
  }

  // Build clusters
  build() {
    const clustersRange = this._optimalSegmentation();
    return clustersRange.map(([start, end], clusterId) => {
      const texts = this.contents.slice(start, end + 1);
      const vectors = this.vectors.slice(start, end + 1);
      return {
        clusterId,
        indices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        texts,
        mergedText: texts.join(" "),
        centroid: this._computeCentroid(vectors),
      };
    });
  }
}
