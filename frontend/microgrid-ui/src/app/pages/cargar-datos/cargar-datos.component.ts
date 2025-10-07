import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService, FileKind } from '../../services/data.service';
@Component({
  standalone: true, imports:[CommonModule], selector:'app-cargar-datos',
  templateUrl:'./cargar-datos.component.html', styleUrls:['./cargar-datos.component.css']
}) export class CargarDatosComponent {
  status: Record<FileKind,'pending'|'ok'|'error'> = { demand:'pending', forecast:'pending', parameters:'pending', instance:'pending' };
  errorMsg = '';
  constructor(public data: DataService, private router: Router){}
  async onFile(kind: FileKind, file: File|null){ this.data.setFile(kind,file); this.status[kind]='pending'; if(!file) return;
    try{ const txt=await this.data.readText(file);
      if(kind==='demand') await this.data.validateDemand(txt);
      else if(kind==='forecast') await this.data.validateForecast(txt);
      else if(kind==='parameters') this.data.validateParameters(JSON.parse(txt));
      else if(kind==='instance') this.data.validateInstance(JSON.parse(txt));
      this.status[kind]='ok'; } catch(e:any){ this.status[kind]='error'; this.errorMsg=e?.message ?? 'Error'; } }
  continuar(){ if(this.data.allReady()) this.router.navigateByUrl('/configuracion'); }
}
