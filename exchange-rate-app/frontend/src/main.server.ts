import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // Zmieniono z App na AppComponent
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;