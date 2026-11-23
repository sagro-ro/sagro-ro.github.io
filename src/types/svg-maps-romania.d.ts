declare module '@svg-maps/romania' {
  export interface RomaniaMapLocation {
    readonly id: string;
    readonly name: string;
    readonly path: string;
  }

  interface RomaniaMap {
    readonly viewBox: '0 0 613 433';
    readonly locations: readonly RomaniaMapLocation[];
  }

  const romania: RomaniaMap;
  export default romania;
}
