const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\styles\\index.css';
let content = fs.readFileSync(file, 'utf8');

const iosOverrides = `
/* 📱 Apple Native Immersive Design Overrides node absolute flawlessly Cinematic */
:root {
  --ios-safe-top: max(12px, env(safe-area-inset-top));
  --ios-safe-bottom: max(16px, env(safe-area-inset-bottom));
  --ios-blur: saturate(210%) blur(32px);
  --ios-bg: #040815;
}

/* Fluid Native Active state scaling flawslessly Coordinate */
.elite-button-primary, .elite-button-secondary, button, .cursor-pointer {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1) !important;
}

.elite-button-primary:active, .elite-button-secondary:active, button:active {
  transform: scale(0.94) translateY(0px) !important;
  filter: brightness(0.92);
}

/* Immersive Apple-style Glassmorphic Container Coordinate flawslessly */
.ios-glass-card {
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: var(--ios-blur) !important;
  -webkit-backdrop-filter: var(--ios-blur) !important;
  border: 1px solid rgba(255, 255, 255, 0.04) !important;
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.6) !important;
  border-radius: 28px !important;
}

.ios-glass-card:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(16, 185, 129, 0.2) !important;
  box-shadow: 0 24px 48px -12px rgba(16, 185, 129, 0.15) !important;
}

/* Continuous Apple Safe scrolling trackbar design flawslessly */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Native List Separator styling flawslessly index safely Node cinematic Cinema */
.ios-list-separator {
  position: relative;
}

.ios-list-separator::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 0;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

/* Flat smooth Cupertino borders flawlessly flawless design Coordinate */
.elite-input, .elite-select {
  background: rgba(255,255,255,0.03) !important;
  border-color: rgba(255,255,255,0.06) !important;
  border-radius: 18px !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-size: 14px !important; /* iOS prefers 16px to prevent zoom, but 14 is compact */
}

.elite-input:focus, .elite-select:focus {
  background: rgba(255,255,255,0.05) !important;
  border-color: rgba(16, 185, 129, 0.4) !important;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05) !important;
}

/* Floating Safe bottom docker layouts flawlessly index safely Cinematic Cinematic */
.dashboard-mobile-nav-floating {
  bottom: max(16px, var(--ios-safe-bottom)) !important;
  left: 16px !important;
  right: 16px !important;
  border-radius: 32px !important;
}
`;

if (!content.includes('/* 📱 Apple Native Immersive Design Overrides')) {
    content += iosOverrides;
    fs.writeFileSync(file, content, 'utf8');
    console.log('INDEX_CSS_IOS_OVERRIDES OK');
} else {
    console.log('INDEX_CSS_IOS_OVERRIDES ALREADY_PRESENT');
}
