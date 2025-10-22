# Design Guidelines: AI Google Form Filler

## Design Approach

**Selected System**: Hybrid approach combining Linear's clean aesthetics with Material Design's robust form components and feedback systems.

**Rationale**: This is a productivity tool requiring efficiency, clear feedback, and professional credibility. The design prioritizes usability over visual flourish while maintaining a modern, trustworthy appearance.

**Core Principles**:
- Clarity over decoration
- Immediate feedback for all actions
- Progressive disclosure (show complexity only when needed)
- Professional credibility through clean execution

---

## Color Palette

**Light Mode**:
- Background: 0 0% 100% (pure white)
- Surface: 240 5% 96% (light gray cards)
- Border: 240 6% 90%
- Text Primary: 240 10% 10%
- Text Secondary: 240 5% 45%
- Primary: 262 83% 58% (modern purple, trust + technology)
- Primary Hover: 262 83% 52%
- Success: 142 71% 45%
- Error: 0 84% 60%
- Warning: 38 92% 50%

**Dark Mode**:
- Background: 240 10% 8%
- Surface: 240 8% 12%
- Border: 240 6% 20%
- Text Primary: 0 0% 98%
- Text Secondary: 240 5% 65%
- Primary: 262 83% 65%
- Primary Hover: 262 83% 70%
- Success: 142 71% 55%
- Error: 0 84% 65%
- Warning: 38 92% 55%

---

## Typography

**Font Families**:
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for form URLs, technical data)

**Scale**:
- Hero/H1: text-4xl font-bold (36px)
- H2: text-2xl font-semibold (24px)
- H3: text-xl font-semibold (20px)
- Body: text-base (16px)
- Small/Caption: text-sm (14px)
- Tiny/Label: text-xs (12px)

**Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm.
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card padding: p-6
- Button padding: px-6 py-3

**Grid System**:
- Max width container: max-w-6xl mx-auto
- Form inputs: max-w-2xl for optimal readability
- Results grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation (Web App)
- Clean top bar with logo left, dark mode toggle right
- Height: h-16
- Background: Surface color with bottom border
- No traditional hero section - jump straight to utility

### Main Interface Layout
**Structure**: Two-column adaptive layout
- Left Column (max-w-md): Input configuration panel (sticky on desktop)
  - Form URL input with validation
  - Number of responses selector (stepper control)
  - Optional user data fields (collapsible accordion)
  - Primary CTA button
- Right Column (flex-1): Live preview/results area
  - Empty state with subtle illustration placeholder
  - Progress view during submission
  - Results cards after completion

### Form Controls
**Input Fields**:
- Border: 2px solid border-color
- Focus: Ring-2 ring-primary
- Padding: px-4 py-3
- Rounded: rounded-lg
- Background: Transparent with surface on focus
- Labels: text-sm font-medium mb-2
- Helper text: text-xs text-secondary mt-1

**Buttons**:
- Primary: bg-primary text-white rounded-lg px-6 py-3 font-medium
- Secondary: border-2 border-border bg-transparent
- Icon buttons: p-2 rounded-md
- States: Hover lifts slightly (transform), disabled at 50% opacity

**Number Stepper**:
- Horizontal layout with minus/plus buttons
- Center display of current value (text-2xl font-bold)
- Buttons: w-10 h-10 rounded-lg border-2

### Progress Tracking
**Progress Bar**:
- Height: h-2
- Background: surface color
- Fill: bg-primary with transition-all duration-300
- Container: rounded-full overflow-hidden
- Label above: "Filling 3 of 10 responses..."

**Loading States**:
- Spinner: Circular with primary color
- Skeleton loaders for result cards
- Pulse animation on loading elements

### Results Display
**Success Cards**:
- Grid layout: grid gap-4
- Card structure:
  - Status indicator (colored bar on left edge, 4px width)
  - Response number badge (top right)
  - Timestamp
  - Question preview (first 3 questions shown)
  - View details link
- Hover: Subtle lift with shadow increase

**Summary Stats**:
- Horizontal stat cards above results grid
- Large numbers (text-3xl font-bold)
- Icon + label + value layout
- Success rate percentage with visual indicator

### Error Handling
**Toast Notifications**:
- Position: fixed top-4 right-4
- Auto-dismiss after 5s
- Slide-in animation from right
- Icon (error/success/warning) + message + close button
- Max-width: max-w-md
- Shadow: shadow-lg

**Inline Errors**:
- Below form inputs
- Red text (error color) with warning icon
- text-sm

---

## Chrome Extension Popup

**Dimensions**: 400px width × 600px height

**Layout**: Single column, compact spacing
- Header: Extension name + version (h-12)
- Same form controls as web app but tighter spacing (p-4 instead of p-6)
- Simplified results view (list instead of grid)
- All interactions work within popup constraints

**Adjustments**:
- Reduce font sizes by one step (text-base → text-sm)
- Tighter spacing primitives (4, 6 instead of 6, 8)
- Collapsible sections to save vertical space

---

## Iconography

**Icon Library**: Heroicons (via CDN)
- UI icons: 20px (outline style)
- Feature icons: 24px (solid style for emphasis)

**Key Icons**:
- Link/URL: LinkIcon
- Settings/Config: CogIcon
- Success: CheckCircleIcon
- Error: XCircleIcon
- Progress: ClockIcon
- Download: ArrowDownTrayIcon

---

## Animations

**Minimal, purposeful animations only**:
- Button hover: transform scale-105 (subtle lift)
- Card hover: shadow transition
- Progress bar: smooth width transition (duration-300)
- Toast: slide-in-right animation
- Loading: rotate animation for spinners
- **No** scroll-triggered animations
- **No** page transitions

---

## Images

**Hero Section**: No traditional hero image. This is a utility-first interface.

**Empty States**:
- Simple illustration for "no results yet" state
- Use subtle, line-art style illustration (can source from Undraw or similar)
- Placement: Center of right column before any submissions
- Size: max-w-xs
- Description: Illustration of a form with checkmarks and AI sparkles, conveying automation and completion

**Chrome Extension Icon**:
- 128×128px icon needed
- Design: Stylized "AI" letters or form with automation symbol
- Colors: Primary purple with white/light accent

---

## Responsive Behavior

**Breakpoints**:
- Mobile: Single column, form inputs stack
- Tablet (md:): Start two-column layout
- Desktop (lg:): Full two-column with sticky sidebar

**Mobile Optimizations**:
- Reduce padding to p-4
- Full-width buttons
- Collapsible advanced options
- Results switch to single column list

---

## Accessibility

- All form inputs have associated labels
- ARIA labels for icon-only buttons
- Focus indicators (ring-2) on all interactive elements
- Sufficient color contrast (WCAG AA minimum)
- Dark mode maintains same contrast ratios
- Keyboard navigation support throughout