// Site behavior. Meta Pixel events (e.g. "Lead") will hook in here later.

// Email capture forms: any <form data-form="email-capture">
document.querySelectorAll('[data-form="email-capture"]').forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // TODO: send form.email.value to the email provider.
    const button = form.querySelector('button[type="submit"]');
    button.textContent = "Thanks! Check your inbox";
    button.disabled = true;
  });
});
