import { useState, useEffect } from "react";
import { Grass, Path, Tower, Enemy } from "./data/Classes";
import Map from "./components/Map/Map";
import Shop from "./components/Shop/Shop";
import useGame from "./useGame";

const App: React.FC = () => {
    const {
        update,
        getMapDisplay,
        setSelectedTileIndex,
        placeTower,
        pressStartWaveButton,
    } = useGame();

    const [mapDisplay, setMapDisplay] = useState<
        (Grass | Path | Tower | Enemy)[]
    >([]);

    useEffect(() => {
        setInterval(() => {
            setMapDisplay(getMapDisplay());
        }, 500);
    }, []);

    return (
        <>
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
                        v-on:click="pressStartWaveButton"
                    >
                        start
                    </button>
                </div>
            </div>
        </>
    );
};

export default App;
