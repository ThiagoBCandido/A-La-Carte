import { Injectable } from '@angular/core';
import { RECIPES } from '../data/mock.recipes';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly storageKey = 'a-la-carte-recipes';

  getRecipes(): Recipe[] {
    const savedRecipes = localStorage.getItem(this.storageKey);

    if (savedRecipes) {
      return JSON.parse(savedRecipes) as Recipe[];
    }

    const initialRecipes = RECIPES.map((recipe) => ({
      ...recipe,
      favorite: recipe.favorite ?? false,
    }));

    this.saveRecipes(initialRecipes);

    return initialRecipes;
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.getRecipes().find((recipe) => recipe.id === id);
  }

  getFavoriteRecipes(): Recipe[] {
    return this.getRecipes().filter((recipe) => recipe.favorite);
  }

  toggleFavorite(id: string): Recipe[] {
    const updatedRecipes = this.getRecipes().map((recipe) => {
      if (recipe.id !== id) {
        return recipe;
      }

      return {
        ...recipe,
        favorite: !recipe.favorite,
      };
    });

    this.saveRecipes(updatedRecipes);

    return updatedRecipes;
  }

  saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(recipes));
  }
}
