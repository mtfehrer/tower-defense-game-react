import Item from "../Item/Item";
import { TowerType } from "../../data/Types";
import "./Shop.css";

type Props = {
    money: number;
    shopMessage: string;
    placeTower: (towerType: TowerType) => void;
    setSelectedTileIndex: (index: number | null) => void;
};

const Shop: React.FC<Props> = ({
    money,
    shopMessage,
    placeTower,
    setSelectedTileIndex,
}: Props) => {
    return (
        <div className="shop">
            <div className="shop-header">
                <h1>Shop</h1>
                <h2>Money: {money}</h2>
            </div>
            <div className="item-display">
                <Item
                    data={{ name: "turret", cost: 100, range: 1, damage: 1 }}
                    cssclass="turret-item"
                    placeTower={placeTower}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
                <Item
                    data={{ name: "archer", cost: 200, range: 2, damage: 1 }}
                    cssclass="archer-item"
                    placeTower={placeTower}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
                <Item
                    data={{ name: "wizard", cost: 300, range: 1, damage: 2 }}
                    cssclass="wizard-item"
                    placeTower={placeTower}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
            </div>
            <h1 className="shop-message">{shopMessage}</h1>
        </div>
    );
};

export default Shop;
