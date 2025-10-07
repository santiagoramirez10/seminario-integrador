import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, imports:[CommonModule, RouterLink], selector:'app-inicio',
  template:`<h1>Dimensionador de Microrredes (ZNI)</h1><p>Bienvenido. Carga tus datos, configura y visualiza resultados.</p><a routerLink="/cargar-datos" class="btn">Comenzar</a>`
}) export class InicioComponent {}
