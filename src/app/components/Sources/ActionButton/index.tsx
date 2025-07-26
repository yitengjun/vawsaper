import { Fragment_Mono } from "next/font/google";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
	leftSection?: ReactNode;
};

const defaultFont = Fragment_Mono({
	weight: ["400"],
	subsets: ["latin"],
});

export const ActionButton = ({
	label,
	disabled = false,
	onClick,
	className,
	leftSection,
}: Props) => {
	return (
		<button
			className={`${defaultFont.className} ${styles.button} ${className}`}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			{leftSection && <span className={styles.leftSection}>{leftSection}</span>}
			{label}
		</button>
	);
};
