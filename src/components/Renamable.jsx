import { useState } from 'react'

const Renamable = ({children, name, handler}) => {

	const [displayTextEdit, setDisplayTextEdit] = useState(false)
	const [title, setTitle] = useState(name)

	return displayTextEdit ?
		<>
		<div className = "col">
			<input className="form-control" type="text" value={title} onChange={e => {
				setTitle(e.target.value)
			}} />
		</div>
		<div className="col">
			<button className="track-button" onClick={() => {
				handler(title) 
				setDisplayTextEdit(false)}}><i className="fa-solid fa-check"></i></button>
		</div>
		</>
		:
		<>
			<span className="text-info-emphasis" onClick={() => setDisplayTextEdit(true)}><b>{title}</b></span>
			{children}
		</> 

}

export default Renamable