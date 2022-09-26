//todo
//fix tower drag bug
//add more waves
//make ui pretty
//change start button to retry button during end state
//change start button to waiting while waiting
//remove warnings
//build and deploy to github

import { useEffect, useState } from "react";
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
        setPlaceTowerCooldown,
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

    useEffect(() => {
        document.addEventListener("mouseover", (event) => {
            if (event.target instanceof HTMLDivElement) {
                //Only place tower if mouse is hovered over "grass-tile"
                if (event.target.classList[0] === "grass-tile") {
                    console.log("yay");
                    setPlaceTowerCooldown("set");
                } else {
                    setPlaceTowerCooldown("decrease");
                }
            }
        });
    }, []);

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
