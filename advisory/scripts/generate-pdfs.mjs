import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const advisoryDir = path.resolve(__dirname, "..");

const jobs = [
  {
    theme: "dark",
    url: "http://localhost:8123/advisory/print/?theme=dark&v=pdfgen-clean",
    outFile: path.join(advisoryDir, "courtney-driver-advisory-dark.pdf"),
  },
  {
    theme: "light",
    url: "http://localhost:8123/advisory/print/?theme=light&v=pdfgen-clean",
    outFile: path.join(advisoryDir, "courtney-driver-advisory-light.pdf"),
  },
];

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const job of jobs) {
    await page.goto(job.url, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));

    await page.pdf({
      path: job.outFile,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true,
    });

    console.log(`Generated ${job.theme} PDF: ${job.outFile}`);
  }

  await context.close();
} finally {
  await browser.close();
}
