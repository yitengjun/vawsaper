"use client";

import { useCallback, useRef } from "react";

export const useAudioContext = () => {
	const audioContextRef = useRef<AudioContext | null>(null);

	const createAudioContext = useCallback((): AudioContext => {
		if (audioContextRef.current && audioContextRef.current.state !== "closed") {
			return audioContextRef.current;
		}

		const context = new AudioContext();
		audioContextRef.current = context;

		return context;
	}, []);

	const closeAudioContext = useCallback(async (): Promise<void> => {
		if (!audioContextRef.current || audioContextRef.current.state === "closed")
			return;

		await audioContextRef.current.close();
		audioContextRef.current = null;
	}, []);

	const resumeAudioContext = useCallback(async (): Promise<void> => {
		if (
			!audioContextRef.current ||
			audioContextRef.current.state !== "suspended"
		)
			return;

		await audioContextRef.current.resume();
	}, []);

	return {
		audioContext: audioContextRef.current,
		createAudioContext,
		closeAudioContext,
		resumeAudioContext,
	};
};
