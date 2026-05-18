import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Output() favoriteToggle = new EventEmitter<string>();

  get coverImage(): string | null {
    return this.recipe.imageUrl || null;
  }

  toggleFavorite(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.favoriteToggle.emit(this.recipe.id);
  }
}