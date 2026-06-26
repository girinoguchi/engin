import Link from "next/link";

type HeaderProps = {
  user?: { email?: string | null } | null;
  profile?: {
    company_name?: string | null;
    contact_name?: string | null;
    role?: string;
  } | null;
  onLogout?: () => void;
};

export function Header({ user, profile, onLogout }: HeaderProps) {
  const displayName = profile?.contact_name?.trim() || profile?.company_name?.trim();

  return (
    <header className="sticky top-0 z-40 bg-telecareer-offwhite/90 backdrop-blur border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0 hover:opacity-90 transition-opacity">
          <span className="inline-flex shrink-0 items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-telecareer-orange border-2 border-ink shadow-[3px_3px_0_rgba(43,38,32,0.18)] text-white font-black text-base sm:text-lg">E</span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-black text-lg sm:text-xl text-telecareer-ink tracking-tight truncate">エンジン</span>
            <span className="text-[10px] font-bold text-gray-500 mt-0.5 hidden sm:block">エンタメ人材キャリアマッチング</span>
          </span>
        </Link>
        <nav className="ml-auto flex shrink-0 items-center gap-2 sm:gap-5 text-sm font-bold">
          {user ? (
            <>
              {profile?.role === "admin" ? (
                <Link href="/admin" className="btn-cta px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold whitespace-nowrap tc-nav-tap">
                  管理画面
                </Link>
              ) : (
                <>
                  <Link href="/jobs" className="btn-cta px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold whitespace-nowrap tc-nav-tap">
                    求人を探す
                  </Link>
                  <Link href="/mypage" className="text-xs sm:text-sm nav-link-light whitespace-nowrap tc-nav-tap">
                    マイページ
                  </Link>
                </>
              )}
              {profile?.role === "admin" && (
                <>
                  <Link href="/admin" className="nav-link-light hidden sm:inline">
                    管理
                  </Link>
                  <Link href="/admin/jobs" className="nav-link-light hidden md:inline">
                    案件管理
                  </Link>
                  <Link href="/admin/accounts" className="nav-link-light hidden md:inline">
                    アカウント管理
                  </Link>
                </>
              )}
              {displayName ? (
                <span className="text-sm font-semibold text-gray-600 hidden md:inline max-w-[8rem] truncate">
                  {displayName}
                </span>
              ) : null}
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs sm:text-sm nav-link-light whitespace-nowrap"
                >
                  ログアウト
                </button>
              ) : (
                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-xs sm:text-sm nav-link-light whitespace-nowrap">
                    ログアウト
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <Link href="/jobs" className="nav-link-light font-medium hidden sm:inline tc-nav-tap">
                求人を探す
              </Link>
              <Link href="/login" className="text-xs sm:text-sm nav-link-light font-medium whitespace-nowrap tc-nav-tap">
                ログイン
              </Link>
              <Link href="/signup" className="btn-cta px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold whitespace-nowrap tc-nav-tap">
                会員登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
