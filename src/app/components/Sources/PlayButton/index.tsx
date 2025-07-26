import type { SVGProps } from "react";
import styles from "./styles.module.css";

type Props = {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
};

export const PlayButton = ({ label, disabled = false, onClick }: Props) => {
	return (
		<button
			className={styles.button}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			<MaterialSymbolsLightPlayCircleOutline
				className={styles.icon}
				label={label}
			/>
			{label}
		</button>
	);
};

function MaterialSymbolsLightPlayCircleOutline({
	label,
	...props
}: { label: string } & SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label={label}
			height="1em"
			role="img"
			viewBox="0 0 24 24"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{/* Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
			<path
				d="M10 15.577L15.577 12L10 8.423zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
				fill="currentColor"
			/>
		</svg>
	);
}
