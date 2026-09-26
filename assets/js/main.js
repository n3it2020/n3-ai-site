(function () {
  'use strict';

  // Mobile navigation
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Menu';
        btn.focus();
      }
    });
  }

  // Contact form
  // The form posts to a Google Form. Set the values below (from the Google
  // Form's "formResponse" URL and its entry IDs) to connect it. Until they are
  // set, the form opens the visitor's email app with the message ready to send.
  var FORM = {
    action: '',        // e.g. https://docs.google.com/forms/d/e/FORM_ID/formResponse
    name: '',          // e.g. entry.1111111111
    email: '',         // e.g. entry.2222222222
    business: '',      // e.g. entry.3333333333
    message: ''        // e.g. entry.4444444444
  };
  var TO = 'hello@n3cloudsolutions.com';

  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');

  function show(msg, kind) {
    status.hidden = false;
    status.className = 'status ' + kind;
    status.textContent = msg;
    status.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.website && form.website.value) { return; } // honeypot
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      business: form.elements.business.value.trim(),
      message: form.elements.message.value.trim()
    };

    var configured = FORM.action && FORM.name && FORM.email && FORM.business && FORM.message;

    if (!configured) {
      var body = 'Name: ' + data.name + '\nBusiness: ' + data.business + '\nEmail: ' + data.email +
        '\n\nWhat I would like to automate:\n' + data.message;
      window.location.href = 'mailto:' + TO + '?subject=' +
        encodeURIComponent('15-minute conversation request') + '&body=' + encodeURIComponent(body);
      show('Your email app should open with your message ready to send. If it does not, email ' + TO + ' directly.', 'ok');
      return;
    }

    var fd = new FormData();
    fd.append(FORM.name, data.name);
    fd.append(FORM.email, data.email);
    fd.append(FORM.business, data.business);
    fd.append(FORM.message, data.message);

    submit.disabled = true;
    submit.textContent = 'Sending...';

    fetch(FORM.action, { method: 'POST', mode: 'no-cors', body: fd })
      .then(function () {
        form.reset();
        show('Thanks. Your request was sent. We will reply to the email address you gave us. If you do not hear back, write to ' + TO + '.', 'ok');
      })
      .catch(function () {
        show('The form could not be sent. Please email ' + TO + ' instead.', 'err');
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = 'Book a 15-Minute Conversation';
      });
  });
})();
