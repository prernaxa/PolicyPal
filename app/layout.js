import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "PolicyPal — AI-Powered Privacy Policy Analyzer",
  description: "Summarize and understand privacy policies instantly using AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className="font-instrument antialiased bg-background text-foreground">
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
