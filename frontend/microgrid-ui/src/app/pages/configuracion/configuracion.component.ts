import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
@Component({
  standalone: true, imports:[CommonModule, ReactiveFormsModule], selector:'app-configuracion',
  templateUrl:'./configuracion.component.html', styleUrls:['./configuracion.component.css']
}) export class ConfiguracionComponent {
  form: ReturnType<FormBuilder['group']>; busy=false; error='';
  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, public data: DataService){
    this.form = this.fb.group({ years:[2024,[Validators.required]], n_scenarios:[10,[Validators.required,Validators.min(1)]],
      robustness:[0.95,[Validators.min(0),Validators.max(1)]], nse:[0.03,[Validators.min(0),Validators.max(1)]], amax:[500,[Validators.min(0)]] });
  }
  async simular(){ if(this.form.invalid) return; this.busy=true; this.error='';
    const res = await this.api.simulate({ zni: this.data.zni$.getValue() }); this.busy=false;
    if(!res.ok){ this.error = res.error ?? 'Error en simulación'; return; }
    this.router.navigate(['/resultados'], { queryParams: { runId: res.data!.runId }}); }
}
