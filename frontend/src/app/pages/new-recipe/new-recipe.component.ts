import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeStorageService } from '../../core/services/recipe-storage.service';

type NewRecipeIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type NewRecipeStep = {
  id: string;
  description: string;
};

@Component({
  selector: 'app-new-recipe',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.css'
})
export class NewRecipeComponent {
  private readonly router = inject(Router);
  private readonly recipeStorage = inject(RecipeStorageService);

  title = '';
  description = '';
  category = '';
  difficulty: Recipe['difficulty'] = 'Média';
  time = '';
  servings: number | null = null;

  newIngredientName = '';
  newIngredientQuantity: number | null = null;
  newIngredientUnit = '';

  newStepDescription = '';

  ingredients: NewRecipeIngredient[] = [];
  steps: NewRecipeStep[] = [];

  get canSave(): boolean {
    return (
      this.title.trim().length > 0 &&
      this.description.trim().length > 0 &&
      this.category.trim().length > 0 &&
      this.time.trim().length > 0 &&
      this.servings !== null &&
      this.servings > 0 &&
      this.ingredients.length > 0 &&
      this.steps.length > 0
    );
  }

  addIngredient(): void {
    const name = this.newIngredientName.trim();
    const unit = this.newIngredientUnit.trim();

    if (!name || this.newIngredientQuantity === null || this.newIngredientQuantity <= 0 || !unit) {
      return;
    }

    this.ingredients.push({
      id: this.createId(),
      name,
      quantity: this.newIngredientQuantity,
      unit
    });

    this.newIngredientName = '';
    this.newIngredientQuantity = null;
    this.newIngredientUnit = '';
  }

  removeIngredient(id: string): void {
    this.ingredients = this.ingredients.filter((ingredient) => ingredient.id !== id);
  }

  addStep(): void {
    const description = this.newStepDescription.trim();

    if (!description) {
      return;
    }

    this.steps.push({
      id: this.createId(),
      description
    });

    this.newStepDescription = '';
  }

  removeStep(id: string): void {
    this.steps = this.steps.filter((step) => step.id !== id);
  }

  saveRecipe(): void {
    if (!this.canSave || this.servings === null) {
      return;
    }

    const recipe = this.recipeStorage.addRecipe({
      title: this.title.trim(),
      description: this.description.trim(),
      category: this.category.trim(),
      difficulty: this.difficulty,
      time: this.time.trim(),
      servings: this.formatServings(this.servings),
      ingredients: this.ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit
      })),
      steps: this.steps.map((step) => ({
        description: step.description
      }))
    });

    this.router.navigate(['/receitas', recipe.id]);
  }

  private formatServings(servings: number): string {
    return servings === 1 ? '1 porção' : `${servings} porções`;
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}