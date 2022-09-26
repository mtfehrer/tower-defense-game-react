import { useEffect, useRef } from "react";
import { TowerType } from "../../data/Types";
import "./Item.css";

type Props = {
    data: { name: string; cost: number; range: number; damage: number };
    cssclass: string;
    placeTower: (towerType: TowerType) => void;
    setSelectedTileIndex: (index: number | null) => void;
};

const Item: React.FC<Props> = ({
    data,
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
            placeTower(data.name as TowerType);
        });
    }, []);

    return (
        <div ref={itemDiv} className={"item " + cssclass} draggable="true">
            -{data.name}- range: {data.range} damage: {data.damage} cost: $
            {data.cost}
        </div>
    );
};

export default Item;
