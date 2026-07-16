# Active Architecture

This document defines the currently supported production surface for courtney-driver.com.

Supported routes:
- /
- /brands.html
- /advisory/

## 1. Active routes and source files

- / -> index.html
- /brands.html -> brands.html
- /advisory/ -> advisory/index.html

## 2. Shared CSS and JS dependencies

Homepage and brands shared shell dependencies:
- assets/css/libs.css
- assets/css/app.css
- settings/config.js
- assets/js/app.js

Homepage-only additional runtime dependency:
- assets/js/particles.min.js

Advisory dependencies:
- advisory/assets/advisory.css
- advisory/assets/advisory-pdf.css
- advisory/assets/advisory.js
- advisory/courtney-driver-advisory.pdf

## 3. Navigation ownership and state model

Homepage and brands navigation owner:
- Runtime logic: assets/js/app.js
- State styling: assets/css/app.css
- Markup: index.html and brands.html

Mobile state model (single source of truth):
- State attribute: data-mobile-nav on .Navigation
- Valid values: closed, open
- ARIA mirror: aria-expanded on .Navigation__mobile-menu

Advisory navigation:
- Independent header/nav system in advisory/index.html + advisory/assets/advisory.css
- Does not use data-mobile-nav

## 4. Header and footer ownership

Homepage and brands:
- Header/nav markup owned by each page file
- Shared behavior and responsive logic owned by assets/js/app.js and assets/css/app.css
- Footer structure owned per page (same visual pattern)

Advisory:
- Header/footer owned by advisory/index.html and advisory/assets/advisory.css
- Brand links route to /

## 5. Homepage-specific behavior

- One-page section navigation to #Intro, #About, #Work
- Smooth scroll with active link tracking
- Intro atmospheric layer + particles runtime
- Preloader sequence uses settings/config.js timing values
- Includes brand logo cloud and homepage-specific inline style/script blocks

## 6. Brands-page-specific behavior

- Uses shared navigation shell from assets/js/app.js and assets/css/app.css
- Topbar/content layout is page-specific
- Work link protected by gateWorkAccess prompt behavior
- No particles runtime

## 7. Advisory architecture

- Separate static subsite under advisory/
- Distinct CSS/JS stack from homepage/brands
- Theme model stored via localStorage key advisory-theme
- Render mode uses query param render=pdf to force light/pdf behavior
- Advisory does not depend on legacy shell navigation classes

## 8. Advisory PDF generation flow

- advisory/index.html always loads advisory/assets/advisory-pdf.css
- advisory/assets/advisory.js normalizes download link to courtney-driver-advisory.pdf
- PDF render mode is activated by query parameter render=pdf
- Existing generated artifacts:
  - advisory/courtney-driver-advisory.pdf
  - advisory/courtney-driver-advisory-dark.pdf
  - advisory/courtney-driver-advisory-light.pdf

## 9. Contact and server flow

Server endpoint chain:
- send_email.php receives JSON payload
- send_email.php includes settings/config.php and functions.php
- functions.php sanitizes input, validates fields, formats message template, and calls mail()

Frontend config location:
- settings/config.js -> contactForm.mailScriptLocation = send_email.php

Note:
- Active supported pages currently use direct mailto links in header/footer.
- PHP mail endpoint remains part of the active server surface for contact-form integrations.

## 10. Deployment flow

Current repository state:
- No CI/CD pipeline files present (.github/workflows absent)
- No platform deployment manifests found (for example vercel.json, netlify.toml, Dockerfile)
- Production system is static-file serving plus optional PHP execution for send_email.php

Operational implication:
- Deployments are currently environment-driven/manual outside this repository.
- Route assumptions depend on serving advisory/index.html at /advisory/.

## 11. Source-of-truth rules

- Active route scope is only /, /brands.html, /advisory/.
- Homepage/brands mobile nav state source is only data-mobile-nav.
- aria-expanded must always mirror data-mobile-nav.
- Mobile menu visibility is controlled by CSS selectors, not JS inline style writes.
- Advisory remains an independent subsystem; do not couple it to legacy shell navigation runtime.

## 12. Known legacy constraints

- The repository contains many legacy root HTML pages still referencing shared global assets.
- assets/js/app.js is a compiled legacy runtime bundle and includes broad plugin code.
- assets/css/app.css contains legacy/global styles used by multiple historical pages.
- Root package-lock.json exists without a corresponding active root package manifest.

## 13. Files considered active

Route entry files:
- index.html
- brands.html
- advisory/index.html

Homepage/brands runtime and style assets:
- assets/css/libs.css
- assets/css/app.css
- assets/js/app.js
- assets/js/particles.min.js
- settings/config.js

Advisory runtime and style assets:
- advisory/assets/advisory.css
- advisory/assets/advisory-pdf.css
- advisory/assets/advisory.js
- advisory/courtney-driver-advisory.pdf

Server/contact files:
- send_email.php
- functions.php
- settings/config.php

## 14. Files considered legacy and archive candidates

Legacy page candidates:
- All other root-level HTML files except index.html and brands.html

Legacy directories or candidate archive groups:
- backup/
- templates/
- Documentation/
- resources/ (legacy build source surface)

Important safety note:
- Some legacy pages still reference active shared assets.
- Archive/move work must be dependency-audited before relocation of shared assets.

## 15. What future builders should not change casually

- data-mobile-nav state model and its synchronization contract with aria-expanded
- Shared navigation selectors and JS handlers in assets/css/app.css and assets/js/app.js
- Advisory theme/render flow (data-theme and render=pdf behavior)
- Advisory PDF filename and link normalization logic
- send_email.php -> settings/config.php -> functions.php server chain
- Route structure assumptions for /advisory/

## 16. Recommended next modernization phase

Suggested next phase (after stabilization):
1. Freeze active-shell contract in docs and add a lightweight regression checklist.
2. Isolate active assets into a minimal active bundle surface (without changing visuals).
3. Introduce automated smoke checks for active routes and navigation state behavior.
4. Create explicit deploy runbook in-repo (environments, server requirements, rollback).
5. Perform dependency-safe legacy archive pass once shared-asset coupling is mapped.
