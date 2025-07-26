import { useCallback, useRef } from "react";

type SoundEffectOptions = {
	audioContext: AudioContext | null;
	outputNode?: AudioNode | null;
};

export const useSoundEffect = ({
	audioContext,
	outputNode,
}: SoundEffectOptions) => {
	const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

	const playAudioBuffer = useCallback(
		async (audioBuffer: AudioBuffer): Promise<void> => {
			if (!audioContext) return;

			if (audioContext.state === "suspended") {
				await audioContext.resume();
			}

			if (audioContext.state === "closed") return;

			const source = audioContext.createBufferSource();
			source.buffer = audioBuffer;

			const destination = outputNode || audioContext.destination;
			source.connect(destination);

			activeSourcesRef.current.add(source);

			const cleanup = () => {
				source.disconnect();
				activeSourcesRef.current.delete(source);
			};

			source.addEventListener("ended", cleanup, { once: true });

			try {
				source.start(0);
			} catch (error) {
				console.warn("Failed to start audio source:", error);
				cleanup();
			}
		},
		[audioContext, outputNode],
	);

	const stopAllSounds = useCallback(() => {
		activeSourcesRef.current.forEach((source) => {
			source.onended = null;
			source.stop();
			source.disconnect();
		});
		activeSourcesRef.current.clear();
	}, []);

	return {
		playAudioBuffer,
		stopAllSounds,
	};
};
