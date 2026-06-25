import type { Metadata } from "next";
import { DemoBanner } from "@/components/DemoBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "エンジン｜エンタメ人材キャリアマッチング",
  description:
    "エンタメ業界で働きたい人のエンジンになる。バラエティ・ドラマ・芸能マネージャー・CM・配信など、エンタメ特化の求人が見つかる。未経験から始められる仕事も多数。業界を知り尽くしたキャリアアドバイザーがサポートします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen bg-telecareer-offwhite text-gray-800">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
