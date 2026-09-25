# 📊 People Analytics Studio

> **HR Intelligence & People Analytics Platform**  
> Clean messy employee HR data, build automated relational data models, explore SQL & Python querying labs, generate DAX formulas for Power BI, and view interactive executive dashboards with role-based access control.

---

## 🚀 Live Demo & Deployment to GitHub Pages

This project is pre-configured for **GitHub Pages** deployment with zero manual asset path headaches (uses relative base assets `./` and automated 404 routing).

### Method 1: Automated Deployment via GitHub Actions (Recommended)

1. **Create a new repository** on [GitHub](https://github.com/new).
2. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish your app at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

---

### Method 2: 1-Command CLI Deployment (`gh-pages`)

If you prefer deploying directly from your local terminal using the `gh-pages` branch:

```bash
# 1. Install dependencies
npm install

# 2. Deploy to GitHub Pages
npm run deploy
```

This will automatically run `npm run build` and push the production `dist/` directory to the `gh-pages` branch on your GitHub repository.
Then, under **Settings** → **Pages**, set **Source** to `Deploy from a branch` and choose `gh-pages` / `/ (root)`.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## ✨ Features Included

- **Data Ingestion & Cleaning Engine**: Clean messy HR CSVs, fix missing values, standardize job titles, parse salaries, and detect tenure anomalies.
- **Automated Data Modeling**: Star-schema data modeling (Fact and Dimension tables) with ERD visualization.
- **SQL & Python Query Lab**: Run analytic queries across 500 to 5,000 employee records with simulated HR engines.
- **Power BI & DAX Generator**: Ready-to-copy formulas for Headcount, Voluntary Attrition %, Diversity Index, and Average Compa-Ratio.
- **Executive Dashboards**: Headcount trends, department distribution, attrition risk heatmaps, compensation parity, and retention drivers.
- **Role-Based Access Control (RBAC)**: Switch between Super Admin, HR Admin, People Analyst, Department Manager, and Executive Viewer.
- **Customizable Background Atmosphere**: 1-click toggle between White (Light Mode), Grey (Slate), Multicolored (Vibrant Glow), and Classic Dark themes.
