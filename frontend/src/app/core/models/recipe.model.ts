export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface PreparationStep {
  id: string;
  order: number;
  description: string;
  checked: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil' | 'Rápida';
  time: string;
  servings: string;
  category: string;
  imageUrl?: string;
  favorite: boolean;
  variant: 'warm' | 'green';
  ingredients: Ingredient[];
  steps: PreparationStep[];
}