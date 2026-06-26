import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-telecareer-dark text-gray-400 text-sm mt-20 relative overflow-hidden">
      {/* 上部のカラフルな帯 */}
      <div className="flex h-2">
        <span className="flex-1 bg-telecareer-yellow" />
        <span className="flex-1 bg-telecareer-orange" />
        <span className="flex-1 bg-telecareer-green" />
        <span className="flex-1 bg-telecareer-coral" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-telecareer-orange border-2 border-ink text-white font-black">E</span>
            <span className="font-black text-xl text-white tracking-tight">エンジン</span>
          </Link>
          <p className="leading-relaxed max-w-2xl">
            エンタメ業界で働きたい人の、エンジンになる。
            バラエティ・ドラマ・芸能マネージャー・CM・配信など、エンタメ特化の求人をお届けします。未経験から始められる仕事も多数。
          </p>
          <p className="mt-3 text-xs text-gray-500">運営：株式会社フォーミュレーションI.T.S.</p>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500">
          <span>© エンジン（株式会社フォーミュレーションI.T.S.）All Rights Reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-telecareer-yellow transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-telecareer-yellow transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
