import Tile from "../Tile/Tile";
import { Grass, Path, Tower, Enemy } from "../../data/Classes";
import "./Map.css";

interface Props {
    mapDisplay: (Grass | Path | Tower | Enemy)[];
    setSelectedTileIndex: (i: number) => void;
}

const Map: React.FC<Props> = ({ mapDisplay, setSelectedTileIndex }: Props) => {
    return (
        <div className="map">
            {mapDisplay.map((t, i) => (
                <Tile
                    key={i}
                    tileClass={t.cssclass}
                    text={t.text}
                    onDragover={() => {
                        setSelectedTileIndex(i);
                    }}
                />
            ))}
        </div>
    );
};

export default Map;
