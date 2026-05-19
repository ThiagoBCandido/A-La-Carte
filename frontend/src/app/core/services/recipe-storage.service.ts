import { Injectable } from '@angular/core';
import { Recipe, ShoppingListItem } from '../models/recipe.model';
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

export type AppDataSummary = {
  totalRecipes: number;
  totalFavorites: number;
  totalCategories: number;
  totalShoppingItems: number;
  checkedShoppingItems: number;
};

type ApplicationBackup = {
  version: number;
  exportedAt: string;
  recipes: Recipe[];
  deletedRecipeIds: string[];
  shoppingListItems: ShoppingListItem[];
};

type ImportResult = {
  success: boolean;
  message: string;
};

@Injectable({
  providedIn: 'root'
})
export class RecipeStorageService {
  private readonly storageKey = 'alacarte-recipes';
  private readonly deletedRecipesKey = 'alacarte-deleted-recipes';
  private readonly shoppingListKey = 'alacarte-shopping-list';

  getRecipes(): Recipe[] {
    const deletedRecipeIds = this.getDeletedRecipeIds();
    const savedRecipes = this.getSavedRecipes().filter((recipe) => {
      return !deletedRecipeIds.includes(String(recipe.id));
    });

    const savedRecipeIds = new Set(savedRecipes.map((recipe) => String(recipe.id)));
    const mockRecipes = this.cloneRecipes(MOCK_RECIPES).filter((recipe) => {
      return (!deletedRecipeIds.includes(String(recipe.id)) && !savedRecipeIds.has(String(recipe.id)));
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

    const nextFavoriteValue = !recipe.favorite;
    const updatedRecipe: Recipe = {
      ...recipe, favorite: nextFavoriteValue, isFavorite: nextFavoriteValue
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
      isFavorite: false,
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

    const shoppingListItems = this.getShoppingListItems().filter((item) => {
      return String(item.recipeId) !== normalizedRecipeId;
    });

    this.saveShoppingListItems(shoppingListItems);
  }

  getShoppingListItems(): ShoppingListItem[] {
    if (!this.canUseLocalStorage()) {
      return [];
    }

    const shoppingListJson = window.localStorage.getItem(this.shoppingListKey);
    if (!shoppingListJson) {
      return [];
    }

    try {
      const items = JSON.parse(shoppingListJson) as ShoppingListItem[];
      return this.normalizeShoppingListItems(items);
    } catch {
      window.localStorage.removeItem(this.shoppingListKey);
      return [];
    }
  }

  addRecipeIngredientsToShoppingList(recipeId: string): number {
    const recipe = this.getRecipeById(recipeId);
    if (!recipe) {
      return 0;
    }

    const currentItems = this.getShoppingListItems();
    const currentKeys = new Set(
      currentItems.map((item) => {
        return this.createShoppingListItemKey(item.recipeId, item.ingredientId);
      })
    );

    const newItems: ShoppingListItem[] = recipe.ingredients.filter((ingredient) => {
        const key = this.createShoppingListItemKey(recipe.id, ingredient.id);
        return !currentKeys.has(key);
      }).map((ingredient) => ({
          id: this.createId(),
          recipeId: String(recipe.id),
          recipeTitle: recipe.title,
          ingredientId: String(ingredient.id),
          name: ingredient.name,
          quantity: Number(ingredient.quantity) || 0,
          unit: ingredient.unit,
          checked: false
        }
      )
    );

    if (newItems.length === 0) {
      return 0;
    }

    this.saveShoppingListItems([...newItems, ...currentItems]);
    return newItems.length;
  }

  toggleShoppingListItem(itemId: string): ShoppingListItem[] {
    const updatedItems = this.getShoppingListItems().map((item) => {
      if (String(item.id) !== String(itemId)) {
        return item;
      }

      return {
        ...item, checked: !item.checked
      };
    });

    this.saveShoppingListItems(updatedItems);
    return updatedItems;
  }

  removeShoppingListItem(itemId: string): ShoppingListItem[] {
    const updatedItems = this.getShoppingListItems().filter((item) => {
      return String(item.id) !== String(itemId);
    });

    this.saveShoppingListItems(updatedItems);
    return updatedItems;
  }

  clearShoppingList(): void {
    this.saveShoppingListItems([]);
  }

  getAppDataSummary(): AppDataSummary {
    const recipes = this.getRecipes();
    const shoppingListItems = this.getShoppingListItems();

    return {
      totalRecipes: recipes.length,
      totalFavorites: recipes.filter((recipe) => recipe.favorite).length,
      totalCategories: new Set(recipes.map((recipe) => recipe.category?.trim()).filter(Boolean)).size,
      totalShoppingItems: shoppingListItems.length,
      checkedShoppingItems: shoppingListItems.filter((item) => item.checked).length
    };
  }

  exportApplicationData(): string {
    const backup: ApplicationBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      recipes: this.getRecipes(),
      deletedRecipeIds: this.getDeletedRecipeIds(),
      shoppingListItems: this.getShoppingListItems()
    };

    return JSON.stringify(backup, null, 2);
  }

  importApplicationData(json: string): ImportResult {
    let parsedData: unknown;

    try {
      parsedData = JSON.parse(json);
    } catch {
      return {
        success: false,
        message: 'O arquivo selecionado não é um JSON válido.'
      };
    }

    const backup = this.normalizeBackup(parsedData);

    if (!backup) {
      return {
        success: false,
        message: 'O arquivo não possui dados válidos do À La Carte.'
      };
    }

    const recipes = this.cloneRecipes(backup.recipes);

    if (recipes.length === 0) {
      return {
        success: false,
        message: 'O backup não possui receitas para importar.'
      };
    }

    const importedRecipeIds = new Set(recipes.map((recipe) => String(recipe.id)));
    const deletedRecipeIds = backup.deletedRecipeIds ?? this.cloneRecipes(MOCK_RECIPES).filter((recipe) => !importedRecipeIds.has(String(recipe.id))).map((recipe) => String(recipe.id));
    this.saveRecipes(recipes);
    this.saveDeletedRecipeIds(deletedRecipeIds);
    this.saveShoppingListItems(this.normalizeShoppingListItems(backup.shoppingListItems));

    return {
      success: true,
      message: 'Backup importado com sucesso.'
    };
  }

  resetApplicationData(): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    window.localStorage.removeItem(this.storageKey);
    window.localStorage.removeItem(this.deletedRecipesKey);
    window.localStorage.removeItem(this.shoppingListKey);
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

    window.localStorage.setItem(this.storageKey, JSON.stringify(this.cloneRecipes(recipes)));
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

    const uniqueRecipeIds = Array.from(new Set(recipeIds.map((id) => String(id))));

    window.localStorage.setItem(this.deletedRecipesKey, JSON.stringify(uniqueRecipeIds));
  }

  private saveShoppingListItems(items: ShoppingListItem[]): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    window.localStorage.setItem(this.shoppingListKey, JSON.stringify(this.normalizeShoppingListItems(items)));
  }

  private cloneRecipes(recipes: Recipe[]): Recipe[] {
    return (recipes ?? []).filter((recipe) => recipe && recipe.title).map((recipe) => {
        const legacyRecipe = recipe as Recipe & { isFavorite?: boolean };
        const favorite = typeof recipe.favorite === 'boolean' ? recipe.favorite : Boolean(legacyRecipe.isFavorite);

        return {
          ...recipe,
          id: String(recipe.id),
          favorite,
          isFavorite: favorite,
          variant: recipe.variant === 'green' ? 'green' : 'warm',
          ingredients: (recipe.ingredients ?? []).map((ingredient) => ({
            ...ingredient,
            id: String(ingredient.id),
            quantity: Number(ingredient.quantity) || 0,
            checked: Boolean(ingredient.checked)
          })),
          steps: (recipe.steps ?? []).map((step, index) => ({
            ...step,
            id: String(step.id),
            order: Number(step.order) || index + 1,
            checked: Boolean(step.checked)
          }))
        };
      });
  }

  private normalizeShoppingListItems(items: ShoppingListItem[] = []): ShoppingListItem[] {
    return items.filter((item) => item && item.name).map((item) => ({
        id: String(item.id ?? this.createId()),
        recipeId: String(item.recipeId ?? ''),
        recipeTitle: String(item.recipeTitle ?? 'Receita'),
        ingredientId: String(item.ingredientId ?? item.id ?? this.createId()),
        name: String(item.name),
        quantity: Number(item.quantity) || 0,
        unit: String(item.unit ?? ''),
        checked: Boolean(item.checked)
      }));
  }

  private normalizeBackup(
    data: unknown
  ): { recipes: Recipe[]; deletedRecipeIds?: string[]; shoppingListItems: ShoppingListItem[] } | null {
    if (Array.isArray(data)) {
      return {
        recipes: data as Recipe[],
        shoppingListItems: []
      };
    }

    if (!data || typeof data !== 'object') {
      return null;
    }

    const backup = data as Partial<ApplicationBackup>;

    if (!Array.isArray(backup.recipes)) {
      return null;
    }

    return {
      recipes: backup.recipes,
      deletedRecipeIds: Array.isArray(backup.deletedRecipeIds) ? backup.deletedRecipeIds.map((id) => String(id)) : undefined,
      shoppingListItems: Array.isArray(backup.shoppingListItems) ? backup.shoppingListItems : []
    };
  }

  private createShoppingListItemKey(recipeId: string, ingredientId: string): string {
    return `${String(recipeId)}-${String(ingredientId)}`;
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