/**
 * Plausible Analytics Initialization
 * This script initializes the Plausible analytics queue before the main script loads.
 */

window.plausible =
  window.plausible ||
  function () {
    var queue = window.plausible.q || [];
    window.plausible.q = queue;
    queue.push(arguments);
  };