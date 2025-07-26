import { Fragment_Mono } from "next/font/google";
import styles from "./styles.module.css";

type Props = {
	label: string;
};

const defaultFont = Fragment_Mono({
	weight: ["400"],
	subsets: ["latin"],
});

export const Filename = ({ label }: Props) => {
	return (
		<div className={`${defaultFont.className} ${styles.label}`}>{label}</div>
	);
};
