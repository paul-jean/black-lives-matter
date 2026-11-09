# Exhibit setup guide (iPad)

This app runs entirely on the iPad. After a one-time install it needs no
internet connection and no server.

## What you need

- An iPad with iPadOS 16.4 or later, kept on its charger.
- Wi-Fi for the few minutes of the install only.
- The app's web address (for example `https://<github-user>.github.io/black-lives-matter/`).

## Install (once per iPad)

1. Connect the iPad to Wi-Fi.
2. Open **Safari** and go to the app's web address.
3. To have the iPad open on one person's clock, tap that person's
   **(birth)** or **(death)** link first. To open on the full list, stay on
   the list page.
4. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
5. Open the app once from the new home-screen icon and wait a few seconds.
   This saves every file to the iPad.
6. Turn on **Airplane Mode**, close the app, and open it again from the icon.
   The clock should run. The iPad can now stay offline.

## Lock the iPad to the exhibit

1. **Settings → Display & Brightness → Auto-Lock → Never.**
2. **Settings → Accessibility → Guided Access → On**, and set a passcode.
3. Open the app from the home-screen icon, then triple-click the top (or
   home) button and tap **Start**. Visitors can no longer leave the app.
4. To exit, triple-click again and enter the passcode.
5. Optional: **Settings → General → Software Update → Automatic Updates → Off**
   so an update does not restart the iPad during exhibit hours.

The clock starts from the birth (or death) date each time the page opens. A
restart or dead battery simply starts it again.

## If the app stops working offline

Deleting the home-screen icon or clearing Safari's website data removes the
saved copy. Repeat the install steps above with Wi-Fi on.

## Updating the names or dates (maintainer)

1. Edit `data/victims.csv` (columns: Name, birth, death, age; dates like `Feb 5 1995`).
2. Run `python3 scripts/build_data.py` to regenerate `docs/js/data.js`.
3. In `docs/sw.js`, bump `CACHE_VERSION` (for example `blm-v1` → `blm-v2`).
4. Commit and push; GitHub Pages republishes within a minute or two.
5. On each iPad, turn Wi-Fi on, open the app twice (the first launch downloads
   the update, the second shows it), then turn Wi-Fi off again.
