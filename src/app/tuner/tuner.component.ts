import { Component } from '@angular/core';
import { FrequencyService } from '../frequency.service';
import { Note } from '../note';
import { BufferInformation } from '../buffer-information';

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.css'],
  providers: [FrequencyService]
})
export class TunerComponent {
  private readonly minimumFrequency = 60.0;
  private readonly maximumFrequency = 392.0;
  private readonly notes: Note[] = [
    { frequency: 73.42, halfStepDown: 69.30, halfStepUp: 77.78, name: 'D', octave: 2 },
    { frequency: 82.41, halfStepDown: 77.78, halfStepUp: 87.31, name: 'E', octave: 2},
    { frequency: 110.00, halfStepDown: 103.83, halfStepUp: 116.54, name: 'A', octave: 2 },
    { frequency: 146.83, halfStepDown: 138.59, halfStepUp: 155.56, name: 'D', octave: 3 },
    { frequency: 196.00, halfStepDown: 185.00, halfStepUp: 207.65, name: 'G', octave: 3 },
    { frequency: 246.94, halfStepDown: 233.08, halfStepUp: 261.63, name: 'B', octave: 3 },
    { frequency: 329.63, halfStepDown:  311.13, halfStepUp: 349.23, name: 'E', octave: 4 }
  ];  

  currentFrequency = '';
  currentNote?: Note;

  constructor(private frequencyService: FrequencyService) {  
  }

  async ngOnInit(): Promise<void> {
    const stream = await this.getMediaStream();
    this.frequencyService.Initialize(stream, this.minimumFrequency, this.maximumFrequency);

    if (stream) {
      setInterval(() => this.update(), 500);
    }
  }

  private async getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  private getNearestNote(bufferInformation: BufferInformation) : Note {
    let result = { frequency: 0, halfStepDown: -Infinity, halfStepUp: -Infinity, name: '', octave: -Infinity};
    
    for (let i = 0; i < this.notes.length; i++) {
      let note = this.notes[i];

      if (bufferInformation.frequency > note.halfStepDown && bufferInformation.frequency < note.halfStepUp) {
        result = note;
        break;
      }
    }

    return result;
  }

  private update() : void {
    let bufferInformation = this.frequencyService.GetBufferInformation();
    this.currentFrequency = bufferInformation.frequency.toFixed(2);
    let currentNote = this.getNearestNote(bufferInformation);
    if (currentNote.frequency > 0) {
      this.currentNote = currentNote;
    }
  }
}
