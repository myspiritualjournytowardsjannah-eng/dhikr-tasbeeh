# Dhikr — Tasbeeh PWA prototype

A responsive, installable web app prototype with a midnight navy and gold theme.

## Included
- Digital tasbeeh counter for five dhikr options
- Per-dhikr counts and configurable targets
- Undo and reset controls
- Local browser storage (counts persist on the same browser/device)
- Daily count summary
- Dark/light theme toggle
- Basic offline caching and PWA install prompt
- Quran reminder and virtue/reference panel
- A five-tree symbolic garden with smooth, per-dhikr visual growth
- A hadith note for Jamiʿ at-Tirmidhi 3464, including differing grading attributions

## Run locally
A PWA service worker requires HTTPS or localhost. From this folder, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

To test installation, use localhost or deploy the folder to an HTTPS host (for example, GitHub Pages, Netlify, or Vercel).

## Important notes
- This is a front-end prototype. Data stays in the browser's local storage; it is not synced across devices.
- The tree garden is decorative only. Its animation and recitation counters do not measure or represent rewards in Paradise.
- Jamiʿ at-Tirmidhi 3464 is presented with its grading disagreement: al-Tirmidhi calls it hasan sahih gharib, while the Darussalam grade displayed by Sunnah.com is daʿif; other scholars, including al-Albani, graded it authentic. The app links to the text on Sunnah.com. Seek a trusted scholar’s review before public release.
- Other included references are starter content. Before public release, verify Arabic spelling/diacritics, translations, hadith wording, numbering and grading against a trusted edition or scholar.
- Dhikr targets are user-set convenience goals, not a claim that a particular count is required for every phrase.
- A production release should add a fuller source/verification workflow, privacy policy, accessibility testing, and icon sizes for platform-specific installation.
\n\n## Garden update\nThe light theme is the default. Each counter tap adds a new small symbolic sapling to that dhikr's illustrated grove, while its main palm illustration gently grows with the count. The garden is decorative only and does not represent or measure rewards in Paradise.\n