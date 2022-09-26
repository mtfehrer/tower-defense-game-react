import "./StartButton.css";

type Props = {
    buttonState: string;
    pressStartWaveButton: () => void;
};

const StartButton: React.FC<Props> = ({
    buttonState,
    pressStartWaveButton,
}) => {
    let buttonText = "Start";
    if (buttonState === "Retry") {
        buttonText = "Retry";
    }
    if (buttonState === "Pressed" || buttonState === "Disabled") {
        buttonText = "Waiting";
    }

    return (
        <button className="start-button" onClick={pressStartWaveButton}>
            {buttonText}
        </button>
    );
};

export default StartButton;
