import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeStorageService } from '../../core/services/recipe-storage.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly recipeStorage = inject(RecipeStorageService);

  recipes: Recipe[] = [];

  get totalRecipes(): number {
    return this.recipes.length;
  }

  get totalCategories(): number {
    return new Set(this.recipes.map((recipe) => recipe.category)).size;
  }

  get totalQuickRecipes(): number {
    return this.recipes.filter((recipe) => {
      const time = recipe.time.toLowerCase();

      return (
        recipe.difficulty === 'Rápida' ||
        time.includes('15') ||
        time.includes('20') ||
        time.includes('30')
      );
    }).length;
  }

  ngOnInit(): void {
    this.recipes = this.recipeStorage.getRecipes();
  }

  toggleFavorite(recipeId: string): void {
    this.recipes = this.recipeStorage.toggleFavorite(recipeId);
  }
}