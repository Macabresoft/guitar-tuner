import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FrequencyService {
  readonly audioContext: AudioContext = new AudioContext();
  audioAnalyser?: AnalyserNode;
  audioSource?: MediaStreamAudioSourceNode;
  bufferLength: number = 0;
  channels: number = 0;
  lowPeriod: number = 0;
  highPeriod: number = 0;

  constructor() { }

  Initialize(audioStream: MediaStream, minimumFrequency: number, maximumFrequency: number) : void {
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.audioSource = this.audioContext.createMediaStreamSource(audioStream);
    this.bufferLength = this.audioAnalyser.fftSize;
    this.channels = this.audioSource.channelCount;
    this.audioSource.connect(this.audioAnalyser);
    this.audioAnalyser.connect(this.audioContext.destination);

    this.ResetFrequencies(minimumFrequency, maximumFrequency);

    if (this.bufferLength < this.highPeriod) {
      // throw an error
    }
  }

  ResetFrequencies(minimumFrequency: number, maximumFrequency: number) {
    if (minimumFrequency > 0 && maximumFrequency > minimumFrequency) {
      this.lowPeriod = Math.floor(this.audioContext.sampleRate / maximumFrequency);
      this.highPeriod = Math.ceil(this.audioContext.sampleRate / minimumFrequency);
    }
  }

  GetBufferInformation() : number {
    let frequency = -Infinity;
    if (this.audioAnalyser) {
      const samples = new Float32Array(this.bufferLength);
      this.audioAnalyser.getFloatTimeDomainData(samples);
  
      let greatestMagnitude = -Infinity;
      let chosenPeriod = -1;
      let peakVolume = 0.0;
  
      for (let period = this.lowPeriod; period < this.highPeriod; period++) {
        let sum = 0.0;
        for (let i = 0; i < this.bufferLength - period; i++) {
          sum += samples[i] * samples[i + period];
          peakVolume = Math.max(peakVolume, Math.abs(samples[i]));
        }
  
        let newMagnitude = sum / this.bufferLength;
        if (newMagnitude > greatestMagnitude) {
          chosenPeriod = period;
          greatestMagnitude = newMagnitude;
        }
      }

      frequency = this.audioContext.sampleRate / chosenPeriod;  
    }

    return frequency;
  }
}
