# Deployment Guide

This guide covers multiple deployment options for the nicheboard_pro application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository (for CI/CD deployments)

## Build the Project

Before deploying, build the project locally:

```bash
npm install
npm run build
```

The build output will be in the `dist` directory.

## Deployment Options

### 1. Vercel (Recommended - Easiest)

Vercel provides the simplest deployment experience for React applications.

#### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the Vite configuration
   - Click "Deploy"

The `vercel.json` file is already configured for this project.

#### Environment Variables:
If you need environment variables, add them in the Vercel dashboard under Project Settings → Environment Variables.

---

### 2. Netlify

Netlify is another excellent option for static site hosting.

#### Steps:

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   netlify deploy --prod
   ```
   Follow the prompts to link your project.

3. **Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

The `netlify.toml` file is already configured for this project.

---

### 3. GitHub Pages

Deploy directly to GitHub Pages using GitHub Actions.

#### Steps:

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Push your code**:
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push origin main
   ```

3. **The GitHub Action will automatically deploy**:
   - The workflow file (`.github/workflows/deploy.yml`) is already configured
   - It will build and deploy on every push to the `main` branch
   - Your site will be available at: `https://[username].github.io/[repository-name]`

#### Note:
If deploying to a custom domain or subdirectory, you may need to update the `base` option in `vite.config.mjs`.

---

### 4. Traditional Hosting (cPanel, FTP, etc.)

For traditional hosting providers:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder**:
   - Upload all contents of the `dist` directory to your web server's public directory (usually `public_html` or `www`)

3. **Configure server**:
   - Ensure your server supports client-side routing
   - Add a `.htaccess` file (for Apache) or configure nginx to redirect all routes to `index.html`

#### Apache `.htaccess` example:
Create a `.htaccess` file in the `dist` directory:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### 5. AWS S3 + CloudFront

For enterprise-grade hosting on AWS:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure S3 bucket**:
   - Enable static website hosting
   - Set `index.html` as the index document
   - Configure error document as `index.html` (for client-side routing)

4. **Set up CloudFront** (optional but recommended):
   - Create a CloudFront distribution pointing to your S3 bucket
   - Configure custom error responses to serve `index.html` for 404 errors

---

## Environment Variables

If your application uses environment variables:

1. **Create a `.env` file** for local development:
   ```
   VITE_API_URL=https://api.example.com
   VITE_APP_NAME=nicheboard_pro
   ```

2. **For production deployments**:
   - **Vercel**: Add in Project Settings → Environment Variables
   - **Netlify**: Add in Site Settings → Environment Variables
   - **GitHub Actions**: Add in Repository Settings → Secrets and variables → Actions

Note: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

---

## Troubleshooting

### Build Errors

- Ensure Node.js version is 18 or higher
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check for TypeScript errors if using TypeScript

### Routing Issues (404 errors on refresh)

- Ensure your hosting provider is configured to serve `index.html` for all routes
- Check that redirect rules are properly configured (see `.htaccess` example above)

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Rebuild the project after adding new environment variables
- Check that variables are set in your hosting platform's dashboard

---

## Continuous Deployment

All deployment configurations support automatic deployments:

- **Vercel/Netlify**: Automatically deploy on push to main branch
- **GitHub Pages**: Uses GitHub Actions workflow (already configured)
- **AWS**: Can be automated using AWS CodePipeline or GitHub Actions

---

## Need Help?

- Check the [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- Review your hosting provider's documentation
- Check build logs in your hosting platform's dashboard

