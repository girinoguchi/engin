"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type AdminModalShellProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

type VisualViewportState = {
  top: number;
  left: number;
  height: number;
  width: number;
};

function getVisualViewportState(): VisualViewportState {
  const vv = window.visualViewport;
  if (!vv) {
    return {
      top: 0,
      left: 0,
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }
  return {
    top: vv.offsetTop,
    left: vv.offsetLeft,
    height: vv.height,
    width: vv.width,
  };
}

/**
 * 管理画面用モーダル。スマホでもフォーム末尾までスクロールし、下部ボタンは常に表示。
 * iOS Safari のアドレスバー・仮想キーボード表示時も visualViewport に合わせて配置する。
 */
export function AdminModalShell({ title, onClose, children, footer }: AdminModalShellProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<VisualViewportState | null>(null);

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
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  useEffect(() => {
    const vv = window.visualViewport;
    const update = () => setViewport(getVisualViewportState());
    update();
    if (!vv) return;
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement) || !body.contains(target)) return;
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    };

    body.addEventListener("focusin", onFocusIn);
    return () => body.removeEventListener("focusin", onFocusIn);
  }, []);

  const overlayStyle: CSSProperties = viewport
    ? {
        top: viewport.top,
        left: viewport.left,
        width: viewport.width,
        height: viewport.height,
      }
    : {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      };

  return (
    <div
      className="fixed z-50 flex items-stretch sm:items-center justify-center sm:p-4"
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-label="モーダルを閉じる"
      />

      <div
        className="relative z-10 tc-card w-full max-w-2xl h-full sm:h-auto sm:max-h-[min(90dvh,48rem)] flex flex-col overflow-hidden min-h-0 rounded-none sm:rounded-2xl p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between shrink-0 px-5 pt-[max(1.25rem,env(safe-area-inset-top,0px))] pb-3 sm:px-8 sm:pt-6 border-b border-ink/10">
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

        <div
          ref={bodyRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y px-5 py-4 sm:px-8 [-webkit-overflow-scrolling:touch]"
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t-2 border-ink/10 px-5 py-4 sm:px-8 bg-white pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
