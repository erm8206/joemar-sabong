import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Simulate progress bar and wait for full window load
function simulateProgressUntilLoaded(callback: () => void) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5;
    if (progress > 90) progress = 90;

    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    if (bar) bar.style.width = `${progress}%`;
    if (text) text.innerText = `${Math.floor(progress)}%`;
  }, 100);

  // Wait for CSS, images, fonts, etc.
  window.onload = () => {
    clearInterval(interval);

    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    if (bar) bar.style.width = `100%`;
    if (text) text.innerText = `100%`;

    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) splash.style.display = 'none';

      // Bootstrap Angular app
      callback();
    }, 300); // optional delay
  };
}

// Bootstrap Angular after splash loading completes
simulateProgressUntilLoaded(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
