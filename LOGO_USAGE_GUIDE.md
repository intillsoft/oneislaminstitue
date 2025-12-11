# Workflow AI Logo Usage Guide

## 🎨 Logo Overview

The Workflow AI logo is a modern, elegant design that combines:
- **Briefcase icon** - Represents career and professional opportunities
- **AI sparkles** - Symbolizes artificial intelligence and smart matching
- **Upward arrow** - Represents growth, progress, and career advancement
- **Connection lines** - Represents networking and the talent marketplace
- **Gradient colors** - Blue (#0046FF) to Purple (#7C3AED) representing innovation and technology

## 📁 Available Logo Files

### Main Logos
- `logo.svg` - Full logo with icon and text (light mode)
- `logo-dark.svg` - Full logo optimized for dark backgrounds
- `logo-horizontal.svg` - Horizontal layout variant
- `logo-premium.svg` - Premium version with enhanced details

### Icon Only
- `logo-icon.svg` - Icon only, square format (light mode)
- `logo-icon-dark.svg` - Icon only for dark backgrounds

### Favicon
- `favicon.svg` - Browser favicon (32x32)

## 🎯 Logo Variants

### 1. Full Logo
**Best for:** Headers, landing pages, marketing materials
```
/assets/images/logo.svg (light)
/assets/images/logo-dark.svg (dark)
```

### 2. Icon Only
**Best for:** App icons, favicons, small spaces, social media profiles
```
/assets/images/logo-icon.svg (light)
/assets/images/logo-icon-dark.svg (dark)
```

### 3. Horizontal Logo
**Best for:** Navigation bars, email signatures, wide banners
```
/assets/images/logo-horizontal.svg
```

### 4. Premium Logo
**Best for:** High-end presentations, premium marketing materials
```
/assets/images/logo-premium.svg
```

## 💻 Using the Logo in React

### Option 1: Using the Logo Component (Recommended)

```jsx
import Logo from '../components/Logo';

// Full logo (auto-detects dark/light mode)
<Logo variant="full" size="md" />

// Icon only
<Logo variant="icon" size="lg" />

// Horizontal layout
<Logo variant="horizontal" size="md" />

// Text only
<Logo variant="text" size="lg" />
```

### Option 2: Direct Image Usage

```jsx
// Light mode
<img src="/assets/images/logo.svg" alt="Workflow AI" className="h-10" />

// Dark mode
<img src="/assets/images/logo-dark.svg" alt="Workflow AI" className="h-10" />
```

## 📏 Size Guidelines

### Minimum Sizes
- **Full logo:** Minimum 120px width
- **Icon only:** Minimum 32px × 32px
- **Text only:** Minimum 16px font size

### Recommended Sizes
- **Header/Navigation:** 40-60px height
- **Hero sections:** 80-120px height
- **Favicon:** 32px × 32px
- **Social media:** 1024px × 1024px (for profile images)

## 🎨 Color Usage

### Primary Colors
- **Blue:** #0046FF (workflow-primary)
- **Purple:** #7C3AED
- **Gradient:** Blue to Purple

### Background Requirements
- **Light logos:** Use on white or light backgrounds
- **Dark logos:** Use on dark backgrounds (#0A0E27, #13182E)
- **Minimum contrast:** Ensure 4.5:1 contrast ratio for accessibility

## ⚠️ Usage Rules

### ✅ DO
- Use the appropriate variant for light/dark backgrounds
- Maintain aspect ratio when resizing
- Keep clear space around the logo (minimum 20% of logo height)
- Use high-resolution versions for print materials

### ❌ DON'T
- Don't stretch or distort the logo
- Don't change the colors
- Don't rotate the logo
- Don't place on busy backgrounds
- Don't add effects (shadows, outlines) unless in brand guidelines
- Don't use outdated versions

## 🔄 Dark Mode Support

The logo automatically adapts to dark mode when using the Logo component:

```jsx
// Auto-detects theme
<Logo variant="full" />

// Force light mode
<Logo variant="full" darkMode={false} />

// Force dark mode
<Logo variant="full" darkMode={true} />
```

## 📱 Responsive Usage

```jsx
// Responsive logo sizing
<div className="h-8 md:h-10 lg:h-12">
  <Logo variant="full" size="lg" />
</div>
```

## 🎯 Common Use Cases

### Navigation Header
```jsx
<Link to="/" className="flex items-center">
  <Logo variant="icon" size="md" className="mr-2" />
  <Logo variant="text" size="md" />
</Link>
```

### Landing Page Hero
```jsx
<Logo variant="full" size="xl" className="mb-8" />
```

### Footer
```jsx
<Logo variant="horizontal" size="sm" />
```

### Email Signature
```jsx
<img src="/assets/images/logo-horizontal.svg" alt="Workflow AI" style={{ height: '32px' }} />
```

## 🖼️ Export Specifications

### For Web
- Format: SVG (preferred) or PNG
- Resolution: 2x for retina displays
- Optimization: Compress SVG files

### For Print
- Format: PDF or high-res PNG
- Resolution: 300 DPI minimum
- Color mode: CMYK for print, RGB for digital

## 📝 Brand Guidelines

The logo represents:
- **Innovation** - AI-powered technology
- **Professionalism** - Career-focused platform
- **Growth** - Career advancement
- **Connection** - Talent marketplace

Always use the logo in a way that maintains these brand values.

## 🔗 Quick Links

- Logo files: `/public/assets/images/`
- Logo component: `/src/components/Logo.jsx`
- Brand colors: See `tailwind.config.js` and `DESIGN_SYSTEM.md`

---

**Last Updated:** 2024
**Version:** 1.0









