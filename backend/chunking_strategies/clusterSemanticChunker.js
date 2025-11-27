export class ClusterSemanticChunker {
  constructor(options = {}) {
    this.maxClusterSize = options.maxClusterSize || 5;
    this.linkage = options.linkage || "complete";
  }

  // Precompute cosine similarity matrix
  _precomputeSimilarity(vectors) {
    const n = vectors.length;
    const sim = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        if (i === j) {
          sim[i][j] = 1;
          continue;
        }
        sim[i][j] = sim[j][i] = this._cosine(vectors[i], vectors[j]);
      }
    }
    return sim;
  }

  // Cosine similarity
  _cosine(a, b) {
    let dot = 0,
      na = 0,
      nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  // Cluster similarity using precomputed matrix
  _clusterSimilarity(A, B, sim) {
    if (this.linkage === "complete") {
      let minSim = Infinity;
      for (const i of A.items) {
        for (const j of B.items) {
          if (sim[i][j] < minSim) minSim = sim[i][j];
        }
      }
      return minSim;
    }

    // average-linkage
    let sum = 0,
      count = 0;
    for (const i of A.items) {
      for (const j of B.items) {
        sum += sim[i][j];
        count++;
      }
    }
    return sum / count;
  }

  // Agglomerative clustering
  _agglomerate(vectors) {
    const n = vectors.length;
    const sim = this._precomputeSimilarity(vectors);

    // Initial clusters
    let clusters = new Map();
    for (let i = 0; i < n; i++) {
      clusters.set(i, { id: i, items: [i] });
    }

    // Build initial heap
    let heap = [];

    const pushHeap = (a, b) => {
      const A = clusters.get(a),
        B = clusters.get(b);
      if (!A || !B) return;

      if (A.items.length + B.items.length > this.maxClusterSize) return;

      const s = this._clusterSimilarity(A, B, sim);
      heap.push([s, a, b]); // [similarity, clusterIdA, clusterIdB]
    };

    // Initialize all pairs
    const ids = [...clusters.keys()];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        pushHeap(ids[i], ids[j]);
      }
    }

    // Convert heap into max-heap
    heap.sort((a, b) => b[0] - a[0]);

    const popHeap = () => heap.shift();

    // Main loop
    while (heap.length > 0) {
      const [bestSim, a, b] = popHeap();

      // clusters may have changed → must validate
      if (!clusters.has(a) || !clusters.has(b)) continue;

      const A = clusters.get(a);
      const B = clusters.get(b);

      // final validation
      if (A.items.length + B.items.length > this.maxClusterSize) continue;

      // Merge clusters A and B → new cluster C
      clusters.delete(a);
      clusters.delete(b);

      const newId = Math.max(...clusters.keys(), -1) + 1;
      const C = { id: newId, items: [...A.items, ...B.items] };
      clusters.set(newId, C);

      // Remove outdated heap entries: lazy removal (ignore invalid entries)
      // Add new pairs to heap
      for (const otherId of clusters.keys()) {
        if (otherId === newId) continue;
        pushHeap(newId, otherId);
      }

      // Re-sort heap in descending similarity (simple but still efficient)
      heap.sort((a, b) => b[0] - a[0]);
    }

    return [...clusters.values()].map((c) => c.items);
  }

  // Main clustering method
  cluster(chunks, vectors) {
    if (!vectors || vectors.length === 0) return [];

    const groups = this._agglomerate(vectors);

    return groups.map((group) => ({
      chunkCount: group.length,
      chunks: group.map((idx) => chunks[idx]),
    }));
  }
}
