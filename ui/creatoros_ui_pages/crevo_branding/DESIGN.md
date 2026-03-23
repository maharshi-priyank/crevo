# Design System Strategy: The Digital Atelier

## 1. Overview & Creative North Star
This design system is built on the philosophy of **"The Digital Atelier."** It treats the interface not as a rigid software grid, but as a curated editorial space where high-precision engineering (Linear/Vercel inspired) meets the soulful, artisanal energy of modern Bharat.

### Creative North Star: "Sovereign Sophistication"
We reject the "template" look by embracing **Intentional Asymmetry**. Our layouts should feel like a premium print magazine: generous whitespace, overlapping typographic elements, and a "Dark-to-Cream" narrative arc. We break the monotony of standard SaaS by using the `notoSerif` (Fraunces) for emotional storytelling and `plusJakartaSans` (DM Sans) for technical precision. 

**The Signature Shift:** We move from a deep, obsidian hero (`surface`) into high-contrast, warm-white sections (`secondary`). This transition isn't just a color change; it’s a psychological shift from "Deep Focus" to "Open Clarity."

---

## 2. Colors & Surface Logic
The palette is rooted in a "No-Line" philosophy. Structure is defined by tonal weight, never by strokes.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections.
*   **Transitioning:** Use the shift from `surface` (#0e0e10) to `secondary` (#e3e2e0) to mark major content chapters.
*   **Nesting:** Inside the dark theme, use `surface-container-low` for secondary information and `surface-container-highest` for interactive elements. The background *is* the boundary.

### Surface Hierarchy & Nesting
*   **Level 0 (Base):** `surface` (#0e0e10) — The canvas.
*   **Level 1 (Cards):** `surface-container-low` (#131315) — Subtle lift.
*   **Level 2 (Interaction):** `surface-container-high` (#1f1f22) — Hover states or focused modules.

### The "Glass & Gradient" Rule
To inject "Bold Bharat" energy into the "Calm Luxury" base:
*   **Electric Accents:** Use `primary` (#a8a4ff) as a glowing accent. For main CTAs, apply a subtle linear gradient from `primary_dim` to `primary` at a 135° angle to give the button "soul" rather than a flat plastic look.
*   **Product Previews:** Apply `backdrop-blur` (12px to 20px) using a semi-transparent `surface_variant` to create a "frosted glass" look that lets the underlying vibrant gradients or grain textures bleed through.

---

## 3. Typography: The Editorial Contrast
We use typography to balance "Old World" authority with "New World" tech.

*   **Emotional Headlines (`display-lg` to `headline-sm`):** Use **notoSerif**. This is our "Bharat" soul. It should be used for value propositions and creator-focused storytelling. Set these with tight letter-spacing (-0.02em) to maintain a premium feel.
*   **Technical Information (`title-lg` to `body-sm`):** Use **plusJakartaSans**. This provides the "Linear-inspired" precision. Use this for dashboard metrics, feature descriptions, and UI labels.
*   **The Hierarchy Play:** Never pair two fonts of the same weight. If the Noto Serif headline is SemiBold, the Plus Jakarta Sans sub-headline should be Regular or Light to create visual breathing room.

---

## 4. Elevation & Depth
In this system, depth is biological, not structural.

*   **The Layering Principle:** Achieve hierarchy by stacking. Place a `surface-container-lowest` (#000000) card on top of a `surface-container-low` (#131315) background. The subtle 2% shift in black creates a natural, sophisticated "sink" or "lift."
*   **Ambient Shadows:** For floating elements (like Nav or Tooltips), use a shadow with a `24px` to `48px` blur, set at 6% opacity. Use the `primary` color as the shadow tint on dark surfaces to create a subtle "inner glow" effect.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Navigation (The Horizon)
*   **Style:** Fixed at the top, `surface` background at 80% opacity with a heavy `backdrop-blur` (20px). 
*   **Interaction:** No bottom border. Use a subtle `surface-container-highest` highlight on hover for links.

### Buttons (The Bold CTA)
*   **Primary:** `rounded-xl` (1.5rem), using the `primary` to `primary_dim` gradient. 
*   **Text:** `title-sm` (plusJakartaSans), Bold, `on_primary`.
*   **Scale:** Use `padding-6` (2rem) for horizontal breath.

### Structured Feature Cards
*   **Forbid Dividers:** Use `spacing-8` (2.75rem) to separate internal card elements.
*   **Background:** `surface-container-low`.
*   **Transition:** On hover, transition the background to `surface-container-high` and scale the internal icon by 5%.

### Pricing Tables (Precision Grid)
*   **Logic:** The "Recommended" plan should be the only element using a `primary` ghost border (10% opacity). All other plans are defined by whitespace.
*   **Typography:** Use `display-sm` for the price point (notoSerif) to make the cost feel like a premium invitation rather than a transaction.

### Creator-Specific Components
*   **Revenue Chips:** Small `surface-container-highest` pills with `primary` text. Use for "Live" or "New" indicators.
*   **Grain Overlays:** Apply a 2% opacity noise texture to the `dark hero` section to break the digital perfection and give it a "paper" feel.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. For example, a headline might be offset by `spacing-10` while the body text stays on the grid.
*   **Do** use `primary` (#a8a4ff) sparingly. It is a laser, not a paint bucket.
*   **Do** embrace the "Cream" sections. They provide the "Calm" in "Calm Luxury."

### Don't
*   **Don't** use 100% black (#000000) for text. Use `on_surface` (#f9f5f8) for dark mode and `on_secondary` (#515250) for light mode.
*   **Don't** use sharp corners. Everything interactive must adhere to the `rounded-xl` (1.5rem) or `rounded-lg` (1rem) tokens.
*   **Don't** use standard "drop shadows." If it doesn't look like natural light through glass, it doesn't belong.