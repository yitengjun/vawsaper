import "./reset.css";
import "./global.css";
import { Geist } from "next/font/google";

const geist = Geist({
	weight: ["400", "500"],
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={geist.className} lang="en">
			<body>{children}</body>
		</html>
	);
}
