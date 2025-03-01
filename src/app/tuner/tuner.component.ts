import { Component } from '@angular/core';
import { FrequencyService } from '../frequency.service';
import { Note } from '../note';
import { BufferInformation } from '../buffer-information';
import { Subscription } from 'rxjs';
import {timer} from 'rxjs' ;
@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.css'],
  providers: [FrequencyService]
})
export class TunerComponent {
  private readonly meterBins = 10;
  private readonly minimumFrequency = 60.0;
  private readonly maximumFrequency = 392.0;
  private readonly maximumNoNoteCount = 10;
  private readonly maximumRollingFrequencies = 10;
  private readonly frequenciesForAverage = 6;
  private readonly notes: Note[] = [
    { frequency: 73.42, halfStepDown: 69.30, halfStepUp: 77.78, name: 'D', octave: 2 },
    { frequency: 82.41, halfStepDown: 77.78, halfStepUp: 87.31, name: 'E', octave: 2},
    { frequency: 110.00, halfStepDown: 103.83, halfStepUp: 116.54, name: 'A', octave: 2 },
    { frequency: 146.83, halfStepDown: 138.59, halfStepUp: 155.56, name: 'D', octave: 3 },
    { frequency: 196.00, halfStepDown: 185.00, halfStepUp: 207.65, name: 'G', octave: 3 },
    { frequency: 246.94, halfStepDown: 233.08, halfStepUp: 261.63, name: 'B', octave: 3 },
    { frequency: 329.63, halfStepDown:  311.13, halfStepUp: 349.23, name: 'E', octave: 4 }
  ];

  private readonly volumeThreshold = 0.01;
  private readonly rollingFrequencies: number[] = [];

  currentFrequency: number = 0;
  currentNote?: Note;
  frequencyMeterLeft = this.createDefaultFrequencyMeterLeft();
  frequencyMeterRight = this.createDefaultFrequencyMeterRight();
  isHighlighted = false;
  noNoteCount = 0;
  subscription?: Subscription;

  constructor(private frequencyService: FrequencyService) {  
  }

  async ngOnInit(): Promise<void> {
    const stream = await this.getMediaStream();
    this.frequencyService.Initialize(stream, this.minimumFrequency, this.maximumFrequency);

    if (stream) {
      this.subscription = timer(0, 250).subscribe(() => this.update());
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  applyNewFrequency(newFrequency: number) : void {
    this.rollingFrequencies.unshift(newFrequency);

    while(this.rollingFrequencies.length > this.maximumRollingFrequencies) {
      this.rollingFrequencies.pop();
    }
  }

  getAveragedFrequency() : number {
    if (this.rollingFrequencies.length > 1) {
      let totalAverage = this.rollingFrequencies.reduce((a, b) => a + b) / this.rollingFrequencies.length;

      if (this.rollingFrequencies.length <= this.frequenciesForAverage) {
          return totalAverage;
      }
      else {
        let sorted = this.rollingFrequencies.slice().sort((a, b) => Math.abs(a - totalAverage) - Math.abs(b - totalAverage));
        return sorted.slice(0, this.frequenciesForAverage).reduce((a, b) => a + b) / this.frequenciesForAverage;
      }
    }
    else if (this.rollingFrequencies.length == 1) {
      return this.rollingFrequencies[0];
    }

    return this.currentFrequency;
  }

  private createDefaultFrequencyMeterRight() : string {
    return '-'.repeat(this.meterBins) + ']';
  }

  private createDefaultFrequencyMeterLeft() : string {
    return '[' + '-'.repeat(this.meterBins);
  }

  private resetDisplay() {
    let offset = this.meterBins;
  
    if (this.currentNote) {
      if (this.currentFrequency < this.currentNote.frequency) {
        let totalStep = this.currentNote.frequency - this.currentNote.halfStepDown;
        let current = this.currentNote.frequency - this.currentFrequency;
        offset -= Math.floor((current / totalStep) * this.meterBins);
      }
      else if (this.currentFrequency > this.currentNote.frequency) {
        let totalStep = this.currentNote.halfStepUp -  this.currentNote.frequency;
        let current = this.currentNote.halfStepUp - this.currentFrequency;
        offset += Math.ceil((current / totalStep) * this.meterBins);
      }
    }

    if (offset < this.meterBins) {
      this.frequencyMeterLeft = '[' + '-'.repeat(offset) + '>' + '-'.repeat(this.meterBins - offset - 1);
      this.frequencyMeterRight = this.createDefaultFrequencyMeterRight();
      this.isHighlighted = false;
    }
    else if (offset > this.meterBins) {
      this.frequencyMeterLeft = this.createDefaultFrequencyMeterLeft();
      this.frequencyMeterRight = '-'.repeat((this.meterBins * 2) - offset) + '<' + '-'.repeat(offset - this.meterBins - 1) + ']';
      this.isHighlighted = false;
    }
    else {
      this.frequencyMeterLeft = this.createDefaultFrequencyMeterLeft();
      this.frequencyMeterRight = this.createDefaultFrequencyMeterRight();
      this.isHighlighted = true;
    }
  }

  private async getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  private getNearestNote(currentFrequency: number) : Note {
    let result = { frequency: 0, halfStepDown: -Infinity, halfStepUp: -Infinity, name: '', octave: -Infinity};
    
    for (let i = 0; i < this.notes.length; i++) {
      let note = this.notes[i];

      if (currentFrequency > note.halfStepDown && currentFrequency < note.halfStepUp) {
        result = note;
        break;
      }
    }

    return result;
  }

  private update() : void {
    try {
      let bufferInformation = this.frequencyService.GetBufferInformation();
      if (bufferInformation.volume > this.volumeThreshold) {
        this.noNoteCount = 0;
        this.applyNewFrequency(bufferInformation.frequency);
        this.currentFrequency = this.getAveragedFrequency();
        let currentNote = this.getNearestNote(this.currentFrequency);
        if (currentNote.frequency > 0) {
          this.currentNote = currentNote;
          this.resetDisplay();
        }
      }
      else {
        this.noNoteCount++;

        if (this.noNoteCount > this.maximumNoNoteCount) {
          this.currentFrequency = 0;
          this.currentNote = undefined;
          this.isHighlighted = false;
        }
        else {
          this.rollingFrequencies.pop();
          this.currentFrequency = this.getAveragedFrequency();
        }

        this.resetDisplay();
      }
    }
    catch (e) {
    }
  }
}
