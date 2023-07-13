import { Component } from '@angular/core';
import { FrequencyService } from './frequency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FrequencyService]
})
export class AppComponent {
  title = 'guitar-tuner-web';
  minimumFrequency = 66.0;
  maximumFrequency = 392.0;
  currentFrequency = '';
  currentVolume = '';

  constructor(private frequencyService: FrequencyService) {  
  }

  async ngOnInit(): Promise<void> {
    const stream = await this.getMediaStream();
    this.frequencyService.Initialize(stream, this.minimumFrequency, this.maximumFrequency);

    if (stream) {
      setInterval(() => this.update(), 500);
    }
  }

  update() : void {
    let bufferInformation = this.frequencyService.GetBufferInformation();
    this.currentFrequency = bufferInformation.frequency.toFixed(2);
    this.currentVolume = bufferInformation.volume.toFixed(10);
  }

  async getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }
}
