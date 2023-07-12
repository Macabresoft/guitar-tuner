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

  constructor(private frequencyService: FrequencyService) {  
  }

  async ngOnInit(): Promise<void> {
    const stream = await this.getMediaStream();
    this.frequencyService.Initialize(stream, this.minimumFrequency, this.maximumFrequency);

    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(500);
      mediaRecorder.ondataavailable = (event) => {
        
        let frequency = this.frequencyService.GetBufferInformation();
        console.log('Frequency: ' + frequency);
      }
    }
  }

  async getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }
}
