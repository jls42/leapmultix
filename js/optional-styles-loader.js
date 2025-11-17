/**
 * Optional Styles Loader
 * Loads optional CSS files with version parameters
 * Extracted from inline script to comply with Content Security Policy
 */

import { APP_VERSION, VERSION_PARAM } from './cache-updater.js';

(() => {
  const runtime = globalThis;
  const optionalStyles = [
    'css/parent-controls.css',
    'css/theme-selector.css',
    'css/volume-control.css',
    'css/progress-dashboard.css',
    'css/discovery-fixes.css',
    'css/video.css',
  ];

  const VERSION_EVENT = 'leapmultix:version-ready';

  const DEFAULT_APP_VERSION = APP_VERSION || 'v-dev';
  const DEFAULT_VERSION_PARAM = VERSION_PARAM || `v=${DEFAULT_APP_VERSION}`;

  const toVersionParam = raw => {
    const value = (raw || '').trim();
    if (!value) return DEFAULT_VERSION_PARAM;
    if (value.startsWith('v=')) return value;
    if (value.startsWith('v')) return `v=${value}`;
    const sanitized = value.replace(/^\?*v=/, '').trim();
    return `v=${sanitized || DEFAULT_APP_VERSION}`;
  };

  const resolveVersionParam = () => {
    const fromGlobalParam = runtime?.__LEAPMULTIX_VERSION_PARAM__;
    if (typeof fromGlobalParam === 'string' && fromGlobalParam.length > 0) {
      return toVersionParam(fromGlobalParam);
    }
    const fromGlobalVersion = runtime?.__LEAPMULTIX_APP_VERSION__;
    if (typeof fromGlobalVersion === 'string' && fromGlobalVersion.length > 0) {
      return toVersionParam(fromGlobalVersion);
    }
    const docParam = document?.documentElement?.dataset?.versionParam;
    if (typeof docParam === 'string' && docParam.length > 0) {
      return toVersionParam(docParam);
    }
    return DEFAULT_VERSION_PARAM;
  };

  const withVersion = (href, versionParam) => {
    if (versionParam) {
      if (href.includes(versionParam)) {
        return href;
      }
      const separator = href.includes('?') ? '&' : '?';
      return `${href}${separator}${versionParam}`;
    }
    return href;
  };

  const loadOptionalStyles = versionParam => {
    for (const href of optionalStyles) {
      const versionedHref = withVersion(href, versionParam);
      if (document.querySelector(`link[data-optional-css="${href}"]`)) {
        continue;
      }
      if (document.querySelector(`link[href="${versionedHref}"]`)) {
        continue;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = versionedHref;
      link.dataset.optionalCss = href;
      document.head.appendChild(link);
    }
  };

  const scheduleLoad = versionParam => {
    const runner = () => loadOptionalStyles(versionParam);
    if ('requestIdleCallback' in runtime) {
      runtime.requestIdleCallback(runner, { timeout: 2500 });
    } else {
      runtime.addEventListener('load', runner, { once: true });
    }
  };

  const startWithResolvedVersion = () => {
    scheduleLoad(resolveVersionParam());
  };

  if (runtime?.__LEAPMULTIX_VERSION_PARAM__ || runtime?.__LEAPMULTIX_APP_VERSION__) {
    startWithResolvedVersion();
    return;
  }

  const onVersionReady = event => {
    document.removeEventListener(VERSION_EVENT, onVersionReady);
    const detailParam = event?.detail?.versionParam;
    scheduleLoad(detailParam ? toVersionParam(detailParam) : resolveVersionParam());
  };
  document.addEventListener(VERSION_EVENT, onVersionReady, { once: true });

  // Fallback to default version if the event never fires (e.g., legacy browsers)
  runtime.setTimeout(startWithResolvedVersion, 3000);
})();
