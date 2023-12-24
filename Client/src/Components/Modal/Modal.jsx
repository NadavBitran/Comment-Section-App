import { createPortal } from 'react-dom';
import "./Modal.scss";

import { ACTIONS , TYPE_MODAL } from './Constants/constants';

function Modal({title , description , setClickAction , modalType , loading}) {
    const warningModal = 
    <div className={"OuterModal"}>
        <div className={"Modal"}>
            <h2 className={"Modal__Title"}>{title}</h2>
            <div className={"Modal__Desc"}>{description.map((line) => (
                <p key={line}>
                    {line}
                    <br></br>
                </p>
            ))}</div>
            <div className={"Modal__Options"}>
                <button className={"Modal__Options--no"} onClick={() => setClickAction(ACTIONS.NO)}>No, Cancel</button>
                <button className={"Modal__Options--yes"} onClick={() => setClickAction(ACTIONS.YES)}>{!loading ? 'Yes , Delete' : <svg role={"img"} className={"Spinner"} width="25" height="25" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                        stroke="white"
                        />
                    </svg>}</button>
            </div>
        </div>
    </div>

    const acknowledgeModal = 
    <div className={"OuterModal"}>
        <div className={"Modal"}>
            <h2 className={"Modal__Title"}>{title}</h2>
            <p className={"Modal__Desc"}>{description.map((line) => (
                <div key={line}>
                    {line}
                    <br /> <br />
                </div>
            ))}</p>
            <div className={"Modal__Options"}>
                <button className={"Modal__Options--yes"} onClick={() => setClickAction(ACTIONS.YES)}>Continue</button>
            </div>
        </div>
    </div>

    const modalDict = {
        [TYPE_MODAL.ACKNOWLEDGE] : acknowledgeModal ,
        [TYPE_MODAL.WARNING] : warningModal
    }

    return createPortal(modalDict[modalType] , document.body)
}


export default Modal;