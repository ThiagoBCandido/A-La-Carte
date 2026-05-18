import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

type RecipeCardData = {
  id: number | string;
  title: string;
  category: string;
  description: string;
  time: string;
  servings: string;
  difficulty: string;
  imageUrl?: string | null;
  image?: string | null;
  photoUrl?: string | null;
};

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: RecipeCardData;

  get coverImage(): string | null {
    return this.recipe.imageUrl || this.recipe.image || this.recipe.photoUrl || null;
  }
}