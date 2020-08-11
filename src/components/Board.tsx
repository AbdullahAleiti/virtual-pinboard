import React,{ useState , useRef, useEffect , WheelEvent} from 'react'
import styles from './Board.module.css'
import {useHotkeys} from 'react-hotkeys-hook'
import Note,{NoteProps} from './Note'
import Modal from './Modal'
import useSound from 'use-sound'

const noteColors = {
    yellow : "#F7DC6F",
    green  : "#82E0AA",
    red    : "#F1948A",
    blue   : "#7FB3D5"
}

const Board = () => {
    const [notes,setNotes] = useState<ReadonlyArray<NoteProps>>([])
    const [selectedNote,setSelectedNote] = useState<NoteProps | null>()
    const [id,setId] = useState(1)
    const [noteUnderMouse,setNoteUnderMouse] = useState<number |undefined>(undefined)
    const [mouseCOR,setMouseCOR] = useState({x:0,y:0})
    const [wheel,setWheel] = useState(0)
    const [modalIsOpen,setIsOpen] = useState(false)
    const [clickedNote,setClickedNote] = useState<number>()
    const textArea = useRef<any>()
    const [play] = useSound(require('../sounds/dart-sound.mp3'),{volume:0.75})
    
    const mouseHandler = (e : MouseEvent) => 
        { setMouseCOR({x:e.clientX,y:e.clientY}) }

    const wheelHandler = (e : WheelEvent) => 
    {
        if (e.deltaY > 0)
            setWheel(wheel+10)
        else if (e.deltaY <0)
            setWheel(wheel-10)
    }

    const cssNotePosition = {left:mouseCOR.x,top:mouseCOR.y,rotation:wheel}

    const selectNote = (color : string) => setSelectedNote({color,...cssNotePosition})

    const addNote2Board = (e : any,notesProp ?: any,note ?: NoteProps)=>{
        if(note) 
        {
            setNotes([...notesProp,  note])
            return
        }

        if(selectedNote) 
        {
            setNotes([...notes,  {...selectedNote,...cssNotePosition,id}])
            play()
            openEditor(id)
            setSelectedNote(null)
            setId(id+1)
            setWheel(0)
        }
    }

    const deleteNote = (id ?: number)=>{
        const newNotes = notes.filter((Note)=>{
            if(id)
                return Note.id !== id
            return Note.id !== noteUnderMouse
        })
        if(id) return newNotes
        setNotes(newNotes)
    }

    const openEditor = (id : number) => {
        setIsOpen(true)
        setClickedNote(id)
    }

    const closeEditor= () => {
        setIsOpen(false)
        const oldNote = notes.find((note)=> {return note.id === clickedNote})
        const newNotes = deleteNote(clickedNote)
        const inputText = textArea?.current?.value
        addNote2Board(null,newNotes,{...oldNote!,text:inputText})
    }

    useEffect(()=>{ window.addEventListener("mousemove",mouseHandler) },[])

    useEffect(()=>{
        const note = notes.find((note)=>{return note.id === clickedNote})
        textArea.current && (textArea.current.value = note?.text ||"")
    },[clickedNote,notes,modalIsOpen])
    
    useHotkeys("y",()=>{ selectNote(noteColors.yellow) },[id,mouseCOR])

    useHotkeys("g",()=>{ selectNote(noteColors.green) },[id,mouseCOR])

    useHotkeys("r",()=>{ selectNote(noteColors.red) },[id,mouseCOR])

    useHotkeys("b",()=>{ selectNote(noteColors.blue) },[id,mouseCOR])

    useHotkeys("esc",()=>{ setSelectedNote(null) })

    useHotkeys("d,delete",()=>{ deleteNote() },[noteUnderMouse])

    return (
        <div className={styles.board} onClick={addNote2Board} onWheel={wheelHandler}>
            {notes.map((note,i)=>{
                return(
                    <Note {...note} key={i} onMouseHover={setNoteUnderMouse} onClick={openEditor}/>
                )
            })}
            {selectedNote && <Note {...selectedNote} {...cssNotePosition} opacity={0.25} />}
            <Modal open={modalIsOpen} close={closeEditor}>
                <textarea ref={textArea} className={styles.text_editor} style={{zIndex:1000}}></textarea>
            </Modal>
        </div>
    )
}

export default Board
