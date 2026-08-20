import "./globals.css";

export const metadata = {
  title: "Accordion Frames | Codegrid",
  description: "Accordion Frames | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
