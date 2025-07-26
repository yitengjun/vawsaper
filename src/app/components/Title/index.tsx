import Link from "next/link";
import styles from "./styles.module.css";

export const Title = () => {
	return (
		<section className={styles.section}>
			<hgroup className={styles.title}>
				<h1>
					<span className={styles.author}>yitengjun/</span>
					<Link href="https://github.com/yitengjun/vawsaper" target="_blank">
						vawsaper
					</Link>
				</h1>
			</hgroup>
		</section>
	);
};
