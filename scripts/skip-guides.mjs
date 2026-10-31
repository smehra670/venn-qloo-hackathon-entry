/** Marks the welcome walkthrough and results tour as seen, so scripted runs aren't blocked by them. */
export async function skipGuides(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("venn.guide.welcome", "1");
      localStorage.setItem("venn.guide.results", "1");
    } catch {
      // Storage blocked: the guides show, and the script will notice.
    }
  });
}
