export type Pokemon={dex:number;name:string;id:number;type:string;evolution:string;locations:string;stats:number[];limited?:boolean};
export type Grade='S'|'A'|'B'|'C'|'D'|'F';
export type Strategy='balanced'|'offense'|'speed'|'defense'|'capture';
export type TeamFilters={caughtOnly:boolean;allowLegendaries:boolean;caught:Set<number>};
export type Replacement={outgoing:Pokemon;incoming:Pokemon;improvement:number;reasons:string[];tradeoff:string};
