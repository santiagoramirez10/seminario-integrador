import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  zni = 'Leticia';

  form = this.fb.group({
    horizonte: [20, [Validators.required, Validators.min(1), Validators.max(50)]],
    anioBase: [2018, [Validators.required, Validators.min(2000), Validators.max(2100)]],
    escenarios: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
    robustez: [0.85, [Validators.required, Validators.min(0), Validators.max(1)]],
    lat: [-4.2081, [Validators.required, Validators.min(-90), Validators.max(90)]],
    lon: [-69.9432, [Validators.required, Validators.min(-180), Validators.max(180)]],
    tz: [-5, [Validators.required, Validators.min(-12), Validators.max(14)]],
    albedo: [0.2, [Validators.min(0), Validators.max(1)]],
    sombreado: [0.05, [Validators.min(0), Validators.max(1)]]
  });

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute){
    const qzni = this.route.snapshot.queryParamMap.get('zni');
    if(qzni){ this.zni = qzni; }
  }

  get f() { return this.form.controls; }

  back(){
    this.router.navigate(['/cargar-datos'], { queryParams: { zni: this.zni } });
  }

  continuar(){
    if(this.form.invalid){ this.form.markAllAsTouched(); return; }
    // Enlazar a backend más adelante; por ahora solo pasamos la config como query param compacta.
    const cfg = JSON.stringify(this.form.value);
    this.router.navigate(['/resultados'], { queryParams: { zni: this.zni, cfg } });
  }
}
