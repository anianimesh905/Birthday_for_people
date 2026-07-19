/**
 * Helper to execute a callback when the DOM is fully parsed and ready.
 * Handles load-order race conditions by checking document.readyState.
 * Registers event listeners with { once: true } for automatic browser cleanup.
 *
 * @param {Function} callback
 */
export function onDOMReady(callback) {
  if (window.location.protocol === 'file:') {
    console.warn('Bootstrapping suspended: ES6 modules cannot run under file:// protocol.');
    return;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
}
