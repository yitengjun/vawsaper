import {
	type MutableRefObject,
	type SVGProps,
	useCallback,
	useMemo,
	useReducer,
} from "react";
import type { useSoundBufferLoader } from "@/src/hooks/useSoundBufferLoader";
import { useSoundEffect } from "@/src/hooks/useSoundEffect";
import { AUDIO_URL_LIST } from "../../constants/audioUrls";
import { Filename } from "../Filename";
import { ActionButton } from "./ActionButton";
import { PlayButton } from "./PlayButton";
import styles from "./styles.module.css";

type Props = {
	audioContext: AudioContext | null;
	getAudioBufferByUrl: ReturnType<
		typeof useSoundBufferLoader
	>["getAudioBufferByUrl"];
	audioBufferMapRef: MutableRefObject<Map<string, AudioBuffer>>;
	loadAudioBuffersFromUrls: (params: {
		audioContext: AudioContext;
		audioUrls: string[];
	}) => void;
	resetSoundBuffers: () => void;
	removeAudioBuffer: (urls: string[]) => void;
	outputNode?: AudioNode | null;
};

export const Sources = ({
	audioContext,
	getAudioBufferByUrl,
	loadAudioBuffersFromUrls,
	removeAudioBuffer,
	outputNode,
}: Props) => {
	const [, forceUpdate] = useReducer((x) => x + 1, 0);

	const { playAudioBuffer } = useSoundEffect({
		audioContext,
		outputNode,
	});

	const playSoundFromUrl = useCallback(
		(soundUrl: string) => {
			const soundBuffer = getAudioBufferByUrl(soundUrl);
			if (!soundBuffer) {
				console.warn(`Audio buffer not found for URL: ${soundUrl}`);
				return;
			}
			playAudioBuffer(soundBuffer);
		},
		[getAudioBufferByUrl, playAudioBuffer],
	);

	const playSoundsFromUrls = useCallback(
		(soundUrls: string[]) => {
			const audioBuffers = soundUrls
				.map((url) => {
					const buffer = getAudioBufferByUrl(url);
					return buffer;
				})
				.filter((buffer): buffer is AudioBuffer => buffer !== undefined);

			audioBuffers.forEach(playAudioBuffer);
		},
		[getAudioBufferByUrl, playAudioBuffer],
	);

	const loadAudioBuffer = useCallback(
		(url: string) => {
			if (!audioContext) return;
			loadAudioBuffersFromUrls({
				audioContext,
				audioUrls: [url],
			});
		},
		[audioContext, loadAudioBuffersFromUrls],
	);

	const removeAudioBufferByUrl = useCallback(
		(url: string) => {
			removeAudioBuffer([url]);
			forceUpdate();
		},
		[removeAudioBuffer],
	);

	const getBufferInfo = useCallback(
		(url: string) => {
			const buffer = getAudioBufferByUrl(url);
			if (!buffer) {
				return {
					isLoaded: false,
					duration: 0,
					sampleRate: 0,
					numberOfChannels: 0,
				};
			}
			return {
				isLoaded: true,
				duration: buffer.duration,
				sampleRate: buffer.sampleRate,
				numberOfChannels: buffer.numberOfChannels,
			};
		},
		[getAudioBufferByUrl],
	);

	const isAnyAudioLoaded = useMemo(
		() =>
			AUDIO_URL_LIST.some((audio) => {
				const bufferInfo = getBufferInfo(audio.url);
				return bufferInfo.isLoaded;
			}),
		[getBufferInfo],
	);

	return (
		<section className={styles.section}>
			<div className={styles.inner}>
				<Filename label="sources.tsx" />
				<h2 className={styles.title}>Sources</h2>

				<dl className={styles.list}>
					{AUDIO_URL_LIST.map((audio) => {
						const bufferInfo = getBufferInfo(audio.url);
						const isBufferLoaded = bufferInfo.isLoaded;
						const details = [
							{ label: "URL", value: audio.url },
							{
								label: "Duration",
								value: isBufferLoaded
									? `${bufferInfo.duration.toFixed(2)}s`
									: "-",
							},
							{
								label: "Sample Rate",
								value: isBufferLoaded ? `${bufferInfo.sampleRate}Hz` : "-",
							},
							{
								label: "Channels",
								value: isBufferLoaded ? bufferInfo.numberOfChannels : "-",
							},
							{
								label: "Status",
								value: isBufferLoaded ? "Cached" : "Pending",
							},
						];

						return (
							<div className={styles.item} key={audio.url}>
								<dt className={styles.itemHeader}>
									<h3>
										<PlayButton
											disabled={!isBufferLoaded}
											label={audio.title}
											onClick={() => playSoundFromUrl(audio.url)}
										/>
									</h3>

									<div className={styles.buttons}>
										<ActionButton
											disabled={isBufferLoaded}
											label="fetch"
											leftSection={
												<MaterialSymbolsLightDownloadRounded
													className={styles.icon}
												/>
											}
											onClick={() => loadAudioBuffer(audio.url)}
										/>
										<ActionButton
											className={styles.buttonRemove}
											disabled={!isBufferLoaded}
											label="unload"
											leftSection={
												<MaterialSymbolsLightDeleteOutline
													className={styles.icon}
												/>
											}
											onClick={() => removeAudioBufferByUrl(audio.url)}
										/>
									</div>
								</dt>
								<dd
									className={styles.itemContent}
									style={{
										opacity: isBufferLoaded ? 1 : 0,
									}}
								>
									<ul className={styles.itemDetails}>
										{details.map((item) => (
											<li key={item.label}>
												{item.label}: {item.value}
											</li>
										))}
									</ul>
								</dd>
							</div>
						);
					})}
				</dl>
				<footer className={styles.footer}>
					<PlayButton
						disabled={!isAnyAudioLoaded}
						label="play all sounds"
						onClick={() =>
							playSoundsFromUrls(AUDIO_URL_LIST.map((audio) => audio.url))
						}
					/>
				</footer>
			</div>
		</section>
	);
};

function MaterialSymbolsLightDownloadRounded(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label="fetch"
			height="1em"
			role="img"
			viewBox="0 0 24 24"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{/* Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
			<path
				d="M12 15.248q-.161 0-.298-.053t-.267-.184l-2.62-2.619q-.146-.146-.152-.344t.152-.363q.166-.166.357-.169q.192-.003.357.163L11.5 13.65V5.5q0-.213.143-.357T12 5t.357.143t.143.357v8.15l1.971-1.971q.146-.146.347-.153t.366.159q.16.165.163.354t-.162.353l-2.62 2.62q-.13.13-.267.183q-.136.053-.298.053M6.616 19q-.691 0-1.153-.462T5 17.384v-1.923q0-.213.143-.356t.357-.144t.357.144t.143.356v1.923q0 .231.192.424t.423.192h10.77q.23 0 .423-.192t.192-.424v-1.923q0-.213.143-.356t.357-.144t.357.144t.143.356v1.923q0 .691-.462 1.153T17.384 19z"
				fill="currentColor"
			/>
		</svg>
	);
}

function MaterialSymbolsLightDeleteOutline(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label="unload"
			height="1em"
			role="img"
			viewBox="0 0 24 24"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{/* Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
			<path
				d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
				fill="currentColor"
			/>
		</svg>
	);
}
