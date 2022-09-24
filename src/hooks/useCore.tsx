import { Grass, Path } from "../data/Classes";

const useCore = () => {
    function getPathEndNumber(mapData: (Grass | Path)[]): number {
        let result = 0;
        mapData.map((t) => {
            if (t instanceof Path && t.pathNumber > result) {
                result = t.pathNumber;
            }
        });
        return result;
    }

    function getIndexesOfTilesAround(index: number, radius: number): number[] {
        //add this correctly
        let mapWidth = 16;
        let mapHeight = 9;

        //Only works for radius of 1
        let indexList: number[] = [
            index - mapWidth - 1,
            index - mapWidth,
            index - mapWidth + 1,
            index - 1,
            index + 1,
            index + mapWidth - 1,
            index + mapWidth,
            index + mapWidth + 1,
        ];
        //let tileList: (Grass | Path | Tower | Enemy)[] = [];
        //for (let i of indexList) {
        //    tileList.push(mapDisplay.current[indexList[i]]);
        //}
        return indexList;
    }

    function getIndexFromPathNumber(
        input: number,
        mapData: (Grass | Path)[]
    ): number | null {
        for (let t of mapData) {
            if (t instanceof Path && t.pathNumber === input) {
                return t.index;
            }
        }
        return null;
    }

    return {
        getPathEndNumber,
        getIndexesOfTilesAround,
        getIndexFromPathNumber,
    };
};

export default useCore;
