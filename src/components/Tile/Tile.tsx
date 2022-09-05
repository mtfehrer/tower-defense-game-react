import { useEffect, useRef } from "react";

interface Props {
    tileClass: string;
    text: string;
    onDragover: () => void;
}

const Tile: React.FC<Props> = ({ tileClass, text, onDragover }: Props) => {
    const tileDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        tileDiv.current?.addEventListener("dragover", () => {
            onDragover();
        });
    }, []);

    return (
        <div className={tileClass} ref={tileDiv}>
            {text}
        </div>
    );
};

export default Tile;
