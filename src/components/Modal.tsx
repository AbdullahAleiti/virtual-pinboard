import React, { CSSProperties } from 'react'
import ReactDOM from 'react-dom'

const modalStyle : CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "25%",
    transform: "translate(-50%, -50%)"
}

const buttonStyle : CSSProperties = {
    padding: "1em",
    fontSize: "1em"
}

export interface Props {
    children : any
    open : boolean
    close: any
}

const Modal = ({children,open,close}:Props) => {
    if(!open) return null

    return ReactDOM.createPortal(
        <div style={modalStyle}>
            {children}
            <button onClick={close} style={buttonStyle}>close</button>
        </div>
    ,document.getElementById("portal")!)
}

export default Modal
