//todo
//add text to tiles
//implement tower attack
//add new enemies and towers
//change map
//add more waves
//implement end state
//make ui pretty
//tiles should be a set size

import { useState } from "react";
import { Grass, Path, Tower, Enemy } from "./data/Classes";
import Map from "./components/Map/Map";
import Shop from "./components/Shop/Shop";
import useGame from "./hooks/useGame";
import useGameLoop from "./hooks/useGameLoop";

const App: React.FC = () => {
    const {
        lives,
        money,
        frameUpdate,
        eventUpdate,
        getMapDisplay,
        setSelectedTileIndex,
        placeTower,
        pressStartWaveButton,
    } = useGame();

    const [mapDisplay, setMapDisplay] = useState<
        (Grass | Path | Tower | Enemy)[]
    >([]);

    function frameUpdateWrapper() {
        frameUpdate();
        setMapDisplay(getMapDisplay());
    }

    useGameLoop(frameUpdateWrapper, eventUpdate, 60, 250);

    return (
        <div className="app">
            <header>
                <h1>Tower Defense</h1>
            </header>
            <div className="game">
                <Map
                    mapDisplay={mapDisplay}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
                <div className="side-panel">
                    <h1>Lives: {lives.current}</h1>
                    <Shop
                        money={money.current}
                        placeTower={placeTower}
                        setSelectedTileIndex={setSelectedTileIndex}
                    />
                    <button
                        className="start-button"
                        onClick={pressStartWaveButton}
                    >
                        start
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
