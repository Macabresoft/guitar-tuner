import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guitar-tuner-web';
  minimumFrequency = 66.0;
  maximumFrequency = 392.0;

  constructor() {  
  }

  async ngOnInit(): Promise<void> {
    const stream = await this.getMediaStream();
    const audioContext = new AudioContext();
    const analyserNode = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const bufferLength = analyserNode.fftSize;
    const channels = audioSource.channelCount;

    audioSource.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    if (stream && channels > 0) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(500);
      mediaRecorder.ondataavailable = (event) => {
        const samples = new Float32Array(bufferLength);
        analyserNode.getFloatTimeDomainData(samples);

        const lowPeriod = Math.floor(audioContext.sampleRate / this.maximumFrequency);
        const highPeriod = Math.ceil(audioContext.sampleRate / this.minimumFrequency);

        if (bufferLength < highPeriod) {
          alert('WRONG');
        }

        let greatestMagnitude = -Infinity;
        let chosenPeriod = -1;
        let peakVolume = 0.0;

        for (let period = lowPeriod; period < highPeriod; period++) {
          let sum = 0.0;
          for (let i = 0; i < bufferLength - period; i++) {
            sum += samples[i] * samples[i + period];
            peakVolume = Math.max(peakVolume, Math.abs(samples[i]));
          }

          let newMagnitude = sum / bufferLength;
          if (newMagnitude > greatestMagnitude) {
            chosenPeriod = period;
            greatestMagnitude = newMagnitude;
          }
        }

        let frequency = audioContext.sampleRate / chosenPeriod;
        console.log('Frequency: ' + frequency + ' | Magnitude: ' + greatestMagnitude + ' | Peak Volume: ' + peakVolume);
      }
    }
  }

  async getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }
}
