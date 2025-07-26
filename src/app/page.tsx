"use client";

import { useCallback, useEffect } from "react";
import { useAudioContext } from "../hooks/useAudioContext";
import { useGainNodeManager } from "../hooks/useGainNodeManager";
import { useSoundBufferLoader } from "../hooks/useSoundBufferLoader";
import { Filename } from "./components/Filename";
import { Sources } from "./components/Sources";
import { Title } from "./components/Title";
import { Visualization } from "./components/Visualization";
import { AUDIO_URL_LIST } from "./constants/audioUrls";
import styles from "./home.module.css";

export default function Home() {
	const { audioContext, createAudioContext, closeAudioContext } =
		useAudioContext();
	const { audioGainNode } = useGainNodeManager({ audioContext });
	const {
		getAudioBufferByUrl,
		loadAudioBuffersFromUrls,
		isLoadingSoundBuffer,
		audioBufferMapRef,
		resetSoundBuffers,
		removeAudioBuffer,
	} = useSoundBufferLoader();

	const setupAudioContext = useCallback(async () => {
		const context = createAudioContext();

		await loadAudioBuffersFromUrls({
			audioContext: context,
			audioUrls: [...AUDIO_URL_LIST.map((audio) => audio.url).slice(0, 2)],
		});
	}, [createAudioContext, loadAudioBuffersFromUrls]);

	useEffect(() => {
		setupAudioContext();
		return () => {
			closeAudioContext();
		};
	}, [setupAudioContext, closeAudioContext]);

	return (
		<main className={styles.main}>
			<Filename label="page.tsx" />
			<Title />
			{isLoadingSoundBuffer ? (
				<p>Loading audio files...</p>
			) : (
				<>
					<Sources
						audioBufferMapRef={audioBufferMapRef}
						audioContext={audioContext}
						getAudioBufferByUrl={getAudioBufferByUrl}
						loadAudioBuffersFromUrls={loadAudioBuffersFromUrls}
						outputNode={audioGainNode}
						removeAudioBuffer={removeAudioBuffer}
						resetSoundBuffers={resetSoundBuffers}
					/>
					<Visualization
						audioContext={audioContext}
						audioGainNode={audioGainNode}
					/>
				</>
			)}
		</main>
	);
}
