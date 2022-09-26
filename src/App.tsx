import { useState } from "react";
import { Grass, Path, Tower, Enemy } from "./data/Classes";
import Map from "./components/Map/Map";
import Shop from "./components/Shop/Shop";
import StartButton from "./components/StartButton/StartButton";
import useGame from "./hooks/useGame";
import useGameLoop from "./hooks/useGameLoop";

const App: React.FC = () => {
    const {
        lives,
        money,
        endStateText,
        shopMessage,
        waveIndex,
        startWaveButton,
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
                    <h1 className="lives-text">
                        Lives: {lives.current}{" "}
                        <span className="end-state-text">
                            {endStateText.current}
                        </span>
                    </h1>
                    <h1 className="level-text">Level: {waveIndex.current}/6</h1>
                    <Shop
                        money={money.current}
                        shopMessage={shopMessage.current}
                        placeTower={placeTower}
                        setSelectedTileIndex={setSelectedTileIndex}
                    />
                    <StartButton
                        pressStartWaveButton={pressStartWaveButton}
                        buttonState={startWaveButton.current}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
