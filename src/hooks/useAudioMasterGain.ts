import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
};

const calculateRMS = (dataArray: Uint8Array): number => {
	const sumOfSquares = dataArray.reduce((sum, sample) => {
		const normalized = (sample - 128) / 128;
		return sum + normalized * normalized;
	}, 0);

	return Math.sqrt(sumOfSquares / dataArray.length);
};

export const useAudioMasterGain = ({ audioContext, audioGainNode }: Props) => {
	const [masterVolume, setMasterVolume] = useState(0);
	//const [isReady, setIsReady] = useState(false);
	const dataArrayRef = useRef<Uint8Array | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);

	useEffect(() => {
		if (!audioContext || !audioGainNode) {
			analyserNodeRef.current = null;
			dataArrayRef.current = null;
			//setIsReady(false);
			return;
		}

		const analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 256;
		audioGainNode.connect(analyserNode);

		dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);
		analyserNodeRef.current = analyserNode;
		//setIsReady(true);

		return () => {
			analyserNode.disconnect();
			analyserNodeRef.current = null;
			dataArrayRef.current = null;
			//setIsReady(false);
		};
	}, [audioContext, audioGainNode]);

	const updateVolume = useCallback(() => {
		if (!analyserNodeRef.current || !dataArrayRef.current) return;

		analyserNodeRef.current.getByteTimeDomainData(dataArrayRef.current);
		const rms = calculateRMS(dataArrayRef.current);
		setMasterVolume(rms);
	}, []);

	return {
		masterVolume,
		updateVolume,
		//isReady,
	};
};
