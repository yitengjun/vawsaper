import { useCallback, useRef, useState } from "react";

export type SoundBufferLoaderReturn = {
	audioContext: AudioContext;
	audioUrls: string[];
};

export const useSoundBufferLoader = () => {
	const audioBufferMapRef = useRef(new Map<string, AudioBuffer>());
	const [isLoadingSoundBuffer, setIsSoundBufferLoading] = useState(false);

	const loadAudioBuffersFromUrls = useCallback(
		async ({
			audioContext,
			audioUrls,
		}: SoundBufferLoaderReturn): Promise<void> => {
			if (audioUrls.length === 0) return;

			const newUrlsToLoad = audioUrls.filter(
				(url) => !audioBufferMapRef.current.has(url),
			);

			if (newUrlsToLoad.length === 0) return;

			setIsSoundBufferLoading(true);

			try {
				const loadPromises = newUrlsToLoad.map(
					async (url): Promise<{ url: string; buffer: AudioBuffer } | null> => {
						try {
							const response = await fetch(url);
							if (!response.ok) {
								throw new Error(
									`HTTP ${response.status}: ${response.statusText}`,
								);
							}

							const soundArrayBuffer = await response.arrayBuffer();
							const decodedAudioBuffer =
								await audioContext.decodeAudioData(soundArrayBuffer);

							return { url, buffer: decodedAudioBuffer };
						} catch (error) {
							console.warn(`Failed to load audio buffer from ${url}:`, error);
							return null;
						}
					},
				);

				const results = await Promise.all(loadPromises);

				for (const result of results) {
					if (result === null) continue;
					audioBufferMapRef.current.set(result.url, result.buffer);
				}
			} finally {
				setIsSoundBufferLoading(false);
			}
		},
		[],
	);

	const getAudioBufferByUrl = useCallback(
		(url: string): AudioBuffer | undefined =>
			audioBufferMapRef.current.get(url),
		[],
	);

	const resetSoundBuffers = useCallback((): void => {
		audioBufferMapRef.current.clear();
	}, []);

	const removeAudioBuffer = useCallback((urls: string[]): boolean[] => {
		return urls.map((url) => audioBufferMapRef.current.delete(url));
	}, []);

	return {
		audioBufferMapRef,
		isLoadingSoundBuffer,
		loadAudioBuffersFromUrls,
		getAudioBufferByUrl,
		resetSoundBuffers,
		removeAudioBuffer,
	};
};
