import { infoCardData, selectCardData } from "./Constants/constant";
import InfoCard from "../../Components/InfoCard/InfoCard";
import AboutSelectCard from "./Components/AboutSelectCard/AboutSelectCard";

import "./About.scss";


/*
    @breif: The main component of the about page contains info about the application, a list of features, and answers to questions
    @return: InfoCard And SelectCard custom components 
*/
function About() {
    return (
        <div className={"Wrapper"}>
            <div className={"AboutContainer"}>
                {infoCardData.map((infoData, infoIndex) => (
                    <InfoCard
                        key={infoIndex}
                        title={infoData.title}
                        titleImage={infoData.titleImage}
                        desc={infoData.desc}
                        onTitleClick={null}
                        additionalClassName={null}
                    />
                ))}
                {selectCardData.map((selectData, selectIndex) => (
                    <AboutSelectCard
                        key={selectIndex}
                        title={selectData.title}
                        titleImage={selectData.titleImage}
                        options={selectData.options}
                        optionsPlaceholder={selectData.optionsPlaceholder}
                        optionsImagesURL={selectData.optionsImagesURL}
                    />
                ))}
            </div>
        </div>
    );
}

export default About;
