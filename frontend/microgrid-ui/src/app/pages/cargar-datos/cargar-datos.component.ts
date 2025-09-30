import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Allowed = 'csv' | 'json';

@Component({
  selector: 'app-cargar-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cargar-datos.component.html',
  styleUrl: './cargar-datos.component.css'
})
export class CargarDatosComponent {
  zonas = [
    { value: 'Leticia', label: 'Leticia' },
    { value: 'Providencia', label: 'Providencia' },
    { value: 'Puerto_Nar', label: 'Puerto Nariño' },
    { value: 'San_Andres', label: 'San Andrés' }
  ];
  zonaSeleccionada = 'Leticia';

  files: Record<string, File | null> = {
    demand: null,
    forecast: null,
    parameters: null,
    instance: null
  };

  errors: string[] = [];
  ready = false;

  constructor(private router: Router) {}

  onPick(which: 'demand'|'forecast'|'parameters'|'instance', ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0] ? input.files[0] : null;
    this.files[which] = f;
    this.validate();
  }

  private checkExt(name: string, allow: Allowed[]): boolean {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    return allow.includes(ext as Allowed);
  }

  validate() {
    this.errors = [];

    if (this.files['demand'] && !this.checkExt(this.files['demand'].name, ['csv'])) {
      this.errors.push('La demanda debe ser .csv');
    }
    if (this.files['forecast'] && !this.checkExt(this.files['forecast'].name, ['csv'])) {
      this.errors.push('El pronóstico debe ser .csv');
    }
    if (this.files['parameters'] && !this.checkExt(this.files['parameters'].name, ['json'])) {
      this.errors.push('Los parámetros deben ser .json');
    }
    if (this.files['instance'] && !this.checkExt(this.files['instance'].name, ['json'])) {
      this.errors.push('La instancia debe ser .json');
    }

    this.ready = !!(
      this.files['demand'] &&
      this.files['parameters'] &&
      this.files['instance']
    ) && this.errors.length === 0;
  }

  usarEjemplo() {
    // Aquí podrías consultar al backend para obtener archivos por zona.
    // Por ahora solo marcamos como listo y navegamos.
    this.ready = true;
  }

  continuar() {
    if (!this.ready) return;
    // Enlazar con backend en el futuro: FormData + POST /api/files/upload
    this.router.navigate(
      ['/configuracion'],
      { queryParams: { zni: this.zonaSeleccionada } }
    );
  }
}
