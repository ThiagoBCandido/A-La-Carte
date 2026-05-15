import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { MOCK_RECIPES } from '../../shared/data/mock.recipes';
import { Recipe } from '../../core/models/recipe.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  recipes: Recipe[] = MOCK_RECIPES;

  get totalRecipes(): number {
    return this.recipes.length;
  }

  get totalCategories(): number {
    return new Set(this.recipes.map((recipe) => recipe.category)).size;
  }

  get totalQuickRecipes(): number {
    return this.recipes.filter((recipe) => recipe.difficulty === 'Rápida').length;
  }
}