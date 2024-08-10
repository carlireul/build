
import { useEffect, useRef } from 'react';
import * as Tone from "tone";

const Visualizer = ({meter}) => {

	const canvasRef = useRef(null)

	useEffect(() => {

		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		let frameCount = 0
		let animationFrameId

		const position = {
			x: 0,
			y: context.canvas.height
		}

		const draw = (ctx, frameCount) => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
			const db = meter.current.getValue() * 300

			if (db > 0.09) {
				ctx.fillStyle = '#fcb874'
				ctx.fillRect(0, ctx.canvas.height - db, 100, db)
			}
		}
		
		const render = () => {
			frameCount++
			draw(context, frameCount)
			animationFrameId = window.requestAnimationFrame(render)
		}
		render()

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	}, [])

	return <canvas height={100} width={100} ref={canvasRef} />


}

export default Visualizer