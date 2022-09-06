import { useState, useEffect } from "react";
import { Grass, Path, Tower, Enemy } from "./data/Classes";
import Map from "./components/Map/Map";
import Shop from "./components/Shop/Shop";
import useGame from "./hooks/useGame";
import useGameLoop from "./hooks/useGameLoop";

const App: React.FC = () => {
    const {
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

    useGameLoop(frameUpdateWrapper, eventUpdate, 60, 1000);

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
                    <Shop
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
