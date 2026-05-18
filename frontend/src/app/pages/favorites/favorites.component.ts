import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeStorageService } from '../../core/services/recipe-storage.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RecipeCardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  private readonly recipeStorage = inject(RecipeStorageService);

  favoriteRecipes: Recipe[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  toggleFavorite(recipeId: string): void {
    this.recipeStorage.toggleFavorite(recipeId);
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.favoriteRecipes = this.recipeStorage.getFavoriteRecipes();
  }
}