"use client";

import { useEffect } from "react";
import { loadClientSession, saveClientSession, type ClientSession } from "@/lib/demo-client-session";

/**
 * Cookie にセッションがあり localStorage にない場合に同期する。
 * トンネル経由やブラウザ再起動後もログイン状態を復元する。
 */
export function DemoSessionBootstrap() {
  useEffect(() => {
    if (loadClientSession()) return;

    fetch("/api/demo/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { session?: ClientSession | null }) => {
        if (data.session?.email) {
          saveClientSession(data.session);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
