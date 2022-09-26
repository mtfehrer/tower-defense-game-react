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
    const placeTowerTest = useRef<boolean>(true);
    const shopMessage = useRef<string>("");
    const shopMessageCounter = useRef<number>(0);
    const markedForDeathIndexes = useRef<number[]>([]);
    const selectedTileIndex = useRef<number | null>(null);
    const pathEndNumber = useRef<number | null>(null);
    const waveIndex = useRef<number>(0);
    const enemies = useRef<Enemy[]>([]);
    const towers = useRef<Tower[]>([]);
    const lives = useRef<number>(5);
    const money = useRef<number>(100);

    const { getPathEndNumber, getTilesAround, getIndexFromPathNumber } =
        useCore();

    const towerCost = { turret: 100, archer: 200, wizard: 300 };

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
            alert("Game End");
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

        if (shopMessage.current !== "") {
            if (shopMessageCounter.current === 7) {
                shopMessage.current = "";
                shopMessageCounter.current = 0;
            } else {
                shopMessageCounter.current += 1;
            }
        }

        placeTowerTest.current = true;
    }

    function updateTowers() {
        for (let tower of towers.current) {
            tower.updateText("idle");

            let tilesAround = getTilesAround(
                tower.index,
                tower.range,
                mapDisplay.current
            );

            for (let tile of tilesAround) {
                if (tile instanceof Enemy) {
                    tile.health -= tower.damage;

                    tower.updateText("attack");
                }
            }
        }
    }

    function updateEnemies() {
        for (let enemy of enemies.current) {
            //Update enemy position
            enemy.pathNumber += enemy.speed;
            enemy.index = getIndexFromPathNumber(
                Math.floor(enemy.pathNumber),
                mapData.current
            ) as number;

            if (enemy.health <= 0) {
                markedForDeathIndexes.current.push(enemy.index);
                money.current += 20;
            }

            //Checks if enemy is at end of map
            if (enemy.pathNumber === pathEndNumber.current) {
                enemies.current = enemies.current.filter(
                    (e) => e.pathNumber !== pathEndNumber.current
                );
                lives.current -= 1;
                continue;
            }

            enemy.updateText();
        }

        for (let index of markedForDeathIndexes.current) {
            enemies.current = enemies.current.filter((e) => {
                if (e.index === index) {
                    return false;
                }
                return true;
            });
        }
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
        //PlaceTowerTest used to prevent method from being called twice
        if (placeTowerTest.current === true) {
            placeTowerTest.current = false;
            if (gameState.current !== "End Game") {
                if (
                    mapData.current[
                        selectedTileIndex.current as number
                    ] instanceof Grass
                ) {
                    //If statement checks if tower is already there
                    let t =
                        mapDisplay.current[selectedTileIndex.current as number]
                            .type;
                    if (t !== "turret" && t !== "archer" && t !== "wizard") {
                        if (
                            money.current >=
                            towerCost[towerType as keyof typeof towerCost]
                        ) {
                            money.current -=
                                towerCost[towerType as keyof typeof towerCost];
                            towers.current.push(
                                new Tower(
                                    towerType,
                                    selectedTileIndex.current as number
                                )
                            );
                        } else {
                            shopMessage.current =
                                "You don't have enough money to buy that";
                        }
                    }
                }
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
        shopMessage,
        frameUpdate,
        eventUpdate,
        getMapDisplay,
        setSelectedTileIndex,
        placeTower,
        pressStartWaveButton,
    };
};

export default useGame;
