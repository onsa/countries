//  Angular imports
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//  Application imports
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import extensions from './extensions/extensions';

if (environment.production) {
  enableProdMode();
}

extensions();

platformBrowserDynamic().bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((err: any): void => console.error(err));
