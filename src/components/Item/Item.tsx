import { useEffect, useRef } from "react";
import { TowerType } from "../../data/Types";

type Props = {
    name: string;
    placeTower: (towerType: TowerType) => void;
    setSelectedTileIndex: (index: number | null) => void;
};

const Item: React.FC<Props> = ({
    name,
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
        <div ref={itemDiv} className="item" draggable="true">
            {name}
        </div>
    );
};

export default Item;
