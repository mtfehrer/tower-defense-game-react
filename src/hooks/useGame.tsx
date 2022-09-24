import { Grass, Path, Tower, Enemy } from "../data/Classes";
import { TowerType, EnemyType } from "../data/Types";
import { useRef } from "react";
import parsedMap from "../data/mapParser";
import wavesData from "../data/wavesData.json";
import useCore from "./useCore";

const useGame = () => {
    const mapData = useRef<(Grass | Path)[]>(parsedMap);
    const mapDisplay = useRef<(Grass | Path | Tower | Enemy)[]>([]);
    const gameState = useRef<"Build" | "Defend" | "End Game">("Build");
    const startWaveButton = useRef<"Waiting" | "Pressed" | "Disabled">(
        "Waiting"
    );
    const selectedTileIndex = useRef<number | null>(null);
    const pathEndNumber = useRef<number | null>(null);
    const waveIndex = useRef<number>(0);
    const enemies = useRef<Enemy[]>([]);
    const towers = useRef<Tower[]>([]);
    const lives = useRef<number>(5);
    const money = useRef<number>(100);

    const {
        getPathEndNumber,
        getIndexesOfTilesAround,
        getIndexFromPathNumber,
    } = useCore();

    pathEndNumber.current = getPathEndNumber(mapData.current);

    //Gets called every frame (1/60)s
    //Handles only instantaneous changes
    function frameUpdate() {
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
                money.current += 100;
            }
        } else if (gameState.current === "End Game") {
            //pass
        }
        draw();
    }

    //Gets called every second
    //Handles game updates
    function eventUpdate() {
        if (gameState.current === "Defend") {
            updateEnemies();
            updateTowers();

            if (lives.current === 0) {
                gameState.current = "End Game";
            }
        }
    }

    function updateTowers() {
        for (let tower of towers.current) {
            tower.updateText("idle");

            //Second argument represents the radius
            let indexList = getIndexesOfTilesAround(tower.index, 1);

            let tilesAround: (Grass | Path | Tower | Enemy)[] = [];
            for (let i of indexList) {
                tilesAround.push(mapDisplay.current[i]);
            }

            for (let tile of tilesAround) {
                if (tile instanceof Enemy) {
                    //attack the enemy
                    tile.health -= tower.damage;

                    tower.updateText("attacking");
                }
            }
        }
        // for (let i = 0; i < towers.current.length; i++) {
        //     //reset text
        //     towers.current[i].updateText("idle");

        //     //Second argument represents the radius
        //     let indexList = getIndexesOfTilesAround(towers.current[i].index, 1);

        //     let tilesAround: (Grass | Path | Tower | Enemy)[] = [];
        //     for (let t of indexList) {
        //         tilesAround.push(mapDisplay.current[indexList[i]]);
        //     }

        //     for (let tile of tilesAround) {
        //         if (tile instanceof Enemy) {
        //             //attack the enemy
        //             tile.health -= towers.current[i].damage;

        //             towers.current[i].updateText("attacking");
        //         }
        //     }
        // }
    }

    function updateEnemies() {
        for (let enemy of enemies.current) {
            if (enemy.pathNumber === pathEndNumber.current) {
                enemies.current = enemies.current.filter(
                    (e) => e.pathNumber !== pathEndNumber.current
                );
                lives.current -= 1;
                continue;
            }

            enemy.pathNumber += 1;
            enemy.index = getIndexFromPathNumber(
                enemy.pathNumber,
                mapData.current
            ) as number;

            enemy.updateText();
        }
        //for (let i = 0; i < enemies.current.length; i++) {
        // if (enemies.current[i].pathNumber === pathEndNumber.current) {
        //     enemies.current = enemies.current.filter(
        //         (e) => e.pathNumber !== pathEndNumber.current
        //     );
        //     lives.current -= 1;
        //     continue;
        // }

        // enemies.current[i].pathNumber += 1;
        // enemies.current[i].index = getIndexFromPathNumber(
        //     enemies.current[i].pathNumber,
        //     mapData.current
        // ) as number;

        // enemies.current[i].updateText();
        //}
    }

    function updateTowerText(tower: Tower, action: string) {
        tower.text = tower.type + " " + action;
    }

    function draw() {
        mapDisplay.current = mapData.current.slice();
        for (const enemy of enemies.current) {
            mapDisplay.current[enemy.index] = enemy;
        }
        for (const tower of towers.current) {
            mapDisplay.current[tower.index] = tower;
        }
    }

    function startWave() {
        let tempPathNumber = 0;
        for (let enemyName of wavesData[waveIndex.current]) {
            enemies.current.push(
                new Enemy(
                    enemyName as EnemyType,
                    tempPathNumber,
                    getIndexFromPathNumber(
                        tempPathNumber,
                        mapData.current
                    ) as number
                )
            );
            tempPathNumber -= 3;
        }
        waveIndex.current++;
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

    function pressStartWaveButton() {
        startWaveButton.current = "Pressed";
    }

    function getMapDisplay(): (Grass | Path | Tower | Enemy)[] {
        return mapDisplay.current;
    }

    function setSelectedTileIndex(index: number | null) {
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
