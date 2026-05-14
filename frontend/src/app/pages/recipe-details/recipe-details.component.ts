import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MOCK_RECIPES } from '../../shared/data/mock.recipes';
import { Ingredient, PreparationStep, Recipe } from '../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly recipeId = this.route.snapshot.paramMap.get('id');

  recipe: Recipe | undefined = this.getRecipe();
  isEditingList = false;
  newIngredientName = '';
  newIngredientQuantity = 1;
  newIngredientUnit = '';
  newStepDescription = '';

  private getRecipe(): Recipe | undefined {
    const recipe = MOCK_RECIPES.find((recipe) => recipe.id === this.recipeId);

    if (!recipe) {
      return undefined;
    }

    return {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
      steps: recipe.steps.map((step) => ({ ...step }))
    };
  }

  toggleIngredient(ingredient: Ingredient): void {
    ingredient.checked = !ingredient.checked;
  }

  toggleStep(step: PreparationStep): void {
    step.checked = !step.checked;
  }

  toggleEditList(): void {
    this.isEditingList = !this.isEditingList;
  }

  addIngredient(): void {
    if (!this.recipe || !this.newIngredientName.trim()) {
      return;
    }

    this.recipe.ingredients.push({
      id: crypto.randomUUID(),
      name: this.newIngredientName.trim(),
      quantity: this.newIngredientQuantity,
      unit: this.newIngredientUnit.trim(),
      checked: false
    });

    this.newIngredientName = '';
    this.newIngredientQuantity = 1;
    this.newIngredientUnit = '';
  }

  removeIngredient(ingredientId: string): void {
    if (!this.recipe) {
      return;
    }

    this.recipe.ingredients = this.recipe.ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId
    );
  }

  addStep(): void {
    if (!this.recipe || !this.newStepDescription.trim()) {
      return;
    }

    this.recipe.steps.push({
      id: crypto.randomUUID(),
      order: this.recipe.steps.length + 1,
      description: this.newStepDescription.trim(),
      checked: false
    });

    this.newStepDescription = '';
  }

  removeStep(stepId: string): void {
    if (!this.recipe) {
      return;
    }

    this.recipe.steps = this.recipe.steps
      .filter((step) => step.id !== stepId)
      .map((step, index) => ({
        ...step,
        order: index + 1
      }));
  }
}
