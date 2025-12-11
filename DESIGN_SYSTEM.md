# Workflow Design System

## Brand Identity

**Name:** Workflow - AI Job Search & Resume Platform  
**Primary Color:** #0046FF (Workflow Blue)  
**Secondary Color:** #FFFFFF (White)  
**Tagline:** Premium AI-powered job search and resume platform

## Color Palette

### Primary Colors
- `workflow-primary`: #0046FF
- `workflow-primary-50`: #E6EDFF
- `workflow-primary-100`: #CCDBFF
- `workflow-primary-600`: #0038CC
- `workflow-primary-700`: #002A99

### Dark Mode
- `dark-bg`: #0A0E27
- `dark-surface`: #13182E
- `dark-surface-elevated`: #1A2139
- `dark-border`: #1E2640
- `dark-text`: #E8EAED

## Typography

**Primary Font:** Inter (300, 400, 500, 600, 700, 800)  
**Monospace Font:** JetBrains Mono

### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)

## Spacing System

8px grid system:
- Base unit: 8px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## Components

### Buttons
- **Primary:** Blue gradient with glow effect
- **Secondary:** Light background with border
- **Ghost:** Transparent with hover state

### Cards
- **Standard:** White/dark surface with border and shadow
- **Glass:** Glassmorphism effect with backdrop blur
- **Interactive:** Hover scale and elevation change

### Inputs
- Rounded corners (lg)
- Focus ring with primary color
- Floating labels support

### Modals
- Backdrop blur
- Smooth scale animation
- Responsive sizing

## Effects

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Neumorphism
```css
box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
```

### Glow Effect
```css
box-shadow: 0 0 20px rgba(0, 70, 255, 0.3);
```

## Animations

### Transitions
- **Fast:** 200ms
- **Normal:** 300ms
- **Slow:** 600ms

### Keyframes
- Fade in/out
- Slide up/down/left/right
- Scale in/out
- Shimmer effect

## Accessibility

- WCAG 2.1 AA compliant
- Minimum touch target: 44px
- Focus indicators on all interactive elements
- Screen reader optimized
- High contrast mode support

## Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## Usage Examples

### Button
```jsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

### Card
```jsx
<div className="card-interactive">
  Content here
</div>
```

### Modal
```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</Modal>
```

## Design Principles

1. **Clarity:** Clear visual hierarchy and information architecture
2. **Consistency:** Unified design language across all components
3. **Performance:** Optimized animations and transitions
4. **Accessibility:** Inclusive design for all users
5. **Modern:** Contemporary design trends (glassmorphism, neumorphism)

