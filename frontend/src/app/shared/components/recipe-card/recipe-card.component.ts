import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input({ required: true }) difficulty = '';
  @Input({ required: true }) time = '';
  @Input({ required: true }) servings = '';
  @Input({ required: true }) category = '';
  @Input() variant: 'warm' | 'green' = 'warm';

  get imageGradient(): string {
    if (this.variant === 'green') {
      return 'linear-gradient(135deg, rgba(111, 125, 79, 0.35), rgba(184, 92, 56, 0.25))';
    }

    return 'linear-gradient(135deg, rgba(184, 92, 56, 0.35), rgba(217, 164, 65, 0.35))';
  }
}