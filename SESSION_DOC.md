# Meter Network Cost Calculator — Session Context
**Paste this as your first message in a new chat to resume instantly. Everything is live and automated.**

---

## What's Live

| URL | Status |
|-----|--------|
| https://meter.nexgensecurity.io | ✅ Calculator live |
| https://meter.nexgensecurity.io/generate | ✅ Link generator live |

---

## Infrastructure

| Service | Details |
|---------|--------|
| GitHub repo | `nexgenideas-stack/meter` (main branch) |
| Vercel project | `metercalculator` — auto-deploys on every push to main |
| Vercel project ID | `prj_muRfJQcSqoRnGktbusIb78TKxMXq` |
| Vercel team ID | `team_Q3cFuW47SivtqK9nfSaHVdjz` |
| GitHub → Claude | Zapier `GitHubCLIAPI` · account: `nexgenideas-stack` |
| Master CRM Sheet | `1BSGbR7Byax_srRkmAIDfltYRlw-kNeeObQCpDONwr2Y` |
| Apps Script URL | `https://script.google.com/macros/s/AKfycbyE8YxBmQi_1NxXKIyQjNEAChF3u8iG-0oQQ-Sn1SOmWGpgfdhPywzhqQ9MpL1Na6sv2A/exec` |
| Apps Script API key | `meter_ron_2026` |

**Deployment workflow (fully automated):**
Claude edits file → Zapier GitHub push → Vercel auto-deploys → live in ~30 seconds.

**To push a file from Claude:**
1. `get_file_contents` (GitHubCLIAPI) → get current SHA
2. `create_file` (GitHubCLIAPI) → pass SHA + new content + commit message

---

## Repo Structure

```
nexgenideas-stack/meter/
  index.html          ← calculator
  generate/
    index.html        ← link generator
  vercel.json         ← routing (rewrite rule for /generate)
  SESSION_DOC.md      ← this file
```

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/generate", "destination": "/generate/index.html" }
  ]
}
```
Note: `cleanUrls` alone does NOT fix subdirectory routing on Vercel. Must use explicit rewrite.

---

## Design System

```css
:root {
  --green-dark:  #085041;
  --green-mid:   #0F6E56;
  --green:       #1D9E75;
  --green-light: #9FE1CB;
  --green-pale:  #E1F5EE;
  --amber:       #EF9F27;
  --amber-pale:  #FEF3E2;
  --gray-900:    #111110;
  --gray-700:    #3a3a38;
  --gray-500:    #888780;
  --gray-300:    #d3d1c7;
  --gray-100:    #f5f4f0;
  --gray-50:     #fafaf8;
  --white:       #ffffff;
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   14px;
}
```
Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`

---

## Calculator Features

### Pricing Constants
```javascript
MERAKI_HW      = 4200      // $/site, 3yr refresh cycle
MERAKI_LIC_YR  = 1140      // $/site/yr
METER_MO       = 480       // $/site/mo (locations mode)
METER_SQFT_YR  = 1.00      // $/sq ft/yr (sqft mode)
SQFT_PER_LOC   = 5000      // sq ft → derived location count for Cisco side
MSP_BASE       = 620000    // $/yr for 50 locations
MSP_BASE_LOCS  = 50
DOWNTIME_RATE  = 240       // $/hr per location
OUTAGES_PER    = 0.8
OUTAGE_MINS    = 35
MSP_MULTIPLIER = 1.3       // Traditional MSP = Cisco OpEx × 1.3
```

### Mode Switching
Two tabs: Locations / Square footage. State: `var currentMode`. Toggle: `setMode()`. Sqft uses `$1.00/sq ft/yr` for Meter; derives location count as `sqft / 5000` for Cisco.

### URL Param Personalization
Params: `company`, `locs`, `sqft`, `mode`, `yrs`

Example: `https://meter.nexgensecurity.io/?company=Heartland+Dental&locs=450&yrs=5`

When `company` present: green banner appears, hero h1 and page title update, `×` dismisses.

### Tooltips (13 total)
Structure: `.tip` > `.tip-icon` + `.tip-box` as immediate siblings. Click-toggle JS for mobile. Keyboard accessible (Enter/Space/Escape).

### Contact Strip
Ron Andrews · Meter Partner · 202-441-7683 only. No email, no LinkedIn, no website links.

### Azure Section
Blue left-border (#0078D4). MACC tooltip. No clickable links.

---

## Link Generator Features

```javascript
// Config block at top of script:
var LOOKUP_URL = 'https://script.google.com/macros/s/AKfycbyE8YxBmQi_1NxXKIyQjNEAChF3u8iG-0oQQ-Sn1SOmWGpgfdhPywzhqQ9MpL1Na6sv2A/exec';
var API_KEY    = 'meter_ron_2026';
var BASE_URL   = 'https://meter.nexgensecurity.io';
```

- Smart search: company name OR contact email (extracts domain slug from email)
- Debounced CRM lookup (280ms), dropdown shows up to 8 results
- Dropdown shows: name, Tier, vertical, state, locsDisplay (original text from sheet)
- Select result → fills company name + location count (parsed number) + green CRM badge
- Keyboard nav: ↑↓, Enter to select, Escape to close
- `mousedown` on dropdown items (not `click`) — blur fires before click otherwise
- Mode toggle: Locations / Sq footage
- Years toggle: 3yr / 5yr
- Live URL preview, copy button, open preview button
- Google Sheet bulk formula with one-click copy
- Setup notice (amber) hides automatically when LOOKUP_URL is set

---

## Apps Script (CRM Lookup)

Auto-detects columns by header name. Accepted headers:

| Field | Accepted |
|-------|----------|
| Company | Account Name, Company Name, Company, Name, Account |
| Locations | Locations, # Locations, Location Count, Est. Locations |
| Tier | Tier, Account Tier, Priority Tier |
| State | HQ State, State, HQ |
| Vertical | Vertical, Industry, Segment, Category |

`parseLocs()` handles messy text — strips commas/parens, extracts first number:
- `"(1000+)"` → 1000
- `"10,000+ rental locations"` → 10000

Returns both `locs` (parsed number, used in URL) and `locsDisplay` (original text, shown in dropdown).

**Migration functions** (run from Apps Script editor, not endpoint):
- `previewLocationMigration()` — dry run
- `runLocationMigration()` — reads Locations from Master Contacts tab, writes to Master Account List col I, matches by Company (case-insensitive)

---

## Critical Rules (12)

### 1. Tooltip DOM — Most Critical
`.tip-box` must be an **immediate next sibling** of `.tip-icon`. CSS `+` selector breaks if icon is wrapped.
```html
<!-- CORRECT -->
<span class="tip">
  <strong>Label</strong>
  <i class="tip-icon" tabindex="0">?</i>
  <span class="tip-box">Tooltip text.</span>
</span>

<!-- BREAKS — icon inside strong -->
<span class="tip">
  <strong>Label <i class="tip-icon">?</i></strong>
  <span class="tip-box">Tooltip text.</span>
</span>
```

### 2. str_replace Must Be Unique
Must appear exactly once. Include surrounding lines for common strings like `update()`.

### 3. Dropdown: mousedown Not click
`blur` fires before `click`, closes dropdown before selection registers.
```javascript
item.addEventListener('mousedown', function(e) {
  e.preventDefault(); // prevents blur
  selectResult(r);
});
input.addEventListener('blur', function() {
  setTimeout(closeDropdown, 180); // delay so mousedown fires first
});
```

### 4. URL Param Decoding
```javascript
var name = decodeURIComponent(raw.replace(/\+/g, ' '));
```

### 5. Safe DOM — No innerHTML for User Input
```javascript
var em = document.createElement('em');
em.textContent = userInput; // textContent escapes HTML
```

### 6. Cards Need overflow: visible
```css
.card { overflow: visible; } /* tooltips escape the card boundary */
```

### 7. Slider Cursors
```css
input[type="range"]        { cursor: grab; }
input[type="range"]:active { cursor: grabbing; }
/* Apply to element AND ::webkit-slider-thumb */
```

### 8. Vercel Subdirectory Routing
`cleanUrls: true` is NOT enough. Needs explicit rewrite in vercel.json.

### 9. Zapier GitHub Push — SHA Required
Always get SHA before updating an existing file:
1. `execute_zapier_read_action` → `get_file_contents` → capture `sha`
2. `execute_zapier_write_action` → `create_file` → pass `sha` + content + message
Selected API: `GitHubCLIAPI`

### 10. Apps Script: Save ≠ Deploy
Code changes need **Deploy → New deployment**. Old URL stays frozen. After new deploy, update `LOOKUP_URL` in link generator and push to GitHub.

### 11. DNS Propagation
After Vercel domain moves, wait 5–30 min. Test via direct `.vercel.app` URL in incognito. Claude's fetch tool may show stale results longer than a browser.

### 12. Location Parsing
Sheet values are often text. Use `parseLocs()` — strip commas/parens, match first digit sequence. Return both `locs` (number) for URL params and `locsDisplay` (original) for dropdown UI.

---

## V2 Roadmap (Prioritized)

1. **ROI payback period** — "Break-even in X months" in savings box. Math already exists.
2. **Vertical selector** — DSO / QSR / Logistics / Retail with vertical-specific benchmarks.
3. **Email capture → CRM** — wire form to Zapier → Master Sheet, auto-create contact with location count + vertical.
4. **Cisco EA expiration input** — urgency framing changes based on proximity to renewal.
5. **Phased migration model** — "all at once" vs "25%/year" rolling savings curve for enterprise deals.

---

## Quick Reference

| Item | Value |
|------|-------|
| Calculator | https://meter.nexgensecurity.io |
| Link Generator | https://meter.nexgensecurity.io/generate |
| GitHub repo | nexgenideas-stack/meter |
| Vercel project ID | prj_muRfJQcSqoRnGktbusIb78TKxMXq |
| Vercel team ID | team_Q3cFuW47SivtqK9nfSaHVdjz |
| CRM Sheet ID | 1BSGbR7Byax_srRkmAIDfltYRlw-kNeeObQCpDONwr2Y |
| Apps Script URL | https://script.google.com/macros/s/AKfycbyE8YxBmQi_1NxXKIyQjNEAChF3u8iG-0oQQ-Sn1SOmWGpgfdhPywzhqQ9MpL1Na6sv2A/exec |
| Apps Script API key | meter_ron_2026 |
| Zapier GitHub | GitHubCLIAPI · nexgenideas-stack |