export default class RouteNode {
  id: number;
  gCost: number;
  hCost: number;
  fCost: number;
  parent: RouteNode | null;

  constructor(
    id: number,
    gCost: number,
    hCost: number,
    fCost: number,
    parent: RouteNode | null,
  ) {
    this.id = id;
    this.gCost = gCost;
    this.hCost = hCost;
    this.fCost = fCost;
    this.parent = parent;
  }

  //   public get fCost(): number {
  //     return this.gCost + this.hCost;
  //   }
}
