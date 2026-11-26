# My Portfolio

A one-page portfolio website covering **Finance, Administration, Audio and Visual** work.
No frameworks and nothing to install. It's plain HTML, CSS and JavaScript.

## 1. Edit it in VS Code

1. Open VS Code → **File → Open Folder…** → choose this `portfolio` folder.
2. Install the free extension **Live Server** (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**. The site opens in your browser
   and refreshes every time you save.
4. Open **`content.js`**. *All* your text, links and pictures live there.
   Replace every `Your Name`, `EDIT ME`, example email, etc. Save, and the page updates.

### Adding your files
| What | Put it in | Then in `content.js` |
|---|---|---|
| Your portrait | `assets/photos/me.jpg` | `portrait: "assets/photos/me.jpg"` |
| Your CV (PDF) | `assets/docs/Your-Name-CV.pdf` | `cv: "assets/docs/Your-Name-CV.pdf"` |
| Photography | `assets/photos/` | add to the `photos` list |
| Project screenshots | `assets/projects/` | `image:` on that project |
| Audio (.mp3) | `assets/audio/` | `src:` on that track |

**Keep photos small:** resize to ~1600px wide before adding (use https://squoosh.app).
Large phone photos (3–5 MB each) make the site slow on mobile data.

**Finance/admin work is private!** Before you screenshot a spreadsheet or report, replace
real names, amounts and account numbers with dummy data.

## 2. Publish it free with GitHub Pages

1. Create a free account at https://github.com (pick a professional username, e.g. `firstname-lastname`).
2. Click **New repository**. Name it exactly **`<your-username>.github.io`**, set it to **Public**, and create it.
3. On the repo page click **Add file → Upload files**, drag in *everything inside* this
   `portfolio` folder (`index.html`, `styles.css`, `script.js`, `content.js`, `assets/`), then **Commit changes**.
4. Go to **Settings → Pages**. Under *Source* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. After 1–2 minutes your site is live at **`https://<your-username>.github.io`**.

That's the link for your CV, email signature, LinkedIn "Website" field and job applications.

**Updating later:** edit the files, then upload them to the repo again (or use VS Code's
Source Control panel / GitHub Desktop to push changes). The site updates in about a minute.

## Updating your CV

The CV is the page `cv.html`. Edit its text in VS Code, then rebuild the PDF the
"Download CV" button serves (with Live Server or the preview running on port 5500):

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --no-pdf-header-footer --print-to-pdf="assets\docs\Joseph-Omondi-Otieno-CV.pdf" "http://localhost:5500/cv.html"
```

Or open `cv.html` in your browser, press **Ctrl+P**, choose **Save as PDF**, untick
**Headers and footers**, and save it over `assets/docs/Joseph-Omondi-Otieno-CV.pdf`.

## 3. Tips that make recruiters come back

- **Lead with results, not duties.** "Cut month-end close from 10 to 6 days" beats "Responsible for month-end."
- **3–6 strong projects > 15 weak ones.** Delete the placeholder cards you can't fill yet.
- **Professional portrait:** plain background, good light, shoulders up, smiling.
- **Make the CV button work.** Recruiters click it first.
- **Tailor the headline** to the job type you're applying for most.
- **Test on your phone.** Most recruiters will first open your link on mobile.
- **Pin a GitHub README:** create a repo named exactly your username and add a short bio
  with the portfolio link. It shows at the top of your GitHub profile.
