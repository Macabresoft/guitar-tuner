import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FrequencyService } from './frequency.service';
import { TunerComponent } from './tuner/tuner.component';

@NgModule({
  declarations: [
    AppComponent,
    TunerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [FrequencyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
