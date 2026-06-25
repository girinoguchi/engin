import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const pages = [
  { name: "01-home", url: "http://localhost:3000/" },
  { name: "02-login", url: "http://localhost:3000/login" },
  { name: "03-jobs", url: "http://localhost:3000/jobs" },
  { name: "04-admin-login", url: "http://localhost:3000/login" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const page = await context.newPage();

for (const item of pages) {
  await page.goto(item.url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/${item.name}.png`, fullPage: true });
  console.log(`saved ${item.name}.png`);
}

// Admin flow: login via API + localStorage then open admin
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
const loginRes = await page.evaluate(async () => {
  const res = await fetch("/api/demo/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin", password: "admin" }),
  });
  const data = await res.json();
  if (data.session) {
    localStorage.setItem("demo_session_v1", JSON.stringify(data.session));
    window.dispatchEvent(new Event("demo-session-change"));
    return true;
  }
  return false;
});
console.log("admin login:", loginRes);

await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/05-admin-dashboard.png`, fullPage: true });
console.log("saved 05-admin-dashboard.png");

await page.goto("http://localhost:3000/admin/jobs", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/06-admin-jobs.png`, fullPage: true });
console.log("saved 06-admin-jobs.png");

await page.goto("http://localhost:3000/admin/accounts", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/07-admin-accounts.png`, fullPage: true });
console.log("saved 07-admin-accounts.png");

await browser.close();
