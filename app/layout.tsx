import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryTrail — Big worlds, just press play",
  description: "Thoughtful screen-free audio adventures for curious kids.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
