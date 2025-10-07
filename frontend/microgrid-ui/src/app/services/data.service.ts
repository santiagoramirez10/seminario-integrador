import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export type FileKind = 'demand'|'forecast'|'parameters'|'instance';
export interface Files { demand: File|null; forecast: File|null; parameters: File|null; instance: File|null; }
@Injectable({ providedIn: 'root' })
export class DataService {
  zni$ = new BehaviorSubject<string>('Leticia');
  files: Files = { demand: null, forecast: null, parameters: null, instance: null };
  setZNI(zni: string){ this.zni$.next(zni); }
  setFile(kind: FileKind, file: File | null){ this.files[kind] = file; }
  async readText(file: File){ return await file.text(); }
  async validateDemand(text: string){ const l=text.trim().split(/\r?\n/); const h=l[0].split(','); if(h[0]!=='t'||h[1]!=='demand') throw new Error('Headers inválidos'); if(l.length<8761) throw new Error('Se esperan 8760 filas'); }
  async validateForecast(text: string){ const h=text.trim().split(/\r?\n/)[0].split(','); for(const k of ['t','GHI','DNI','DHI','T_amb','Wt','SF']) if(!h.includes(k)) throw new Error(`Falta ${k}`); }
  validateParameters(json: any){ if(!json?.generators?.length) throw new Error('parameters.generators vacío'); }
  validateInstance(json: any){ if(json?.nse == null) throw new Error('instance.nse requerido'); }
  allReady(){ return !!(this.files.demand && this.files.forecast && this.files.parameters && this.files.instance); }
}
