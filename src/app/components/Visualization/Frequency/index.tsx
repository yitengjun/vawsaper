import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useFrequency } from "@/src/hooks/useFrequency";
import styles from "./styles.module.css";

type Props = {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
};

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

export const Frequency = ({ audioContext, audioGainNode }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const { drawFrequencyBars } = useFrequency({
		audioContext,
		audioGainNode,
		canvasRef,
		canvasWidth: CANVAS_WIDTH,
		canvasHeight: CANVAS_HEIGHT,
	});

	useEffect(() => {
		gsap.ticker.add(drawFrequencyBars);

		return () => {
			gsap.ticker.remove(drawFrequencyBars);
		};
	}, [drawFrequencyBars]);

	return (
		<canvas
			className={styles.canvas}
			height={CANVAS_HEIGHT}
			ref={canvasRef}
			width={CANVAS_WIDTH}
		/>
	);
};
