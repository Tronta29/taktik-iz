# Taktik İz — AI pipeline for football tactical analysis videos

Taktik İz is a Turkish YouTube channel for data-driven football analysis. This repository holds the pipeline behind it: AI agents research a match, write the analysis and the script, and the video is generated in code with synthetic voiceover.

No broadcast footage is used. Every position, heatmap and statistic is redrawn as an animation from data.

## How it works

1. **Data collection** — match and player statistics (xG, xGA, heatmaps, touch maps, standings) are pulled from SofaScore and stored as JSON (`veri/`).
2. **Analysis (AI agent)** — a Claude agent researches the match online and writes a structured tactical analysis (`*/analiz.md`). If a data source looks unreliable, the agent asks for confirmation instead of guessing.
3. **Script (AI agent)** — Claude, driven by the screenwriter prompt (`taktik-iz-senarist-prompt.md`), turns the analysis into a voiceover script with a hook, scenes and a call to action (`*/senaryo.md`, `*/sahneler.mjs`).
4. **Voiceover** — `ses.mjs` sends the script to the ElevenLabs v3 text-to-speech API with word-level timestamps. A pronunciation dictionary maps foreign player names to Turkish phonetics before synthesis, while the on-screen text keeps the correct spelling.
5. **Video rendering** — Remotion (React + TypeScript) renders the scenes: tactical pitch, team colours, info panel, data bars and karaoke subtitles synced to the word timestamps (`*/src/`).

## Rules files that steer the agents

| File | Purpose |
| --- | --- |
| `taktik-iz-video-format.md` | Video types (pre-match, post-match, "how to beat them", form trend), structure and timing for long and vertical formats |
| `taktik-iz-senarist-prompt.md` | Screenwriter agent prompt: one thesis per video, hook rules, no invented data |
| `taktik-iz-gorsel-sema.md` | Visual system: colour palette, pitch layout, action markers, typography |

Keeping the rules in separate files means every match goes through the same process and the output stays consistent.

## Project structure

| Folder | Content |
| --- | --- |
| `alanya-trabzon/video` | Long-form (16:9) analysis video |
| `alanya-trabzon/shorts`, `besiktas-gencler/shorts`, `cfk-fb`, `gs-amed` | Vertical Shorts videos for individual matches |
| `isi` | Team heatmap and player touch-map components |
| `veri` | Match data in JSON |
| `kit` | Channel branding (logo, banner) as SVG |

## Tech stack

- **AI:** Claude (Claude Code agents), ElevenLabs v3 text-to-speech with timestamps
- **Video:** Remotion 4, React 18, TypeScript
- **Data:** SofaScore, JSON
- **Runtime:** Node.js

## Running a video

```bash
cd cfk-fb
npm install
export ELEVENLABS_API_KEY=your_key   # needed for the voiceover step
node ses.mjs                          # generate voiceover and word timings
npm run render                        # render the video with Remotion
```

Rendered videos, audio files and `node_modules` are not included in the repository.

## Author

Derviş Toraman · [github.com/Tronta29](https://github.com/Tronta29) · toramand9@gmail.com
