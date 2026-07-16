# Navigation System Reference

This document is the canonical source for the active site navigation system.

Scope covered:
- /
- /brands.html
- /advisory/ (separate advisory header system)

## Overall Navigation Architecture

There are two navigation systems in the active site:

1. Legacy shell navigation system (homepage + brands)
- Markup: .Navigation, .Navigation__bar, .Navigation__mobile-menu, .Navigation__navbar-nav
- Runtime controller: assets/js/app.js
- Mobile open state: data-mobile-nav attribute on .Navigation
- Visual state rules: assets/css/app.css

2. Advisory navigation system (advisory page only)
- Markup: .ad-header, .ad-nav, .theme-toggle, .ad-footer
- Runtime controller: advisory/assets/advisory.js (theme/render behavior)
- Separate from legacy shell nav; does not use data-mobile-nav

## Desktop Navigation Behavior (Homepage + Brands)

Desktop breakpoint: widths above 767px.

Behavior:
- Full nav list remains visible.
- Mobile menu button is hidden.
- Mobile overlay panel behavior is inactive.
- data-mobile-nav is still initialized to closed for deterministic state.

Scroll behavior:
- .Navigation--scrolled toggles based on section thresholds in assets/js/app.js.
- This controls bar background and vertical padding transitions.

## Mobile Navigation Behavior (Homepage + Brands)

Mobile breakpoint: widths at or below 767px.

Behavior:
- Hamburger control (.Navigation__mobile-menu) becomes visible.
- Nav links are shown in a fixed fullscreen panel (.Navigation__navbar-nav).
- Panel open/close is controlled only by data-mobile-nav on .Navigation.

Panel closed:
- visibility: hidden
- opacity: 0
- pointer-events: none
- transform: translateY(-104%)

Panel open:
- visibility: visible
- opacity: 1
- pointer-events: auto
- transform: translateY(0)

## Single Source of Truth: data-mobile-nav

State owner:
- Attribute on .Navigation: data-mobile-nav

Valid values:
- closed
- open

Rules:
- JS writes state only through syncMobileMenuState(isOpen).
- CSS reads state through selectors scoped to .Navigation[data-mobile-nav="open"].
- No mobile panel inline style writes are used.
- No menu-state class variants are used as state sources.

## State Transitions

Initialization:
- On DOM ready, .Navigation is initialized to data-mobile-nav="closed".

Open:
- Trigger: click or keyboard activation on .Navigation__mobile-menu.
- Result: data-mobile-nav="open".

Close:
- Trigger: click a nav link in .Navigation__navbar-nav.
- Trigger: Escape key.
- Trigger: breakpoint transition between mobile and desktop.
- Trigger: orientationchange.
- Trigger: media query change listener for max-width: 767px.
- Result: data-mobile-nav="closed".

Refresh:
- Re-initializes to closed.

## aria-expanded Synchronization

Accessibility sync behavior:
- aria-expanded is set on .Navigation__mobile-menu every time syncMobileMenuState runs.
- open -> aria-expanded="true"
- closed -> aria-expanded="false"

Additional accessibility attributes set on initialization:
- role="button"
- tabindex="0"
- aria-label="Toggle navigation menu"

## Breakpoint Behavior

Breakpoint source:
- window.matchMedia("(max-width: 767px)")

Behavior:
- Above 767px: desktop nav visible, mobile menu hidden, mobile state forced to closed on viewport mode transitions.
- At or below 767px: mobile menu button and overlay panel behavior active.

## Resize and Orientation Behavior

Resize handling:
- On resize, if viewport mode changes (mobile <-> desktop), state is reset to closed.

Orientation handling:
- orientationchange forces state to closed.

Media query listener:
- matchMedia change listener also forces state to closed and updates viewport mode tracking.

Purpose:
- Prevent stale open state across rotate and responsive-mode transitions.

## Keyboard Support

Supported keys:
- Enter on .Navigation__mobile-menu: toggles menu
- Space on .Navigation__mobile-menu: toggles menu
- Escape on document: closes menu

## Event Lifecycle (Homepage + Brands)

Primary lifecycle order:
1. DOM ready block in assets/js/app.js initializes preloader fallback and nav state.
2. setNavbar() runs immediately, then on scroll and resize.
3. Mobile menu attributes are initialized.
4. Interaction handlers are attached:
- click on mobile button
- keydown on mobile button
- click on nav links
- smooth scroll page-scroll handler
- resize, orientationchange, media query change
- document keydown (Escape)

## CSS Selectors Involved

State selectors:
- .Navigation[data-mobile-nav="open"] .Navigation__mobile-menu span:nth-of-type(1)
- .Navigation[data-mobile-nav="open"] .Navigation__mobile-menu span:nth-of-type(2)
- .Navigation[data-mobile-nav="open"] .Navigation__mobile-menu span:nth-of-type(3)
- .Navigation[data-mobile-nav="open"] .Navigation__navbar-nav

Base mobile selectors:
- .Navigation__mobile-menu
- .Navigation__navbar-nav
- .Navigation__bar
- .Navigation--scrolled .Navigation__bar
- .Navigation:not(.Navigation--scrolled) .Navigation__bar

Z-index stabilization selectors:
- .Navigation__bar (mobile z-index above panel)
- .Navigation__mobile-menu (mobile z-index above panel)

## JS Entry Points Involved

File:
- assets/js/app.js

Functions and handlers:
- syncMobileMenuState(isOpen)
- setNavbar()
- scrollFromTop()
- menuChangeOnScroll(event)
- click handler for .Navigation__mobile-menu
- keydown handler for .Navigation__mobile-menu (Enter/Space)
- click handler for .Navigation__navbar-nav a
- keydown handler on document (Escape)
- resize handler with breakpoint-mode reset
- orientationchange handler
- matchMedia("(max-width: 767px)") change listener

## Files That Own Navigation

Homepage + Brands navigation:
- index.html (navigation markup)
- brands.html (navigation markup)
- assets/css/app.css (navigation styles and mobile state selectors)
- assets/js/app.js (navigation state and event lifecycle)

Advisory navigation/header/footer:
- advisory/index.html
- advisory/assets/advisory.css
- advisory/assets/advisory.js

## Future Maintenance Notes

Do:
- Keep data-mobile-nav as the only mobile open/closed state source.
- Route all state updates through syncMobileMenuState.
- Keep aria-expanded synchronized inside the same state function.
- Keep mobile panel state in CSS selectors, not inline style writes.
- Reset state on viewport mode changes to avoid stale state.

Do not:
- Reintroduce class-based parallel state systems (for example --mobile-active, --active as state owners).
- Reintroduce JS inline style writes for mobile panel visibility.
- Add separate page-level mobile-menu logic in index.html or brands.html.

Validation checklist after any nav change:
- Open/close at 390, 430, 768 widths.
- Link click closes menu.
- Escape closes menu.
- Rotate portrait/landscape does not preserve stale open state.
- Resize mobile -> desktop -> mobile resets cleanly.
- Refresh while open resets to closed.
- aria-expanded always matches data-mobile-nav.
