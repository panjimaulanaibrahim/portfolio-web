import localFont from "next/font/local";
import "./globals.css";

// Fonts are stored inside the project (src/fonts), so builds never depend on Google Fonts.

// Headings
const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

// Body text
const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

// Labels and data
const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://panjimaulana.web.app"),
  title: "Panji Maulana Ibrahim | Maintenance Engineer",
  description:
    "Less downtime, smarter maintenance. Portfolio of Panji Maulana Ibrahim, Maintenance Engineer in automotive components manufacturing.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
