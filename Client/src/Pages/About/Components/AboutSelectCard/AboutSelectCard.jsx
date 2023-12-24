import { useState } from 'react';
import "./AboutSelectCard.scss";

function AboutSelectCard({ title, titleImage , options , optionsPlaceholder , optionsImagesURL }) {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState('-1');


    return (
        <div className={"AboutItem"}>
            <h2 className={"AboutItem__title"}>{title}</h2>
            <img className={"AboutItem__icon"} src={titleImage}/>
            <select
                className={"AboutItem__options"}
                onChange={(e) => setSelectedOptionIndex(e.target.value)}
            >
                <option key={-1} value={-1}>{optionsPlaceholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={index}>
                        {option.title}
                    </option>
                ))}
            </select>
            {selectedOptionIndex!== '-1' && (
                <>
                    <h3 className={"AboutItem__answerTitle"}>{options[selectedOptionIndex].title}</h3>
                    <ul className={"AboutItem__answerList"}>
                        {options[selectedOptionIndex].answers.map((answer, index) => (
                            <li className={"AboutItem__answer"} key={index}>
                                {optionsImagesURL && optionsImagesURL[selectedOptionIndex][index] && <img className={"AboutItem__badge"} src={optionsImagesURL[selectedOptionIndex][index]} />}
                                {answer}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default AboutSelectCard;
