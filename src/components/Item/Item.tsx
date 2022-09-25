import { useEffect, useRef } from "react";
import { TowerType } from "../../data/Types";
import "./Item.css";

type Props = {
    name: string;
    cost: string;
    cssclass: string;
    placeTower: (towerType: TowerType) => void;
    setSelectedTileIndex: (index: number | null) => void;
};

const Item: React.FC<Props> = ({
    name,
    cost,
    cssclass,
    placeTower,
    setSelectedTileIndex,
}: Props) => {
    const itemDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        itemDiv.current?.addEventListener("dragstart", () => {
            setSelectedTileIndex(null);
        });

        itemDiv.current?.addEventListener("dragend", () => {
            placeTower(name as TowerType);
        });
    }, []);

    return (
        <div ref={itemDiv} className={"item " + cssclass} draggable="true">
            {name}: ${cost}
        </div>
    );
};

export default Item;
