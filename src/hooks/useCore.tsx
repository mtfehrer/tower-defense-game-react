import { Grass, Path, Enemy, Tower } from "../data/Classes";

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

    function getTilesAround(
        index: number,
        radius: number,
        map: (Grass | Path | Enemy | Tower)[]
    ): (Grass | Path | Enemy | Tower)[] {
        let mapWidth = 16;
        let mapHeight = 9;
        let row = Math.floor(index / mapWidth);
        let col = index - row * mapWidth;
        //console.log("Row " + row);
        //console.log("Col " + col);

        //Unfinished functionality for indicing map matrix
        // let mapMatrix: (Grass | Path | Enemy | Tower)[][] = [];

        // for (let t of map) {
        //     let r = Math.floor(t.index / mapWidth);
        //     //let col = t.index - (r * mapWidth)
        //     mapMatrix[r].push(t);
        // }

        // if (radius > 2) {
        //     return map;
        // }

        // //indexList for radius 1
        // let indexList: number[] = []
        // indexList.push(mapMatrix[row - 1][col - 1])

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

        //For radius of 1
        let topThree = [
            { row: row - 1, col: col - 1 },
            { row: row - 1, col: col },
            { row: row - 1, col: col + 1 },
        ];
        let leftThree = [
            { row: row - 1, col: col - 1 },
            { row: row, col: col - 1 },
            { row: row + 1, col: col + 1 },
        ];
        let rightThree = [
            { row: row - 1, col: col + 1 },
            { row: row, col: col + 1 },
            { row: row + 1, col: col + 1 },
        ];
        let bottomThree = [
            { row: row + 1, col: col - 1 },
            { row: row + 1, col: col },
            { row: row + 1, col: col + 1 },
        ];
        if (row - 1 < 0) {
            indexList = getRemovedIndices(indexList, topThree);
        }
        if (row + 1 > mapHeight - 1) {
            indexList = getRemovedIndices(indexList, bottomThree);
        }
        if (col - 1 < 0) {
            indexList = getRemovedIndices(indexList, leftThree);
        }
        if (col + 1 > mapWidth - 1) {
            indexList = getRemovedIndices(indexList, rightThree);
        }

        if (radius === 2) {
            //Radius 2 outer circle
            let temp = [
                //Top five
                index - mapWidth * 2 - 2,
                index - mapWidth * 2 - 1,
                index - mapWidth * 2,
                index - mapWidth * 2 + 1,
                index - mapWidth * 2 + 2,
                //Bottom five
                index + mapWidth * 2 - 2,
                index + mapWidth * 2 - 1,
                index + mapWidth * 2,
                index + mapWidth * 2 + 1,
                index + mapWidth * 2 + 2,
                //Left three
                index - mapWidth - 2,
                index - 2,
                index + mapWidth - 2,
                //Right three
                index - mapWidth + 2,
                index + 2,
                index + mapWidth + 2,
            ];
            for (let i of temp) {
                indexList.push(i);
            }

            let topFive = [
                { row: row - 2, col: col - 2 },
                { row: row - 2, col: col - 1 },
                { row: row - 2, col: col },
                { row: row - 2, col: col + 1 },
                { row: row - 2, col: col + 2 },
            ];
            let bottomFive = [
                { row: row + 2, col: col - 2 },
                { row: row + 2, col: col - 1 },
                { row: row + 2, col: col },
                { row: row + 2, col: col + 1 },
                { row: row + 2, col: col + 2 },
            ];
            let leftFive = [
                { row: row - 2, col: col - 2 },
                { row: row - 1, col: col - 2 },
                { row: row, col: col - 2 },
                { row: row + 1, col: col - 2 },
                { row: row + 2, col: col - 2 },
            ];
            let rightFive = [
                { row: row - 2, col: col + 2 },
                { row: row - 1, col: col + 2 },
                { row: row, col: col + 2 },
                { row: row + 1, col: col + 2 },
                { row: row + 2, col: col + 2 },
            ];

            if (row - 2 < 0) {
                indexList = getRemovedIndices(indexList, topFive);
            }
            if (row + 2 > mapHeight - 1) {
                indexList = getRemovedIndices(indexList, bottomFive);
            }
            if (col - 2 < 0) {
                indexList = getRemovedIndices(indexList, leftFive);
            }
            if (col + 2 > mapWidth - 1) {
                indexList = getRemovedIndices(indexList, rightFive);
            }
        }

        let tileList: (Grass | Path | Tower | Enemy)[] = [];
        for (let i of indexList) {
            try {
                tileList.push(map[i]);
            } catch (e) {
                console.log(e);
            }
        }

        return tileList;
    }

    function getRemovedIndices(
        indexList: number[],
        indices: { row: number; col: number }[]
    ) {
        return indexList.filter((i) => {
            for (let obj of indices) {
                if (i === rowColToIndex(obj.row, obj.col)) {
                    return false;
                }
            }
            return true;
        });
    }

    function rowColToIndex(row: number, col: number) {
        return row * 16 + col;
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
        getTilesAround,
        getIndexFromPathNumber,
    };
};

export default useCore;
