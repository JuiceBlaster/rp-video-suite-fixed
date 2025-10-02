# RP Video Suite: UI Design Specification

## Design Philosophy

The RP Video Suite UI follows an **Apple-inspired "liquid glass" aesthetic** with a dark theme. This design language emphasizes:

- **Elegance and Simplicity**: Clean layouts with focused content areas
- **Depth and Dimension**: Through the use of transparency and blur effects
- **Subtle Motion**: Smooth transitions and micro-interactions
- **Professional Appearance**: Suitable for creative professionals

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Pure Black | `#000000` | Main background |
| Green | `#10B981` | Primary accent, buttons, active states |
| White | `#FFFFFF` | Primary text, icons |

### Neutral Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Neutral 900 | `#171717` | Card backgrounds, secondary surfaces |
| Neutral 800 | `#262626` | Borders, dividers, hover states |
| Neutral 700 | `#404040` | Input backgrounds, tertiary elements |
| Neutral 500 | `#737373` | Secondary text, icons |
| Neutral 400 | `#a3a3a3` | Placeholder text, disabled states |

### Transparency and Blur

| Element | Background | Blur Amount |
|---------|------------|-------------|
| Header | `rgba(0, 0, 0, 0.9)` | `backdrop-blur-xl` (12px) |
| Cards | `rgba(23, 23, 23, 0.8)` | `backdrop-blur-md` (6px) |
| Modals | `rgba(0, 0, 0, 0.75)` | `backdrop-blur-xl` (12px) |
| Tooltips | `rgba(23, 23, 23, 0.9)` | `backdrop-blur-sm` (4px) |

## Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji";
```

### Type Scale

| Element | Size | Weight | Line Height | Tracking |
|---------|------|--------|-------------|----------|
| H1 | 1.5rem (24px) | 600 | 1.2 | -0.02em |
| H2 | 1.25rem (20px) | 600 | 1.2 | -0.01em |
| H3 | 1.125rem (18px) | 600 | 1.3 | -0.01em |
| Body | 1rem (16px) | 400 | 1.5 | normal |
| Small | 0.875rem (14px) | 400 | 1.5 | normal |
| XSmall | 0.75rem (12px) | 400 | 1.5 | 0.02em |

## Component Specifications

### 1. Header

![Header Component](https://placeholder.com/header-component)

**Specifications:**
- Height: 64px
- Background: Black with 90% opacity and backdrop blur
- Border bottom: 1px solid `#262626`
- Logo area: 32px square with 16px margin
- Title: H2 size, semibold weight
- Subtitle: XSmall size, neutral-500 color
- AI status indicator: 8px green dot with pulse animation
- Settings button: 40px square with hover state

### 2. Module Card

![Module Card Component](https://placeholder.com/module-card)

**Specifications:**
- Border radius: 10px
- Background: Neutral-900 with 80% opacity
- Border: 1px solid `#262626`
- Padding: 16px
- Header height: 56px
- Icon container: 40px square, centered
- Title: H3 size, semibold weight
- Subtitle: Small size, neutral-500 color
- Expand/collapse animation: 300ms ease-in-out
- Disabled state: 50% opacity, no hover effects

**States:**
- Default: Standard appearance
- Hover: Slight brightness increase
- Active/Selected: Green left border (3px)
- Disabled: Reduced opacity (0.5)
- Expanded: Content area visible
- Collapsed: Content area hidden

### 3. Button

![Button Component](https://placeholder.com/button)

**Specifications:**
- Height: 40px (standard), 32px (small)
- Border radius: 6px
- Background: Green (`#10B981`)
- Text color: White
- Font weight: Medium (500)
- Padding: 8px 16px (horizontal), 4px 8px (small)
- Icon spacing: 8px from text

**Variants:**
- Primary: Green background, white text
- Secondary: Transparent background, green border, green text
- Ghost: Transparent background, white text, no border
- Danger: Red background, white text

**States:**
- Default: Standard appearance
- Hover: Brightness increase (110%)
- Active: Brightness decrease (90%)
- Disabled: Reduced opacity (0.5), no hover effects
- Loading: Spinner animation, reduced opacity

### 4. Input Field

![Input Field Component](https://placeholder.com/input)

**Specifications:**
- Height: 40px
- Border radius: 6px
- Background: Neutral-800
- Border: 1px solid Neutral-700
- Text color: White
- Placeholder color: Neutral-500
- Padding: 8px 12px
- Focus ring: 2px green glow

**States:**
- Default: Standard appearance
- Focus: Green border, subtle glow effect
- Error: Red border, error message below
- Disabled: Reduced opacity (0.5)

### 5. Media Card

![Media Card Component](https://placeholder.com/media-card)

**Specifications:**
- Aspect ratio: Maintains original image ratio
- Border radius: 8px
- Border: 1px solid Neutral-800
- Overlay: Gradient from transparent to black (bottom 30%)
- Selection indicator: Green checkmark in top-right corner
- Caption: Small text size, white color, bottom-left position

**States:**
- Default: Standard appearance
- Hover: Slight scale increase (102%), brighter border
- Selected: Green border, checkmark visible
- Dragging: Scale increase (105%), drop shadow

### 6. Timeline Interface

![Timeline Interface](https://placeholder.com/timeline)

**Specifications:**
- Track height: 80px
- Clip height: 64px
- Border radius (clips): 4px
- Time markers: 2px tall ticks, 16px spacing
- Playhead: 2px wide red line
- Zoom controls: +/- buttons in bottom right

**Interactions:**
- Drag clips to reposition
- Resize clips from edges
- Click to select
- Double-click to preview
- Scroll to navigate timeline
- Ctrl+scroll to zoom

## Layout Specifications

### Grid System

- Base unit: 4px
- Spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- Container max width: 1280px
- Columns: 12-column grid
- Gutters: 24px
- Margins: 24px (desktop), 16px (tablet), 8px (mobile)

### Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| xs | < 640px | Mobile portrait |
| sm | ≥ 640px | Mobile landscape |
| md | ≥ 768px | Tablet portrait |
| lg | ≥ 1024px | Tablet landscape / small desktop |
| xl | ≥ 1280px | Desktop |
| 2xl | ≥ 1536px | Large desktop |

### Spacing

- Content padding: 24px
- Section spacing: 24px
- Card internal padding: 16px
- Button padding: 8px 16px
- Form field spacing: 16px

## Animation and Motion

### Transitions

- Duration: 200ms (fast), 300ms (standard), 500ms (emphasis)
- Easing: ease-in-out (standard), ease-out (entrances), ease-in (exits)
- Properties: opacity, transform, background-color, border-color

### Micro-interactions

- Button hover: Subtle scale (102%) and brightness increase
- Card expansion: Smooth height transition
- Selection: Fade in checkmark or indicator
- Status changes: Fade between states
- Notifications: Slide in from edge, fade out

### Loading States

- Spinner: Circular animation, green color
- Pulse: Opacity animation (100% to 50%)
- Progress bar: Linear fill animation
- Skeleton screens: Gradient animation for content loading

## Accessibility Considerations

- Color contrast: Minimum 4.5:1 for text, 3:1 for UI elements
- Focus indicators: Visible outlines on keyboard focus
- Text sizing: Minimum 14px for body text
- Touch targets: Minimum 44px × 44px
- Screen reader support: Proper ARIA labels and roles
- Keyboard navigation: Logical tab order and shortcuts

## Implementation Notes

### CSS Variables

```css
:root {
  /* Colors */
  --color-black: #000000;
  --color-green: #10B981;
  --color-white: #FFFFFF;
  --color-neutral-900: #171717;
  --color-neutral-800: #262626;
  --color-neutral-700: #404040;
  --color-neutral-500: #737373;
  --color-neutral-400: #a3a3a3;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Blur */
  --blur-sm: 4px;
  --blur-md: 6px;
  --blur-lg: 12px;
  
  /* Transitions */
  --transition-fast: 200ms ease-in-out;
  --transition-standard: 300ms ease-in-out;
  --transition-emphasis: 500ms ease-in-out;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        black: '#000000',
        green: {
          500: '#10B981',
        },
        neutral: {
          400: '#a3a3a3',
          500: '#737373',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '12px',
        xl: '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

## UI Component Examples

### Module Card Implementation

```jsx
function ModuleCard({ 
  id, 
  title, 
  subtitle, 
  icon, 
  expanded, 
  onToggle, 
  disabled = false,
  badge,
  accent = false,
  children 
}) {
  return (
    <div 
      className={`
        rounded-lg border border-neutral-800 bg-neutral-900/80 backdrop-blur-md
        transition-all duration-300 ease-in-out overflow-hidden
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${accent ? 'border-l-[3px] border-l-green-500' : ''}
      `}
    >
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={disabled ? undefined : onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-neutral-500">{subtitle}</p>
          </div>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-500 rounded-full ml-2">
              {badge}
            </span>
          )}
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-colors">
          <ChevronDown 
            size={18} 
            className={`text-neutral-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>
      
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 pt-0 border-t border-neutral-800">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Button Implementation

```jsx
function Button({
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  icon,
  children,
  ...props
}) {
  const baseClasses = "font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-500/50";
  
  const variantClasses = {
    primary: "bg-green-500 hover:brightness-110 active:brightness-90 text-white",
    secondary: "bg-transparent border border-green-500 text-green-500 hover:bg-green-500/10",
    ghost: "bg-transparent hover:bg-white/10 text-white",
    danger: "bg-red-500 hover:brightness-110 active:brightness-90 text-white"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    small: "h-8 px-2 py-1 text-sm",
    large: "h-12 px-6 py-3 text-lg"
  };
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${icon ? 'inline-flex items-center' : ''}
  `;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          <Spinner size={size === 'small' ? 14 : 18} />
        </span>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
```

## Design Assets

All design assets should follow these specifications to maintain consistency across the application. The liquid glass aesthetic is achieved through careful use of transparency, blur effects, and subtle borders.

---

This UI design specification provides a comprehensive guide for implementing the RP Video Suite's visual design. It ensures consistency across all components and screens while maintaining the Apple-inspired liquid glass aesthetic.
