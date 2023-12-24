import "./InfoCard.scss"

function InfoCard({title , titleImage , desc , onTitleClick , additionalClassName}){
    return(
        <div className={!additionalClassName ? "InfoItem" : `InfoItem ${additionalClassName}`}>
            <h2 className={onTitleClick ? "InfoItem__title--clickable" : "InfoItem__title"} onClick={onTitleClick}>{title}</h2>
            <img className={"InfoItem__icon"} src={titleImage}/>
            <p className={"InfoItem__desc"}>{desc.map((line) => (
                <>
                    {line}
                    <br></br>
                </>
            ))}</p>
        </div>
    )
}

export default InfoCard