# Apple Music — Add to Multiple Playlists

A Tampermonkey userscript that adds a button to every song row on [music.apple.com](https://music.apple.com), letting you add a song to multiple playlists at once via a popup picker — instead of repeating the process one playlist at a time.

---

## What it does

- Adds a small icon button to the controls area of every song row (next to the `•••` menu)
- Clicking it opens a popup showing all your Apple Music library playlists with checkboxes
- Select any combination of playlists and hit **Add** — the song gets added to all of them in one shot
- Includes a **"Remember last selection"** toggle that auto-checks your previously used playlists the next time you open the popup
- Works on album pages, artist top songs, and your library

---

## Requirements

- Google Chrome (or any Chromium-based browser)
- [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) browser extension (free)
- An active Apple Music subscription

---

## Installation

### 1. Install Tampermonkey

Go to the [Tampermonkey Chrome Web Store page](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) and click **Add to Chrome**. Make sure you install the free version — not Tampermonkey BETA.

### 2. Enable userscript support in Chrome

Chrome requires you to explicitly allow userscripts to run:

1. Go to `chrome://extensions` in your address bar
2. Find **Tampermonkey** and click **Details**
3. Make sure **Site access** is set to **On all sites**
4. Enable **Developer mode** (toggle in the top right of `chrome://extensions`)

### 3. Configure Tampermonkey settings

These settings are required for the script to inject correctly:

1. Click the Tampermonkey icon → **Dashboard** → **Settings** tab
2. Set **Config Mode** to **Advanced**
3. Set **Content Script API** to **UserScripts API Dynamic**
4. Set **Sandbox Mode** to **Force Raw**
5. Click **Save**

### 4. Install the script

**Option A — Direct install (easiest):**
Click [here](./apple-music-multi-playlist.user.js) to open the raw script file, and Tampermonkey should automatically prompt you to install it.

**Option B — Manual install:**
1. Click the Tampermonkey icon → **Create a new script**
2. Select all the default code (`Ctrl+A`) and delete it
3. Copy the contents of `apple-music-multi-playlist.user.js` and paste it in
4. Press `Ctrl+S` to save

---

## Usage

1. Go to [music.apple.com](https://music.apple.com) in Chrome
2. Navigate to any album, playlist, or artist's top songs
3. Hover over a song row — a small playlist icon button will appear to the left of the `•••` button
4. Click it to open the playlist picker
5. Check the playlists you want to add the song to
6. Click **Add to X** — done!

### Memory feature

The popup includes a **"Remember last selection"** toggle (on by default). When enabled, the same playlists you picked last time will be pre-checked the next time you open the popup. Toggle it off to always start with a blank selection.

---

## Constraints & known limitations

- **Chrome only** — the script relies on Tampermonkey, which works best in Chrome/Chromium. It has not been tested in Safari or Firefox.
- **Catalog songs only** — the script grabs the song ID from the Apple Music catalog URL in the row. Songs that don't have a direct `/song/` link in their row (e.g. some locally uploaded tracks) may not work.
- **Library playlists only** — only your personal library playlists are shown. Apple Music editorial or algorithmic playlists (like New Music Mix) cannot be added to.
- **Up to 100 playlists** — the API call fetches a maximum of 100 playlists. If you have more than 100, the rest won't appear.
- **Requires active session** — the script uses the MusicKit authentication token from your active Apple Music session. If you get logged out, the add will fail until you log back in.
- **Apple Music web UI changes** — this script targets specific CSS class names in the Apple Music web player. If Apple updates their UI, the button injection or API calls may break and the script may need updating.

---

## How it works (technical)

The script uses the `MusicKit` JS instance that Apple Music loads on the page to:
1. Fetch your library playlists via `GET /v1/me/library/playlists`
2. Extract the song ID from the catalog URL embedded in each song row
3. Add the song to each selected playlist via `POST /v1/me/library/playlists/{id}/tracks`

No external servers, no API keys, no data leaves your browser beyond the normal Apple Music API calls.

---

## Disclaimer

This script is an unofficial personal tool and is not affiliated with or endorsed by Apple Inc. in any way. It interacts with Apple Music's internal API using your own authenticated session — no credentials are stored or transmitted anywhere outside of normal Apple Music API calls. Use at your own risk.

---

## License

MIT — free to use, modify, and distribute.