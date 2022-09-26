import simpleMap from "./simpleMap2.json";
import { Grass, Path } from "./Classes";

let map: (Grass | Path)[] = [];
let index: number = 0;
for (let row of simpleMap) {
    for (let s of row) {
        if (s === "G") {
            map.push(new Grass(index));
        } else {
            map.push(new Path(Number(s), index));
        }
        index++;
    }
}

export default map;
