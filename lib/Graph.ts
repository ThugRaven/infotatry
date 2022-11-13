export default class Graph {
  adjacencyList = new Map();

  addVertex(node: number) {
    this.adjacencyList.set(node, []);
  }

  addEdge(origin: number, destination: number) {
    this.adjacencyList.get(origin).push(destination);
    this.adjacencyList.get(destination).push(origin);
  }
}
