"use client";

import { useEffect } from "react";
import { syncClientSessionFromCookie } from "@/lib/demo-client-session";

/** 初回ロード時に Cookie → localStorage を同期（useDemoClientSession と共有） */
export function DemoSessionBootstrap() {
  useEffect(() => {
    void syncClientSessionFromCookie();
  }, []);

  return null;
}
