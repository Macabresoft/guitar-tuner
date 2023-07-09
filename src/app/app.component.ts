import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guitar-tuner-web';

  constructor() {  
  }

  async ngOnInit(): Promise<void> {
    const stream = await this.getMediaStream();
    const audioContext = new AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 4096;
    const audioSource = audioContext.createMediaStreamSource(stream);
    const maximumFrequency = audioContext.sampleRate / 2;
    const bufferLength = analyserNode.frequencyBinCount;
    const binSize = maximumFrequency / bufferLength;
    const channels = audioSource.channelCount;
    console.log(binSize);
    audioSource.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    if (stream && channels > 0) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(250);
      mediaRecorder.ondataavailable = (event) => {
        const dataArray = new Float32Array(bufferLength);
        analyserNode.getFloatFrequencyData (dataArray);

        let highestMagnitude = -Infinity;
        let highestFrequency = -Infinity;
        let highestIndex = -Infinity;

        for (let i = 0; i < bufferLength; i++) {
          let magnitude = dataArray[i];
          if (magnitude > highestMagnitude) {
            highestMagnitude = magnitude;
            highestFrequency = i * binSize;
            highestIndex = i;
          }
        }

        console.log('Frequency: ' + highestFrequency + ' | Magnitude: ' + highestMagnitude + ' | Index: ' + highestIndex);
      }
    }
  }

  async getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }
}
