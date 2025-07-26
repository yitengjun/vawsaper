"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
	audioContext: AudioContext | null;
};

export const useGainNodeManager = ({ audioContext }: Props) => {
	const [audioGainNode, setAudioGainNode] = useState<GainNode | null>(null);

	useEffect(() => {
		if (!audioContext) {
			setAudioGainNode(null);
			return;
		}

		const gainNode = audioContext.createGain();
		gainNode.gain.value = 1;
		gainNode.connect(audioContext.destination);

		setAudioGainNode(gainNode);

		return () => {
			gainNode.disconnect();
			setAudioGainNode(null);
		};
	}, [audioContext]);

	const updateMasterVolume = useCallback(
		(value: number) => {
			if (!audioGainNode) return;

			const clampedValue = Math.max(0, Math.min(1, value));
			audioGainNode.gain.value = clampedValue;
		},
		[audioGainNode],
	);

	return {
		audioGainNode,
		updateMasterVolume,
	};
};
