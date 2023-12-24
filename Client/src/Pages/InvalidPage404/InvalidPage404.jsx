import SadFace from "/images/SadFaceIcon.svg";

import "./InvalidPage404.scss";

function InvalidPage404(){
    return (
    <div className={"Wrapper"}>
        <div className={"Invalid404Container"}>
            <h1 className={"error404"}>4 0 4</h1>
            <img className={"error404SadIcon"} src={SadFace}/>
            <h2 className={"errorTitle"}>Page Not Found.</h2>
            <p className={"errorDescription"}>The page you are looking for doesn't exist</p>
        </div>
    </div>)
}

export default InvalidPage404