import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
import { MediaLogoMarquee } from "@/components/MediaLogoMarquee";
import { CategoryCard } from "@/components/CategoryCard";
import { getCurrentUser } from "@/lib/auth";
import {
  CATEGORIES,
  COMPANY_INFO,
  STEPS,
  WORKS,
} from "@/lib/home-content";

export default async function HomePage() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen flex flex-col bg-telecareer-surface">
      <AppHeader />

      <main className="flex-1">
        {/* ===== Hero（明るい配色／背景に流れるメディア実績ロゴ） ===== */}
        <section className="bg-telecareer-hero relative overflow-hidden border-b-2 border-ink">
          <MediaLogoMarquee />
          <div className="absolute inset-0 z-[1] tc-hero-veil" aria-hidden="true" />

          <div className="mx-auto max-w-5xl px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10 flex flex-col items-center text-center">
            <span className="tc-eyebrow bg-white">エンタメ人材キャリアマッチング</span>
            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight text-telecareer-ink">
              エンタメ業界専門求人<span className="tc-marker">エンジン</span>
              <br className="hidden sm:block" />
              <span className="text-2xl sm:text-3xl md:text-4xl">by テレキャリア</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-700 max-w-2xl font-medium">
              エキストラ、バラエティ、ドラマ、芸能マネージャー、CM、配信など、
              <br className="hidden sm:block" />
              エンタメ特化の求人が見つかる。未経験から始められる仕事も多数。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link href="/signup" className="btn-cta btn-flashy px-10 py-4 font-bold text-lg w-full sm:w-auto">
                無料で会員登録 →
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-gray-700">
              {!user ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-telecareer-yellow" />
                  未経験OK
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-telecareer-coral" />
                全部無料
              </span>
            </div>
            <p className="mt-8 text-sm md:text-base font-black text-telecareer-ink">
              誰もが知る、<span className="tc-marker">あの番組・現場</span>とつながっています。
            </p>
          </div>
        </section>

        {/* ===== 実績（各局・各社とのつながり） ===== */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="tc-eyebrow bg-white">WORKS</span>
            <h2 className="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">
              これまで携わった主な現場
            </h2>
            <p className="mt-4 text-gray-600 font-medium">
              実績ある会社が運営。誰もが知るテレビ番組・ドラマ・大手CM・配信の現場とつながっています。
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WORKS.map((w) => (
              <div key={w.network} className="tc-card-soft p-5">
                <h3 className="font-black text-telecareer-ink border-b-2 border-telecareer-orange/40 pb-2 mb-3">
                  {w.network}
                </h3>
                <ul className="space-y-1.5">
                  {w.shows.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-telecareer-orange shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                  <li className="text-xs text-gray-400 pt-1">ほか多数</li>
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-400 text-center max-w-3xl mx-auto">
            ※ 運営会社（株式会社フォーミュレーションI.T.S.）の配属実績の一部です。番組名は各放送局・制作会社の権利に帰属します。
          </p>
        </section>

        {/* ===== カテゴリ（こんな求人があります） ===== */}
        <section className="bg-white border-y-2 border-ink">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="text-center mb-12">
              <span className="tc-eyebrow bg-telecareer-surface">CATEGORY</span>
              <h2 className="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">
                例えば、こんなお仕事。
              </h2>
              <p className="mt-4 text-gray-600 font-medium">
                エンタメの現場には、さまざまな仕事があります。未経験から始められるものも多数。
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((c) => (
                <CategoryCard key={c.name} category={c} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/signup" className="btn-cta px-8 py-3.5 font-bold text-base">
                無料登録して求人を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== 使い方 ===== */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="tc-eyebrow bg-white">HOW IT WORKS</span>
            <h2 className="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">
              ご利用の流れ
            </h2>
            <p className="mt-4 text-gray-600 font-medium">
              初めての方でも、たった3ステップ。登録から現場デビューまでサポートします。
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-4 relative">
            {STEPS.map((s, i) => (
              <div key={s.no} className="relative flex flex-col items-center text-center">
                {i > 0 && (
                  <span
                    className="hidden md:flex absolute -left-2 top-12 -translate-x-1/2 -translate-y-1/2 text-telecareer-ink/30 z-10"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </span>
                )}

                <div className="tc-card tc-card-hover p-7 w-full flex flex-col items-center h-full">
                  <div className="relative">
                    <span
                      className={`w-24 h-24 rounded-full border-2 border-ink flex items-center justify-center text-ink ${s.bg} shadow-[3px_3px_0_0_rgba(31,31,31,1)]`}
                    >
                      {s.icon}
                    </span>
                    <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-ink flex items-center justify-center font-black text-telecareer-ink text-sm">
                      {i + 1}
                    </span>
                  </div>
                  <span className="mt-5 tag-pill tag-plain text-xs">STEP {s.no}</span>
                  <h3 className="mt-3 text-xl font-bold text-telecareer-ink">{s.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed text-sm">{s.body}</p>
                </div>

                {i < STEPS.length - 1 && (
                  <span className="md:hidden text-telecareer-ink/30 mt-3" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup" className="btn-cta px-8 py-3.5 font-bold text-base">
              無料で会員登録してはじめる →
            </Link>
          </div>
        </section>

        {/* ===== 運営会社（フォーミュレーションI.T.S.） ===== */}
        <section className="bg-white border-y-2 border-ink" id="about">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="text-center mb-12">
              <span className="tc-eyebrow bg-telecareer-surface">ABOUT US</span>
              <h2 className="mt-4 text-2xl md:text-3xl font-black text-telecareer-ink tc-section-heading inline-block">
                テレビ業界に強い人材会社が運営しています
              </h2>
              <p className="mt-5 text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
                「どこの誰が運営しているか分からない」という不安はいりません。エンジンを運営するのは、長年テレビ・エンタメ業界に人材を送り出してきた会社です。
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5 items-start">
              <div className="lg:col-span-3">
                <p className="text-gray-700 leading-relaxed">
                  運営は<strong className="text-telecareer-ink">株式会社フォーミュレーションI.T.S.</strong>
                  。2011年からテレビ局や制作会社に人材を送り出してきた、メディア業界専門の人材会社です。親会社は1986年創業、テレビ・CM業界で活躍するリサーチ会社「フォーミュレーション」。長年つちかったネットワークで、テレビ番組・ドラマ・映画・大手CM・配信・イベントなど“本物の現場”とつながっています。
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="tc-card p-6">
                  <h3 className="font-black text-telecareer-ink mb-4 border-b-2 border-telecareer-orange/40 pb-2">
                    会社概要
                  </h3>
                  <dl className="space-y-3 text-sm">
                    {Object.entries(COMPANY_INFO).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-gray-500 font-bold text-xs">{k}</dt>
                        <dd className="text-ink mt-0.5">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <a
                    href="https://www.f-its.co.jp/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-accent inline-block mt-4 text-sm"
                  >
                    会社概要を見る ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== お問い合わせ / 会員登録 CTA ===== */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="tc-card bg-telecareer-hero border-ink p-10 md:p-14 text-center relative overflow-hidden">
            <h2 className="text-2xl md:text-4xl font-black text-telecareer-ink relative">まずは、気軽に一歩を。</h2>
            <p className="mt-4 text-gray-700 font-medium relative">
              会員登録は無料。未経験から挑戦できる求人もたくさんあります。ご相談だけでも歓迎です。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link href="/signup" className="btn-cta btn-flashy px-10 py-4 font-bold text-lg">
                無料で会員登録 →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
