import { Grass, Path, Tower, Enemy } from "./data/Classes";
import { TowerType, EnemyType } from "./data/Types";
import { useRef } from "react";
import parsedMap from "./data/mapParser";
import wavesData from "./data/wavesData.json";

const useGame = () => {
    const mapData = useRef<(Grass | Path)[]>(parsedMap);
    const mapDisplay = useRef<(Grass | Path | Tower | Enemy)[]>([]);
    const gameState = useRef<"Build" | "Defend" | "End">("Build");
    const startWaveButton = useRef<"Waiting" | "Pressed" | "Disabled">(
        "Waiting"
    );
    const selectedTileIndex = useRef<number | null>(null);
    const waveIndex = useRef<number>(0);
    const enemies = useRef<Enemy[]>([]);
    const towers = useRef<Tower[]>([]);

    function update(): void {
        if (gameState.current === "Build") {
            if (startWaveButton.current === "Pressed") {
                startWaveButton.current = "Disabled";
                startWave();
                //startWaveButton.value = "Waiting"
            }
        } else if (gameState.current === "Defend") {
            for (let enemy of enemies.current) {
                enemy.pathNumber += 1;
                enemy.index = getIndexFromPathNumber(
                    enemy.pathNumber
                ) as number;
            }
        } else if (gameState.current === "End") {
        }
        draw();
    }

    function draw(): void {
        mapDisplay.current = mapData.current;
        for (const enemy of enemies.current) {
            mapDisplay.current[enemy.index] = enemy;
        }
        for (const tower of towers.current) {
            mapDisplay.current[tower.index] = tower;
        }
    }

    function getMapDisplay(): (Grass | Path | Tower | Enemy)[] {
        return mapDisplay.current;
    }

    function setSelectedTileIndex(index: number | null): void {
        selectedTileIndex.current = index;
    }

    function placeTower(towerType: TowerType) {
        if (gameState.current !== "End") {
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

    function pressStartWaveButton(): void {
        startWaveButton.current = "Pressed";
    }

    function getIndexFromPathNumber(input: number): number | null {
        for (let t of mapData.current) {
            if (t instanceof Path && t.pathNumber === input) {
                return t.index;
            }
        }
        return null;
    }

    function startWave(): void {
        if (gameState.current === "Build") {
            gameState.current = "Defend";
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
    }

    return {
        update,
        getMapDisplay,
        setSelectedTileIndex,
        placeTower,
        pressStartWaveButton,
    };
};

export default useGame;
