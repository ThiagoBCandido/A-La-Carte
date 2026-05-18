import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { MOCK_RECIPES } from '../../shared/data/mock.recipes';

type RecipeDraftIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

type RecipeDraftStep = {
  description: string;
};

type RecipeDraft = {
  title: string;
  description: string;
  difficulty: Recipe['difficulty'];
  time: string;
  servings: string;
  category: string;
  imageUrl?: string;
  ingredients: RecipeDraftIngredient[];
  steps: RecipeDraftStep[];
};

@Injectable({
  providedIn: 'root'
})
export class RecipeStorageService {
  private readonly storageKey = 'alacarte-recipes';
  private readonly deletedRecipesKey = 'alacarte-deleted-recipes';

  getRecipes(): Recipe[] {
    const deletedRecipeIds = this.getDeletedRecipeIds();

    const savedRecipes = this.getSavedRecipes().filter((recipe) => {
      return !deletedRecipeIds.includes(String(recipe.id));
    });

    const savedRecipeIds = new Set(savedRecipes.map((recipe) => String(recipe.id)));

    const mockRecipes = this.cloneRecipes(MOCK_RECIPES).filter((recipe) => {
      return (
        !deletedRecipeIds.includes(String(recipe.id)) &&
        !savedRecipeIds.has(String(recipe.id))
      );
    });

    return [...savedRecipes, ...mockRecipes];
  }

  getRecipeById(id: string | null): Recipe | undefined {
    if (!id) {
      return undefined;
    }

    return this.getRecipes().find((recipe) => String(recipe.id) === String(id));
  }

  getFavoriteRecipes(): Recipe[] {
    return this.getRecipes().filter((recipe) => recipe.favorite);
  }

  toggleFavorite(recipeId: string): Recipe[] {
    const recipe = this.getRecipeById(recipeId);

    if (!recipe) {
      return this.getRecipes();
    }

    const updatedRecipe: Recipe = {
      ...recipe,
      favorite: !recipe.favorite
    };

    this.updateRecipe(updatedRecipe);

    return this.getRecipes();
  }

  addRecipe(recipeDraft: RecipeDraft): Recipe {
    const newRecipe: Recipe = {
      id: this.createId(),
      title: recipeDraft.title,
      description: recipeDraft.description,
      difficulty: recipeDraft.difficulty,
      time: recipeDraft.time,
      servings: recipeDraft.servings,
      category: recipeDraft.category,
      favorite: false,
      variant: 'warm',
      imageUrl: recipeDraft.imageUrl,
      ingredients: recipeDraft.ingredients.map((ingredient) => ({
        id: this.createId(),
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        checked: false
      })),
      steps: recipeDraft.steps.map((step, index) => ({
        id: this.createId(),
        order: index + 1,
        description: step.description,
        checked: false
      }))
    };

    const savedRecipes = this.getSavedRecipes();

    this.saveRecipes([newRecipe, ...savedRecipes]);

    return newRecipe;
  }

  updateRecipe(updatedRecipe: Recipe): void {
    const normalizedRecipe = this.cloneRecipes([updatedRecipe])[0];

    const savedRecipes = this.getSavedRecipes().filter((recipe) => {
      return String(recipe.id) !== String(normalizedRecipe.id);
    });

    this.saveRecipes([normalizedRecipe, ...savedRecipes]);
  }

  deleteRecipe(recipeId: string): void {
    const normalizedRecipeId = String(recipeId);

    const savedRecipes = this.getSavedRecipes().filter((recipe) => {
      return String(recipe.id) !== normalizedRecipeId;
    });

    this.saveRecipes(savedRecipes);

    const deletedRecipeIds = this.getDeletedRecipeIds();

    if (!deletedRecipeIds.includes(normalizedRecipeId)) {
      this.saveDeletedRecipeIds([...deletedRecipeIds, normalizedRecipeId]);
    }
  }

  private getSavedRecipes(): Recipe[] {
    if (!this.canUseLocalStorage()) {
      return [];
    }

    const recipesJson = window.localStorage.getItem(this.storageKey);

    if (!recipesJson) {
      return [];
    }

    try {
      const recipes = JSON.parse(recipesJson) as Recipe[];
      return this.cloneRecipes(recipes);
    } catch {
      window.localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private saveRecipes(recipes: Recipe[]): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(recipes));
  }

  private getDeletedRecipeIds(): string[] {
    if (!this.canUseLocalStorage()) {
      return [];
    }

    const deletedRecipesJson = window.localStorage.getItem(this.deletedRecipesKey);

    if (!deletedRecipesJson) {
      return [];
    }

    try {
      const recipeIds = JSON.parse(deletedRecipesJson) as unknown[];
      return recipeIds.map((id) => String(id));
    } catch {
      window.localStorage.removeItem(this.deletedRecipesKey);
      return [];
    }
  }

  private saveDeletedRecipeIds(recipeIds: string[]): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    window.localStorage.setItem(
      this.deletedRecipesKey,
      JSON.stringify(recipeIds.map((id) => String(id)))
    );
  }

  private cloneRecipes(recipes: Recipe[]): Recipe[] {
    return recipes.map((recipe) => {
      const legacyRecipe = recipe as Recipe & { isFavorite?: boolean };

      const favorite =
        typeof recipe.favorite === 'boolean'
          ? recipe.favorite
          : Boolean(legacyRecipe.isFavorite);

      return {
        ...recipe,
        id: String(recipe.id),
        favorite,
        variant: recipe.variant === 'green' ? 'green' : 'warm',
        ingredients: (recipe.ingredients ?? []).map((ingredient) => ({
          ...ingredient,
          id: String(ingredient.id)
        })),
        steps: (recipe.steps ?? []).map((step) => ({
          ...step,
          id: String(step.id)
        }))
      };
    });
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private canUseLocalStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}