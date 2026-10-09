# Analyse statique : traiter un faux positif

Règle courte : `CLAUDE.md` (« Règles de code » et « Retours de PR »). Ici, la syntaxe et des exemples.

**Codacy/SonarCloud** use **ESLint** to analyze JavaScript/TypeScript. Use ESLint syntax to ignore false positives:

## 1. Ignore a **single line**

```js
// eslint-disable-next-line no-console -- Debug output for development
console.log('debug');

// eslint-disable-line no-console -- Temporary logging
console.log('debug');
```

## 2. Ignore a **code block**

```js
/* eslint-disable no-console */
console.log('debug');
console.log('another log');
/* eslint-enable no-console */
```

## 3. Ignore **entire file**

Add at the top of the file:

```js
/* eslint-disable */
```

## Common False Positives to Challenge

**HTML/XSS Warnings:**

- When using `appendSanitizedHTML()` from security-utils: Already sanitized, safe to use
- When using `getTranslation()` output: Internal content, not user input
- When clearing with `innerHTML = ''`: Safe operation, no injection risk

**Security/Integrity Warnings:**

- Analytics scripts without integrity: Auto-updating scripts would break with integrity hashes
- Script loading from trusted CDNs: Document why integrity is omitted

**Examples of proper suppression:**

**JavaScript (Codacy/SonarCloud):**

```js
// Multiple rules for comprehensive coverage
// eslint-disable-next-line security/detect-object-injection, sonarjs/no-unsafe-string-usage -- False positive: getTranslation returns safe internal content
const html = getTranslation('key');

// eslint-disable-next-line security/detect-unsafe-regex, sonarjs/no-html-injection -- Safe: using appendSanitizedHTML for proper sanitization
appendSanitizedHTML(element, html);

// eslint-disable-next-line no-restricted-properties -- Safe: clearing with empty string
element.innerHTML = '';
```

**HTML (SonarCloud):**

```html
<!-- Document reasoning in comment block -->
<!--
Suppressing static analysis warnings:
sonarjs:S5725 - External scripts without integrity is acceptable for analytics services that auto-update
-->
<!-- eslint-disable-next-line sonarjs/no-script-without-integrity -- Analytics script auto-updates, integrity would break functionality -->
<script src="https://leapmultix.jls42.org/js/analytics.js"></script>
```

## Best Practices for Suppression

1. **Always add justification** with `--` explaining why it's safe
2. **Be specific** about the rule being disabled when possible
3. **Challenge warnings** before disabling - ensure they're actually false positives
4. **Use narrowest scope** - prefer single line over blocks over files
5. **Document patterns** in this file for team consistency

## Important Notes

- ESLint comments are recognized by Codacy/SonarCloud
- Some "Code patterns" (Codacy UI-specific) may not respect inline annotations - disable them in **Repository → Code patterns**
- Ensure tools use your ESLint config (`eslint.config.js`) to respect your inline exclusions
- Regular review of suppressions during code review to prevent abuse
