import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseIQ — AI User Feedback Synthesizer & Product Intelligence Platform",
  description: "Transform unstructured customer reviews, surveys, support tickets, and audio files into prioritized business intelligence with Hindsight memory tracking and Cascadeflow workflow automation.",
  keywords: ["AI Product Intelligence", "Feedback Synthesis", "Sentiment Indexing", "Cascadeflow", "Hindsight Context Memory", "Enterprise SaaS"],
  authors: [{ name: "PulseIQ Inc." }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-bg-base text-white">
        {children}
      </body>
    </html>
  );
}
