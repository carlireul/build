import { useState, useRef } from 'react'

const Renamable = ({children, name, handler, number, range, step}) => {

	const [displayTextEdit, setDisplayTextEdit] = useState(false)
	const [text, setText] = useState(name)
	const ref = useRef()

	return <>
		{ displayTextEdit ?
		<>
		<div className="col-sm">
			{ number ?
						<input ref={ref} className="form-control form-control-sm w-auto me-0" type="number" min={range[0]} max={range[1]} step={step} defaultValue={name} onChange={e => { 
					setText(e.target.value)
}} />
			:
						<input ref={ref} className="form-control form-control-sm" type="text" value={text} onChange={e => { setText(e.target.value) }} />
			}
		</div>
		<div className="col-sm">
			<button className="track-button" onClick={(e) => {
				if (ref.current.validity.valid) {
					handler(text)
					setDisplayTextEdit(false)
				}
			}}>
			<i className="fa-solid fa-check"></i>
			</button>
		</div>

		</>
		
		:

		<div className="col-auto">
			<a
				data-tooltip-id="tooltip"
				data-tooltip-content={number ? `Click to change (${range[0]}-${range[1]})` : 'Click to rename'}
			><span className="text-info-emphasis" onClick={() => {
			setText(name)
			setDisplayTextEdit(true)}}><b>{name}</b></span></a>
			{children}
		</div>
		}
		</>

}

export default Renamable