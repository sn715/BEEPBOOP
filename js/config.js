// Site-wide values that change without touching the page markup.
// Prices are not final (see the product brief, section 12). Change them here only.
window.SITE_CONFIG = {
  currency: "USD",
  locale: "en-US",

  prices: {
    retail: 149,
    reservation: 119,
  },

  // A/B player audio. Leave null until real samples from the same room exist;
  // the player shows an honest placeholder in the meantime.
  samples: {
    phone: null, // e.g. "audio/phone.mp3"
    device: null, // e.g. "audio/beepboop.mp3"
  },
};
