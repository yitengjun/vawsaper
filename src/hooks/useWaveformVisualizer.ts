import { useCallback, useEffect, useRef, useState } from "react";

const FFT_SIZE = 2048;
const SMOOTHING_TIME_CONSTANT = 0.3;
const MAX_WAVEFORM_DATA_LENGTH = 500;
const QUANTIZATION_LEVEL = 100;

const calculateAmplitude = (dataArray: Uint8Array): number => {
	let maxVal = 0;
	for (let i = 0; i < dataArray.length; i += 4) {
		const v = Math.abs(dataArray[i] - 128);
		if (v > maxVal) maxVal = v;
	}
	return Math.round((maxVal / 128) * QUANTIZATION_LEVEL);
};

const drawWaveform = ({
	ctx,
	waveformData,
	canvasWidth,
	canvasHeight,
	isRecording,
}: {
	ctx: CanvasRenderingContext2D;
	waveformData: number[];
	canvasWidth: number;
	canvasHeight: number;
	isRecording: boolean;
}): void => {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	if (!waveformData.length) return;

	const barWidth = canvasWidth / waveformData.length;
	const centerY = canvasHeight / 2;

	ctx.fillStyle = "#ff6600";
	waveformData.forEach((amp, i) => {
		const h = (amp / QUANTIZATION_LEVEL) * canvasHeight * 0.9;
		ctx.fillRect(i * barWidth, centerY - h / 2, barWidth, h);
	});

	if (isRecording) {
		ctx.fillStyle = "#f00";
		ctx.fillRect(canvasWidth - 15, 5, 10, 10);
	}
};

const updateWaveformData = (
	prevData: number[],
	amplitude: number,
): number[] => {
	const newData = [...prevData, amplitude];
	return newData.length > MAX_WAVEFORM_DATA_LENGTH
		? newData.slice(-MAX_WAVEFORM_DATA_LENGTH)
		: newData;
};

export const useWaveformVisualizer = ({
	audioContext,
	audioGainNode,
	canvasRef,
	canvasWidth = 800,
	canvasHeight = 200,
}: {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	canvasWidth?: number;
	canvasHeight?: number;
}) => {
	const [waveformData, setWaveformData] = useState<number[]>([]);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const dataArrayRef = useRef<Uint8Array | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);

	const isRecordingRef = useRef(isRecording);
	const waveformDataRef = useRef(waveformData);

	const startRecording = useCallback(() => setIsRecording(true), []);
	const stopRecording = useCallback(() => setIsRecording(false), []);
	const resetWaveform = useCallback(() => {
		setWaveformData([]);
		setIsRecording(false);
	}, []);

	const stableRenderWaveform = useCallback(() => {
		if (
			!analyserNodeRef.current ||
			!dataArrayRef.current ||
			!canvasRef.current ||
			!isRecordingRef.current
		) {
			return;
		}

		analyserNodeRef.current.getByteTimeDomainData(dataArrayRef.current);

		const amplitude = calculateAmplitude(dataArrayRef.current);
		setWaveformData((prev) => updateWaveformData(prev, amplitude));

		const canvas = canvasRef.current;
		const canvasContext = canvas.getContext("2d");
		if (!canvasContext) return;

		drawWaveform({
			ctx: canvasContext,
			waveformData: [...waveformDataRef.current, amplitude],
			canvasWidth,
			canvasHeight,
			isRecording: isRecordingRef.current,
		});
	}, [canvasRef, canvasWidth, canvasHeight]);

	useEffect(() => {
		if (!audioContext || !audioGainNode) {
			analyserNodeRef.current = null;
			dataArrayRef.current = null;
			return;
		}

		const analyser = audioContext.createAnalyser();
		analyser.fftSize = FFT_SIZE;
		analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;

		dataArrayRef.current = new Uint8Array(analyser.fftSize);
		audioGainNode.connect(analyser);
		analyserNodeRef.current = analyser;

		return () => {
			analyser.disconnect();
			analyserNodeRef.current = null;
			dataArrayRef.current = null;
		};
	}, [audioContext, audioGainNode]);

	useEffect(() => {
		isRecordingRef.current = isRecording;
		waveformDataRef.current = waveformData;
	}, [isRecording, waveformData]);

	return {
		renderWaveform: stableRenderWaveform,
		startRecording,
		stopRecording,
		resetWaveform,
		isRecording,
	};
};
