import { gsap } from "gsap";
import { Fragment_Mono } from "next/font/google";
import { type CSSProperties, useEffect } from "react";
import { useAudioMasterGain } from "@/src/hooks/useAudioMasterGain";
import styles from "./styles.module.css";

type Props = {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
};

const monoFont = Fragment_Mono({
	weight: ["400"],
	subsets: ["latin"],
});

export const Volume = ({ audioContext, audioGainNode }: Props) => {
	const { masterVolume, updateVolume } = useAudioMasterGain({
		audioContext: audioContext,
		audioGainNode,
	});

	useEffect(() => {
		gsap.ticker.add(updateVolume);

		return () => {
			gsap.ticker.remove(updateVolume);
		};
	}, [updateVolume]);

	return (
		<div>
			<div className={styles.volume}>
				<span className={`${monoFont.className} ${styles.volumeValue}`}>
					{(masterVolume * 100).toFixed(0)}
				</span>
				<span>%</span>
			</div>
			<div className={styles.progress}>
				<p className={styles.label}>Volume</p>
				<div className={styles.progressBackground}>
					<div
						className={styles.progressBar}
						style={{ "--progress": masterVolume * 2 } as CSSProperties}
					></div>
				</div>
			</div>
		</div>
	);
};
