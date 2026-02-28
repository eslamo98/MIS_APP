import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="home-container">
      <h1>Landing Page</h1>
      <p>Welcome to MIS APP</p>
    </div>
  `
})
export class HomeComponent { }
