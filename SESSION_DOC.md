# Meter Network Cost Calculator — Full Session Context
**Use this as your opening message in a new chat to resume work instantly.**

---

## Project Overview

Ron Andrews, Meter Partner (202-441-7683) runs an outbound enterprise sales engine targeting multi-location organizations for Meter's Network-as-a-Service offering. This calculator is his primary digital sales asset.

**Live URLs:**
- Calculator: https://meter.nexgensecurity.io
- Link Generator: https://meter.nexgensecurity.io/generate

**Stack:** Vanilla HTML/CSS/JS · GitHub → Vercel auto-deploy · Google Apps Script CRM backend

---

## Infrastructure

| Service | Details |
|---------|--------|
| GitHub repo | `nexgenideas-stack/meter` (main branch) |
| Vercel project | `metercalculator` · auto-deploys on every push to main |
| Vercel team | `jason-sams-projects` |
| GitHub → Claude | Connected via Zapier (GitHubCLIAPI, connection: nexgenideas-stack) |
| Master CRM Sheet | `1BSGbR7Byax_srRkmAIDfltYRlw-kNeeObQCpDONwr2Y` |
| Apps Script endpoint | `https://script.google.com/macros/s/AKfycbyE8YxBmQi_1NxXKIyQjNEAChF3u8iG-0oQQ-Sn1SOmWGpgfdhPywzhqQ9MpL1Na6sv2A/exec` |
| Apps Script API key | `meter_ron_2026` |

**Deployment workflow (fully automated):**
Claude edits file → Zapier GitHub push → Vercel auto-deploys → live in ~30 seconds.

To push a file: use Zapier GitHubCLIAPI `create_file` action. Always get the current file SHA first using `get_file_contents` before updating an existing file.

---

## Repo File Structure

```
nexgenideas-stack/meter/
  index.html              ← calculator
  generate/
    index.html            ← link generator
  vercel.json             ← routing config
  SESSION_DOC.md          ← this file
```

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/generate", "destination": "/generate/index.html" }
  ]
}
```

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

## Calculator Pricing Constants

```javascript
MERAKI_HW      = 4200      // $/site, 3yr refresh
MERAKI_LIC_YR  = 1140      // $/site/yr
METER_MO       = 480       // $/site/mo (locations mode)
METER_SQFT_YR  = 1.00      // $/sq ft/yr (sqft mode)
SQFT_PER_LOC   = 5000      // sq ft per location for Cisco side
MSP_BASE       = 620000    // $/yr for 50 locations
MSP_BASE_LOCS  = 50
DOWNTIME_RATE  = 240       // $/hr per location
OUTAGES_PER    = 0.8
OUTAGE_MINS    = 35
MSP_MULTIPLIER = 1.3
```

---

## Link Generator Config

```javascript
var LOOKUP_URL = 'https://script.google.com/macros/s/AKfycbyE8YxBmQi_1NxXKIyQjNEAChF3u8iG-0oQQ-Sn1SOmWGpgfdhPywzhqQ9MpL1Na6sv2A/exec';
var API_KEY    = 'meter_ron_2026';
var BASE_URL   = 'https://meter.nexgensecurity.io';
```

---

## Critical Rules

### 1. Tooltip DOM Structure
`.tip-box` must be an immediate next sibling of `.tip-icon`. The CSS `+` selector breaks if anything wraps the icon.

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
Must appear exactly once in the file. Include surrounding lines for common strings like `update()`.

### 3. Dropdown Items Use mousedown Not click
`blur` fires before `click` and closes dropdown before selection registers.
```javascript
item.addEventListener('mousedown', function(e) {
  e.preventDefault();
  selectResult(r);
});
input.addEventListener('blur', function() {
  setTimeout(closeDropdown, 180);
});
```

### 4. URL Param Decoding
```javascript
var name = decodeURIComponent(raw.replace(/\+/g, ' '));
```

### 5. Safe DOM for User Input
```javascript
var em = document.createElement('em');
em.textContent = userSuppliedName; // never innerHTML
```

### 6. Cards Need overflow: visible
```css
.card { overflow: visible; }
```

### 7. Slider Cursors
```css
input[type="range"]        { cursor: grab; }
input[type="range"]:active { cursor: grabbing; }
```

### 8. Vercel Subdirectory Routing
Needs explicit rewrite in vercel.json — cleanUrls alone is not enough.

### 9. Zapier GitHub Push
Always get SHA first, then update:
1. `get_file_contents` → get SHA
2. `create_file` → with SHA + new content + commit message

### 10. Apps Script: Save ≠ Deploy
Every code change needs Deploy → New deployment. After new deployment, update LOOKUP_URL in link generator.

### 11. DNS Propagation
After Vercel domain moves, wait 5–30 min. Test via direct .vercel.app URL first.

### 12. Location Parsing
`parseLocs()` handles text values: strips commas/parentheses, extracts first number.
`"(1000+)"` → 1000, `"10,000+ rental locations"` → 10000

---

## V2 Roadmap

1. **ROI payback period** — "Break-even in X months" in savings box
2. **Vertical selector** — DSO / QSR / Logistics / Retail with adjusted benchmarks
3. **Email capture → CRM** — form wired to Zapier → Master Sheet
4. **Cisco EA expiration input** — urgency framing based on renewal date
5. **Phased migration model** — rolling savings curve for enterprise deals

---

## Quick Reference

| Item | Value |
|------|-------|
| Calculator | https://meter.nexgensecurity.io |
| Link Generator | https://meter.nexgensecurity.io/generate |
| GitHub repo | nexgenideas-stack/meter |
| Vercel project ID | prj_muRfJQcSqoRnGktbusIb78TKxMXq |
| Vercel team ID | team_Q3cFuW47SivtqK9nfSaHVdjz |
| CRM Sheet | 1BSGbR7Byax_srRkmAIDfltYRlw-kNeeObQCpDONwr2Y |
| Apps Script URL | https://script.google.com/macros/s/AKfycbyE8YxBmQi_1NxXKIyQjNEAChF3u8iG-0oQQ-Sn1SOmWGpgfdhPywzhqQ9MpL1Na6sv2A/exec |
| Apps Script API key | meter_ron_2026 |
| Zapier GitHub | GitHubCLIAPI · nexgenideas-stack |