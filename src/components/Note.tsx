import React,{useState} from 'react'
import Styles from './Note.module.css'

const noteWidth = 180;

export interface NoteProps {
    id  ?: number,
    color: string,
    top: number,
    left: number,
    text ?: string,
    opacity ?: number,
    rotation?: number,
    zIndex ?: number,
    onMouseHover?: Function,
    onClick ?: any
}

const Note: React.FC<NoteProps> = ({color,text,top,left,opacity,rotation,onMouseHover,id,onClick}) => {
    let calculatedLeft : number = left - noteWidth/2;
    let calculatedTop  : number = top  - 20;
    return(
        <React.Fragment>
            <div className={Styles.note} onClick={()=>onClick?.(id)}
                style={{backgroundColor:color,top:calculatedTop,
                left:calculatedLeft,opacity,transform:`rotate(${rotation}deg)`}}
                onMouseOver={(e)=>onMouseHover?.(id)} onMouseLeave={(e)=>onMouseHover?.(undefined)}>
                <div className={Styles.header}><div className={id ? Styles.pin : ""}></div></div>
                {text}
            </div>
        </React.Fragment>
    )
}

export default Note