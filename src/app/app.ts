import { Component, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private document = inject(DOCUMENT);

  darkMode = signal(localStorage.getItem('darkMode') === 'true');

  constructor() {
    effect(() => {
      this.document.body.classList.toggle('dark-theme', this.darkMode());
      localStorage.setItem('darkMode', String(this.darkMode()));
    });
  }

  toggleTheme() {
    this.darkMode.update(v => !v);
  }
}
