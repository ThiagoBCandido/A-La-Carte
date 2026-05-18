import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type NewRecipeIngredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};

type NewRecipeStep = {
  id: number;
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
  title = '';
  description = '';
  category = '';
  difficulty = 'Média';
  time = '';
  servings: number | null = null;

  newIngredientName = '';
  newIngredientQuantity: number | null = null;
  newIngredientUnit = '';

  newStepDescription = '';

  ingredients: NewRecipeIngredient[] = [];
  steps: NewRecipeStep[] = [];

  private nextIngredientId = 1;
  private nextStepId = 1;

  constructor(private router: Router) {}

  get canSave(): boolean {
    return (
      this.title.trim().length > 0 && this.description.trim().length > 0 &&
      this.category.trim().length > 0 && this.time.trim().length > 0 &&
      this.servings !== null && this.servings > 0 &&
      this.ingredients.length > 0 && this.steps.length > 0
    );
  }

  addIngredient(): void {
    const name = this.newIngredientName.trim();
    const unit = this.newIngredientUnit.trim();

    if (!name || this.newIngredientQuantity === null || this.newIngredientQuantity <= 0 || !unit) {
      return;
    }

    this.ingredients.push({
      id: this.nextIngredientId++,
      name,
      quantity: this.newIngredientQuantity,
      unit
    });

    this.newIngredientName = '';
    this.newIngredientQuantity = null;
    this.newIngredientUnit = '';
  }

  removeIngredient(id: number): void {
    this.ingredients = this.ingredients.filter((ingredient) => ingredient.id !== id);
  }

  addStep(): void {
    const description = this.newStepDescription.trim();

    if (!description) {
      return;
    }

    this.steps.push({
      id: this.nextStepId++,
      description
    });

    this.newStepDescription = '';
  }

  removeStep(id: number): void {
    this.steps = this.steps.filter((step) => step.id !== id);
  }

  saveRecipe(): void {
    if (!this.canSave) {
      return;
    }

    const newRecipe = {
      title: this.title.trim(),
      description: this.description.trim(),
      category: this.category.trim(),
      difficulty: this.difficulty,
      time: this.time.trim(),
      servings: this.servings,
      ingredients: this.ingredients,
      steps: this.steps
    };

    console.log('Nova receita:', newRecipe);

    this.router.navigate(['/']);
  }
}