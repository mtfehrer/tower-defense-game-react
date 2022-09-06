import Item from "../Item/Item";
import { TowerType } from "../../data/Types";
import "./Shop.css";

type Props = {
    money: number;
    placeTower: (towerType: TowerType) => void;
    setSelectedTileIndex: (index: number | null) => void;
};

const Shop: React.FC<Props> = ({
    money,
    placeTower,
    setSelectedTileIndex,
}: Props) => {
    return (
        <div className="shop">
            <h1>Shop</h1>
            <h2>Money: {money}</h2>
            <div className="item-display">
                <Item
                    name="turret"
                    placeTower={placeTower}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
            </div>
        </div>
    );
};

export default Shop;
