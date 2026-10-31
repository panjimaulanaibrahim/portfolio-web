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

const siteTitle = "Panji Maulana Ibrahim | Maintenance Engineer";
const siteDescription =
  "Less downtime, smarter maintenance. Portfolio of Panji Maulana Ibrahim, a Maintenance Engineer who keeps production running and builds tools that make maintenance work faster.";

// Title and description for Google, plus the preview card shown when the link is shared
// (WhatsApp, LinkedIn, X). Preview image: public/og.jpg (1200 x 630).
// Browser tab icons: src/app/favicon.ico, icon.png and apple-icon.png (picked up automatically).
export const metadata = {
  metadataBase: new URL("https://panjimaulana.web.app"),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Panji Maulana Ibrahim",
  authors: [{ name: "Panji Maulana Ibrahim" }],
  keywords: [
    "Panji Maulana Ibrahim",
    "Maintenance Engineer",
    "Mechanical Engineering",
    "PLC",
    "Preventive Maintenance",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Panji Maulana Ibrahim",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Panji Maulana Ibrahim, Maintenance Engineer. Think BIG, Act BOLD.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Skip the loading screen instantly if it was already shown in this browser session */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('pmi-loaded')==='1')document.documentElement.classList.add('loaded-before')}catch(e){}",
          }}
        />
        <noscript>
          <style>{".site-loader{display:none}.reveal{opacity:1;transform:none}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
