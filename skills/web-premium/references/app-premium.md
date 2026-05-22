# Premium App / Dashboard Patterns

## Sidebar Navigation
```css
.sidebar {
  width: 260px;
  background: var(--color-ink-800);
  border-right: 1px solid var(--surface-glass-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-6) 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0.6rem var(--space-6);
  border-radius: var(--radius-md);
  margin: 0 var(--space-3);
  color: var(--color-ink-400);
  transition: background var(--transition-fast), color var(--transition-fast);
  font-size: var(--text-sm);
  font-weight: 500;
}

.nav-item:hover { background: rgba(255,255,255,0.05); color: var(--color-ink-200); }
.nav-item.active { background: var(--color-accent-muted); color: var(--color-accent); }
```

## Data Tables
- Subtle alternating row tint (`rgba(255,255,255,0.02)`)
- Sticky header with `backdrop-filter: blur`
- Sort indicators: chevron icons, only show on hover unless active
- Row hover: `background: rgba(255,255,255,0.04)`
- Action column: icon buttons, only visible on row hover

## Stat Cards / KPI Cards
```html
<div class="stat-card">
  <span class="stat-label">Total Revenue</span>
  <span class="stat-value">$48,295</span>
  <span class="stat-change stat-change--up">↑ 12.4% vs last month</span>
</div>
```
- Large value with display font
- Color-coded change indicator (green/red)
- Sparkline chart optional

## Modals
- Dark scrim: `rgba(0,0,0,0.7)` with `backdrop-filter: blur(4px)`
- Modal enters with `translateY(8px)` → `translateY(0)` + fade
- Max-width: 560px for simple, 800px for complex
- Close X top-right, ESC key support

## Form Inputs (Premium)
```css
.input-premium {
  background: var(--color-ink-800);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  padding: 0.7em 1em;
  color: var(--color-ink-50);
  font-size: var(--text-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
  width: 100%;
}

.input-premium:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}
```

## Toast Notifications
- Fixed bottom-right, stacks up
- Slide in from right, auto-dismiss with progress bar
- Icons: ✓ (success), ⚠ (warning), ✕ (error)
- Max 3 visible at once
