export type RecipeVariant = 'warm' | 'green';

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};

export type PreparationStep = {
  id: string;
  order: number;
  description: string;
  checked: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  servings: string;
  category: string;
  favorite: boolean;
  isFavorite?: boolean;
  variant: RecipeVariant;
  imageUrl?: string;
  ingredients: Ingredient[];
  steps: PreparationStep[];
};

export type ShoppingListItem = {
  id: string;
  recipeId: string;
  recipeTitle: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};