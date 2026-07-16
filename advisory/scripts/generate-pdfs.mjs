import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const advisoryDir = path.resolve(__dirname, "..");

const job = {
  url: "http://localhost:8123/advisory/?render=pdf&pdfTheme=editorial&v=pdfgen-editorial",
  outFile: path.join(advisoryDir, "courtney-driver-advisory.pdf"),
};

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

try {
  const context = await browser.newContext();
  const page = await context.newPage();

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

  console.log(`Generated editorial PDF: ${job.outFile}`);

  await context.close();
} finally {
  await browser.close();
}
