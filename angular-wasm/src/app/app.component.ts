import { Component, OnInit } from '@angular/core';
import { WasmService } from './services/wasm.service';
import { TimeExecutionComparator } from './models/time-execution-comparator-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public comparatorExecFibo: TimeExecutionComparator[];
  public comparatorExecPWM: TimeExecutionComparator[];
  public fiboComputed: boolean;
  public fiboTSComputed: boolean;
  public fiboWAComputed: boolean;
  public displayHideFibo: string;
  public PWMComputed: boolean;
  public PWMTSComputed: boolean;
  public PWMWAComputed: boolean;
  public displayHidePWM: string;
  public average: TimeExecutionComparator;

  private wasmService: WasmService;

  constructor() {
    this.comparatorExecFibo = [];
    this.comparatorExecPWM = [];
    this.fiboComputed = false;
    this.fiboTSComputed = false;
    this.fiboWAComputed = false;
    this.PWMComputed = false;
    this.PWMTSComputed = false;
    this.PWMWAComputed = false;
    this.displayHidePWM = 'Display';
    this.displayHideFibo = 'Display';
    this.average = {timeTS: 0, timeWA: 0};
    this.comparatorExecFibo = [];
    for (let i = 0; i < 62; i++) {
      this.comparatorExecFibo.push(
        {
          timeTS: undefined,
          timeWA: undefined
        }
      );
    }
  }

  public ngOnInit() {
    this.wasmService = new WasmService();
  }

  public callFibo(): void {
    if (this.fiboComputed) {
      this.displayHideFibo = 'Display';
    } else {
      this.displayHideFibo = 'Hide';
    }
    this.fiboComputed = !this.fiboComputed;
    console.log(this.comparatorExecFibo);
  }

  public callFiboWA(): void {
    for (let i = 0; i < this.comparatorExecFibo.length; i++) {
      const start = new Date().getTime();
      this.wasmService.fibonacci(i).subscribe(res => {
        this.comparatorExecFibo[i].timeWA = (new Date().getTime() - start);
      });
    }
    this.fiboWAComputed = true;
  }

  public callFiboTS(): void {
    for (let i = 0; i < this.comparatorExecFibo.length; i++) {
      const start = new Date().getTime();
      const res = this.fibonacciTS(i);
      this.comparatorExecFibo[i].timeTS = (new Date().getTime() - start);
    }
    this.fiboTSComputed = true;
  }

  public callPWM(): void {
    if (this.PWMComputed) {
      this.displayHidePWM = 'Display';
    } else {
      this.displayHidePWM = 'Hide';
    }
    this.PWMComputed = !this.PWMComputed;
    this.comparatorExecPWM.push({ timeTS: undefined, timeWA: undefined });
  }

  public callPWMTS(): void {
    const start = new Date().getTime();
    this.playWithMemoryTS();
    const index = this.getUndefinedIndexTS();
    if (index === -1) {
      this.comparatorExecPWM.push({timeTS: new Date().getTime() - start, timeWA: undefined});
    } else {
      this.comparatorExecPWM[index].timeTS = new Date().getTime() - start;
    }
    this.PWMTSComputed = true;
  }

  public callPWMWA(): void {
    const start = new Date().getTime();
    this.wasmService.playWithMemory().subscribe(res => {
      const index = this.getUndefinedIndexWA();
      if (index === -1) {
        this.comparatorExecPWM.push({timeTS: undefined, timeWA: new Date().getTime() - start});
      } else {
        this.comparatorExecPWM[index].timeWA = new Date().getTime() - start;
      }
      this.PWMWAComputed = true;
    });
  }

  public computeAverage(): void {
    this.average = {timeTS: 0, timeWA: 0};
    let nbTS = 0;
    let nbWA = 0;
    for (const iterator of this.comparatorExecPWM) {
      if (iterator.timeTS !== undefined) {
        nbTS++;
        this.average.timeTS += iterator.timeTS;
      }
      if (iterator.timeWA !== undefined) {
        nbWA++;
        this.average.timeWA += iterator.timeWA;
      }
    }
    this.average.timeTS /= nbTS;
    this.average.timeWA /= nbWA;
  }

  private getUndefinedIndexWA(): number {
    let i = 0;
    for (const iterator of this.comparatorExecPWM) {
      if (iterator.timeWA === undefined) {
        return i;
      }
      i++;
    }
    return -1;
  }

  private getUndefinedIndexTS(): number {
    let i = 0;
    for (const iterator of this.comparatorExecPWM) {
      if (iterator.timeTS === undefined) {
        return i;
      }
      i++;
    }
    return -1;
  }





  private playWithMemoryTS(): string[] {
    const strArray = [];
    for (let i = 0; i < 10000000; i++) {
      strArray.push(String.fromCharCode((i % 128)));
    }
    return strArray;
  }

  private fibonacciTS(n: number): number {
    let first = 0;
    let second = 1;
    let tmp;

    while (n--) {
      tmp = first + second;
      first = second;
      second = tmp;
    }
    return first;
  }
}
