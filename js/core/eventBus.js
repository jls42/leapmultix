/**
 * Lightweight EventBus using a single EventTarget
 * Provides on/off/emit with detail payloads
 */
const _target = (typeof globalThis !== 'undefined' && globalThis) || new (class {})();
const _et =
  typeof globalThis !== 'undefined' && typeof globalThis.EventTarget !== 'undefined'
    ? new globalThis.EventTarget()
    : null;

function _toType(event) {
  return String(event || '').trim();
}

export const eventBus = {
  on(event, handler, options) {
    const type = _toType(event);
    if (!type || typeof handler !== 'function') return;
    if (_et) {
      _et.addEventListener(type, handler, options);
      return;
    }
    try {
      _target.addEventListener(type, handler, options);
    } catch (e) {
      void e; /* no-op */
    }
  },
  off(event, handler, options) {
    const type = _toType(event);
    if (!type || typeof handler !== 'function') return;
    if (_et) {
      _et.removeEventListener(type, handler, options);
      return;
    }
    try {
      _target.removeEventListener(type, handler, options);
    } catch (e) {
      void e; /* no-op */
    }
  },
  emit(event, detail) {
    const type = _toType(event);
    if (!type) return false;
    const ce =
      typeof globalThis !== 'undefined' && typeof globalThis.CustomEvent !== 'undefined'
        ? new globalThis.CustomEvent(type, { detail })
        : { type, detail };
    try {
      if (_et) return _et.dispatchEvent(ce);
      return _target.dispatchEvent(ce);
    } catch (e) {
      void e;
      return false;
    }
  },
};

export default eventBus;
