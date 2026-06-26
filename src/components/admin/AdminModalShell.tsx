"use client";

import { useEffect, type ReactNode } from "react";

type AdminModalShellProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * 管理画面用モーダル。iOS Safari でも中身までスクロールできる構造。
 */
export function AdminModalShell({ title, onClose, children, footer }: AdminModalShellProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
        onClick={onClose}
      >
        <div className="min-h-full flex flex-col items-center px-3 pt-4 pb-28 sm:px-4 sm:pt-8 sm:pb-16">
          <div
            className="tc-card w-full max-w-2xl p-5 sm:p-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5 shrink-0">
              <h2 className="text-lg sm:text-xl font-black text-telecareer-ink pr-2">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-ink text-2xl leading-none font-bold shrink-0 p-1"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <div className="min-h-0">{children}</div>

            {footer ? (
              <div className="sticky bottom-0 -mx-5 sm:-mx-8 mt-4 px-5 sm:px-8 pt-4 pb-1 bg-white border-t-2 border-ink/10 shrink-0">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
