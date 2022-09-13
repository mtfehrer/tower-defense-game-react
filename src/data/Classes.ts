import type { TowerType, EnemyType } from "./Types";

const towerData = { turret: { range: 1, damage: 2 } };
const enemyData = { bandit: { health: 5, speed: 1 } };

class Tile {
    cssclass: string;
    type: string;
    index: number;
    text: string;

    constructor(cssclass: string, type: string, index: number) {
        this.cssclass = cssclass;
        this.type = type;
        this.index = index;
        this.text = "";
        if (type !== "grass" && type !== "path") {
            this.text = type;
        }
    }
}

class Grass extends Tile {
    constructor(index: number) {
        super("grass-tile", "grass", index);
    }
}

class Path extends Tile {
    pathNumber: number;

    constructor(pathNumber: number, index: number) {
        super("path-tile", "path", index);
        this.pathNumber = pathNumber;
    }
}

class Tower extends Tile {
    range: number;
    damage: number;

    constructor(towerType: TowerType, index: number) {
        super("tower-tile", "tower", index);
        this.range = towerData[towerType as keyof typeof towerData].range;
        this.damage = towerData[towerType as keyof typeof towerData].damage;
    }
}

class Enemy extends Tile {
    enemyType: string;
    pathNumber: number;
    health: number;
    speed: number;

    constructor(enemyType: EnemyType, pathNumber: number, index: number) {
        super("enemy-tile", "enemy", index);
        this.enemyType = enemyType;
        this.pathNumber = pathNumber;
        this.health = enemyData[enemyType as keyof typeof enemyData].health;
        this.speed = enemyData[enemyType as keyof typeof enemyData].speed;
    }

    updateText() {
        this.text = this.type + " - " + this.health;
    }
}

export { Grass, Path, Tower, Enemy };
