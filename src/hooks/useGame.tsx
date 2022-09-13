import { Grass, Path, Tower, Enemy } from "../data/Classes";
import { TowerType, EnemyType } from "../data/Types";
import { useRef } from "react";
import parsedMap from "../data/mapParser";
import wavesData from "../data/wavesData.json";

const useGame = () => {
    const mapData = useRef<(Grass | Path)[]>(parsedMap);
    const mapDisplay = useRef<(Grass | Path | Tower | Enemy)[]>([]);
    const gameState = useRef<"Build" | "Defend" | "End Game">("Build");
    const startWaveButton = useRef<"Waiting" | "Pressed" | "Disabled">(
        "Waiting"
    );
    const selectedTileIndex = useRef<number | null>(null);
    const waveIndex = useRef<number>(0);
    const enemies = useRef<Enemy[]>([]);
    const towers = useRef<Tower[]>([]);
    const lives = useRef<number>(5);
    const money = useRef<number>(100);

    const pathEndNumber = useRef<number>(0);
    mapData.current.map((t) => {
        if (t instanceof Path && t.pathNumber > pathEndNumber.current) {
            pathEndNumber.current = t.pathNumber;
        }
        return null;
    });

    //Gets called every frame (1/60)s
    function frameUpdate(): void {
        if (gameState.current === "Build") {
            if (startWaveButton.current === "Pressed") {
                startWaveButton.current = "Disabled";
                gameState.current = "Defend";
                startWave();
            }
        } else if (gameState.current === "Defend") {
            if (enemies.current.length === 0) {
                startWaveButton.current = "Waiting";
                gameState.current = "Build";
                //add money
            }
        } else if (gameState.current === "End Game") {
            //pass
        }
        draw();
    }

    //Gets called every second
    function eventUpdate() {
        if (gameState.current === "Defend") {
            //Update enemies
            for (let i = 0; i < enemies.current.length; i++) {
                if (enemies.current[i].pathNumber === pathEndNumber.current) {
                    enemies.current = enemies.current.filter(
                        (e) => e.pathNumber !== pathEndNumber.current
                    );
                    lives.current -= 1;
                    continue;
                }

                enemies.current[i].pathNumber += 1;
                enemies.current[i].index = getIndexFromPathNumber(
                    enemies.current[i].pathNumber
                ) as number;

                enemies.current[i].updateText();
            }

            //Update towers
            for (let i = 0; i < towers.current.length; i++) {
                //reset text
                towers.current[i].text = towers.current[i].type;

                //Second argument represents the radius
                let tilesAround: (Grass | Path | Tower | Enemy)[] =
                    getTilesAround(towers.current[i].index, 1);
                for (let tile of tilesAround) {
                    if (tile instanceof Enemy) {
                        //attack the enemy
                        tile.health -= towers.current[i].damage;

                        //update tower text
                        towers.current[i].text =
                            towers.current[i].type + " attacking";
                    }
                }
            }

            if (lives.current === 0) {
                gameState.current = "End Game";
            }
        }
    }

    function draw(): void {
        mapDisplay.current = mapData.current.slice();
        for (const enemy of enemies.current) {
            mapDisplay.current[enemy.index] = enemy;
        }
        for (const tower of towers.current) {
            mapDisplay.current[tower.index] = tower;
        }
    }

    function startWave(): void {
        let tempPathNumber = 0;
        for (let enemyName of wavesData[waveIndex.current]) {
            enemies.current.push(
                new Enemy(
                    enemyName as EnemyType,
                    tempPathNumber,
                    getIndexFromPathNumber(tempPathNumber) as number
                )
            );
            tempPathNumber -= 3;
        }
        waveIndex.current++;
    }

    function getTilesAround(
        index: number,
        radius: number
    ): (Grass | Path | Tower | Enemy)[] {
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
        let tileList: (Grass | Path | Tower | Enemy)[] = [];
        for (let i of indexList) {
            tileList.push(mapDisplay.current[indexList[i]]);
        }
        return tileList;
    }

    function placeTower(towerType: TowerType) {
        if (gameState.current !== "End Game") {
            if (
                mapData.current[selectedTileIndex.current as number] instanceof
                Grass
            ) {
                //Add if statement to check if tower already there
                towers.current.push(
                    new Tower(towerType, selectedTileIndex.current as number)
                );
            }
        }
    }

    function getIndexFromPathNumber(input: number): number | null {
        for (let t of mapData.current) {
            if (t instanceof Path && t.pathNumber === input) {
                return t.index;
            }
        }
        return null;
    }

    function pressStartWaveButton(): void {
        startWaveButton.current = "Pressed";
    }

    function getMapDisplay(): (Grass | Path | Tower | Enemy)[] {
        return mapDisplay.current;
    }

    function setSelectedTileIndex(index: number | null): void {
        selectedTileIndex.current = index;
    }

    return {
        lives,
        money,
        frameUpdate,
        eventUpdate,
        getMapDisplay,
        setSelectedTileIndex,
        placeTower,
        pressStartWaveButton,
    };
};

export default useGame;
