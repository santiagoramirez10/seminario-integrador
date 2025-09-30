// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  // En Angular 17 el campo es "styleUrl" (singular). Si tu archivo tenía "styleUrls", cámbialo a "styleUrl".
  styleUrl: './app.css'
})
export class AppComponent {}
