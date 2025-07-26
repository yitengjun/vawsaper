import { type RefObject, useCallback, useEffect, useRef } from "react";

export type FrequencyBarData = {
	height: number;
	color: string;
	x: number;
	width: number;
};

export const useFrequency = ({
	audioContext,
	audioGainNode,
	canvasRef,
	canvasWidth = 800,
	canvasHeight = 200,
}: {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	canvasWidth?: number;
	canvasHeight?: number;
}) => {
	const dataArrayRef = useRef<Uint8Array | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		if (!audioContext || !audioGainNode) {
			analyserNodeRef.current = null;
			dataArrayRef.current = null;
			return;
		}

		const analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 128;
		analyserNode.smoothingTimeConstant = 0.8;

		const bufferLength = analyserNode.frequencyBinCount;
		dataArrayRef.current = new Uint8Array(bufferLength);

		audioGainNode.connect(analyserNode);
		analyserNodeRef.current = analyserNode;

		return () => {
			audioGainNode.disconnect(analyserNode);
			analyserNode.disconnect();
			analyserNodeRef.current = null;
			dataArrayRef.current = null;
		};
	}, [audioContext, audioGainNode]);

	const drawFrequencyBars = useCallback(() => {
		if (!analyserNodeRef.current || !dataArrayRef.current || !canvasRef.current)
			return;

		analyserNodeRef.current.getByteFrequencyData(dataArrayRef.current);

		if (!canvasContextRef.current) {
			canvasContextRef.current = canvasRef.current.getContext("2d");
		}

		if (!canvasContextRef.current) return;
		canvasContextRef.current.fillStyle = "rgb(0, 0, 0)";
		canvasContextRef.current.fillRect(0, 0, canvasWidth, canvasHeight);

		const bars = calculateFrequencyBars(dataArrayRef.current, canvasWidth);
		bars.forEach((bar) => {
			if (!canvasContextRef.current) return;
			canvasContextRef.current.fillStyle = bar.color;
			canvasContextRef.current.fillRect(
				bar.x,
				canvasHeight - bar.height,
				bar.width,
				bar.height,
			);
		});
	}, [canvasRef, canvasWidth, canvasHeight]);

	return {
		drawFrequencyBars,
	};
};

const calculateFrequencyBars = (
	dataArray: Uint8Array,
	canvasWidth: number,
): FrequencyBarData[] => {
	const bufferLength = dataArray.length;
	const barWidth = (canvasWidth / bufferLength) * 2.5;
	const bars: FrequencyBarData[] = [];
	let x = 0;

	for (let i = 0; i < bufferLength; i++) {
		const barHeight = dataArray[i] * 0.8;

		const color = `rgb(255,255,255)`;

		bars.push({
			height: barHeight,
			color,
			x,
			width: barWidth,
		});

		x += barWidth;
	}

	return bars;
};
