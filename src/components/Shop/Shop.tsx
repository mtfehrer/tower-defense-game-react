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
                    name="turret"
                    cost="100"
                    cssclass="turret-item"
                    placeTower={placeTower}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
                <Item
                    name="archer"
                    cost="200"
                    cssclass="archer-item"
                    placeTower={placeTower}
                    setSelectedTileIndex={setSelectedTileIndex}
                />
                <Item
                    name="wizard"
                    cost="300"
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
