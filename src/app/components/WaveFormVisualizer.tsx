import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useWaveformVisualizer } from "../../hooks/useWaveformVisualizer";

type Props = {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
};

export const WaveFormVisualizer = ({ audioContext, audioGainNode }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const {
		renderWaveform,
		startRecording,
		stopRecording,
		resetWaveform,
		isRecording,
	} = useWaveformVisualizer({
		audioContext,
		audioGainNode,
		canvasRef,
		canvasWidth: 800,
		canvasHeight: 200,
	});

	useEffect(() => {
		gsap.ticker.add(renderWaveform);

		return () => {
			gsap.ticker.remove(renderWaveform);
		};
	}, [renderWaveform]);

	return (
		<section>
			<p>
				<button
					onClick={isRecording ? stopRecording : startRecording}
					type="button"
				>
					{isRecording ? "is recording" : "record"}
				</button>
				<button onClick={resetWaveform} type="button">
					clear
				</button>
			</p>
			<canvas height={200} ref={canvasRef} width={800} />
		</section>
	);
};
