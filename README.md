# Black Lives Matter

A museum exhibit app showing a "lifelong clock" for each person: one that
runs forward from their birth toward their death, and one that runs backward
from their death toward their birth.

The app is a set of static files in [`docs/`](docs/) with the data built in.
It runs offline on an iPad once installed and needs no server. Museum staff
should follow [SETUP.md](SETUP.md).

## Layout

| Path | What it is |
| --- | --- |
| `docs/` | The site served by GitHub Pages |
| `docs/index.html` | List of birth and death clocks |
| `docs/detail.html?mode=birth&name=…` | One clock (`mode` is `birth` or `death`) |
| `docs/js/data.js` | Embedded records, generated from the CSV |
| `docs/sw.js` | Service worker that caches everything for offline use |
| `data/victims.csv` | Source data |
| `scripts/build_data.py` | Regenerates `docs/js/data.js` from the CSV |

## Publish on GitHub Pages

In the repository on GitHub: **Settings → Pages → Build and deployment →
Source: Deploy from a branch**, choose the branch and the **`/docs`** folder,
then **Save**. The site appears at
`https://<github-user>.github.io/black-lives-matter/`.

## Run locally

```bash
python3 -m http.server 8000 --directory docs
```

Then open <http://localhost:8000/>. (Opening the HTML file directly works
too, but offline caching only runs over http.)

## History

Until this conversion the app was a Flask + Postgres server on Heroku; that
code is in the Git history before the `offline-ipad` branch.
