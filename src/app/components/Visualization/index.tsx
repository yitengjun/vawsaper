import { Filename } from "../Filename";
import { Frequency } from "./Frequency";
import styles from "./styles.module.css";
import { Volume } from "./Volume";

type Props = {
	audioContext: AudioContext | null;
	audioGainNode: GainNode | null;
};

export const Visualization = ({ audioContext, audioGainNode }: Props) => {
	return (
		<section className={styles.section}>
			<Filename label="visualization.tsx" />
			<h2 className={styles.title}>Visualization</h2>
			<div className={styles.content}>
				<Volume audioContext={audioContext} audioGainNode={audioGainNode} />
				<Frequency audioContext={audioContext} audioGainNode={audioGainNode} />
			</div>
		</section>
	);
};
