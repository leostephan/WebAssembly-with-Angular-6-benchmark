import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Subject } from 'rxjs/Subject';
import { filter, take, mergeMap } from 'rxjs/operators';

import * as Module from './../wasm/evaluator.js';
import '!!file-loader?name=wasm/evaluator.wasm!./../wasm/evaluator.wasm';
import { resolve } from 'url';

declare var WebAssembly;

@Injectable()
export class WasmService {
  module: any;

  wasmReady = new BehaviorSubject<boolean>(false);
  // On utilise un BehaviorSubject pour rendre l'appel à WebAssembly asynchrone

  constructor() {
    this.instantiateWasm('wasm/evaluator.wasm');
  }

  private async instantiateWasm(path: string) {
    // charge le fichier .wasm
    const wasmFile = await fetch(path);

    // le convertit en un buffer binaire
    const buffer = await wasmFile.arrayBuffer();
    const binary = new Uint8Array(buffer);

    const moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: () => {
        this.wasmReady.next(true);
      }
    };

    // instantie le module
    this.module = Module(moduleArgs);
  }

  // Pour plus d'infos : https://rxjs-dev.firebaseapp.com/api
  public fibonacci(input: number): Observable<number> {
    return this.wasmReady.pipe(filter(val => val === true)).pipe(
      mergeMap(() => {
        return fromPromise(
          new Promise<number>((resolve, reject) => {
            setTimeout(() => {
              const result = this.module._fibo(input);
              resolve(result);
            });
          })
        );
      }),
      take(1)
    );
  }

  public playWithMemory(): Observable<number> {
    return this.wasmReady.pipe(filter(value => value === true)).pipe(
      mergeMap(() => {
        return fromPromise(
          new Promise<number>((resolve, reject) => {
            setTimeout(() => {
              const result = this.module._play_with_memory();
              resolve(result);
            });
          })
        );
      }),
      take(1)
    );
  }
}
