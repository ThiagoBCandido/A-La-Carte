import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Ingredient, PreparationStep, Recipe } from '../../core/models/recipe.model';
import { RecipeStorageService } from '../../core/services/recipe-storage.service';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeStorage = inject(RecipeStorageService);

  private readonly recipeId = this.route.snapshot.paramMap.get('id');
  private shoppingListFeedbackTimeout?: ReturnType<typeof setTimeout>;

  recipe: Recipe | undefined = this.getRecipe();

  isEditingList = false;
  showDeleteDialog = false;
  shoppingListFeedback = '';
  newIngredientName = '';
  newIngredientQuantity = 1;
  newIngredientUnit = '';
  newStepDescription = '';

  private getRecipe(): Recipe | undefined {
    return this.recipeStorage.getRecipeById(this.recipeId);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.recipe) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (!this.recipe) {
        return;
      }

      this.recipe.imageUrl = String(reader.result);
      this.recipeStorage.updateRecipe(this.recipe);
    };

    reader.readAsDataURL(file);
    input.value = '';
  }

  removePhoto(): void {
    if (!this.recipe) {
      return;
    }

    this.recipe.imageUrl = undefined;
    this.recipeStorage.updateRecipe(this.recipe);
  }

  addIngredientsToShoppingList(): void {
    if (!this.recipe) {
      return;
    }

    const addedItems = this.recipeStorage.addRecipeIngredientsToShoppingList(this.recipe.id);

    this.shoppingListFeedback =
      addedItems > 0
        ? `${addedItems} ingrediente${addedItems > 1 ? 's' : ''} adicionado${addedItems > 1 ? 's' : ''} à lista.`
        : 'Os ingredientes desta receita já estão na lista.';

    if (this.shoppingListFeedbackTimeout) {
      clearTimeout(this.shoppingListFeedbackTimeout);
    }

    this.shoppingListFeedbackTimeout = setTimeout(() => {
      this.shoppingListFeedback = '';
    }, 2600);
  }

  toggleIngredient(ingredient: Ingredient): void {
    ingredient.checked = !ingredient.checked;

    if (this.recipe) {
      this.recipeStorage.updateRecipe(this.recipe);
    }
  }

  toggleStep(step: PreparationStep): void {
    step.checked = !step.checked;

    if (this.recipe) {
      this.recipeStorage.updateRecipe(this.recipe);
    }
  }

  toggleEditList(): void {
    this.isEditingList = !this.isEditingList;

    if (!this.isEditingList && this.recipe) {
      this.recipeStorage.updateRecipe(this.recipe);
    }
  }

  addIngredient(): void {
    if (!this.recipe || !this.newIngredientName.trim()) {
      return;
    }

    this.recipe.ingredients.push({
      id: this.createId(),
      name: this.newIngredientName.trim(),
      quantity: this.newIngredientQuantity,
      unit: this.newIngredientUnit.trim(),
      checked: false
    });

    this.newIngredientName = '';
    this.newIngredientQuantity = 1;
    this.newIngredientUnit = '';

    this.recipeStorage.updateRecipe(this.recipe);
  }

  removeIngredient(ingredientId: string): void {
    if (!this.recipe) {
      return;
    }

    this.recipe.ingredients = this.recipe.ingredients.filter(
      (ingredient) => String(ingredient.id) !== String(ingredientId)
    );

    this.recipeStorage.updateRecipe(this.recipe);
  }

  addStep(): void {
    if (!this.recipe || !this.newStepDescription.trim()) {
      return;
    }

    this.recipe.steps.push({
      id: this.createId(),
      order: this.recipe.steps.length + 1,
      description: this.newStepDescription.trim(),
      checked: false
    });

    this.newStepDescription = '';

    this.recipeStorage.updateRecipe(this.recipe);
  }

  removeStep(stepId: string): void {
    if (!this.recipe) {
      return;
    }

    this.recipe.steps = this.recipe.steps
      .filter((step) => String(step.id) !== String(stepId))
      .map((step, index) => ({
        ...step,
        order: index + 1
      }));

    this.recipeStorage.updateRecipe(this.recipe);
  }

  openDeleteDialog(): void {
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
  }

  confirmDeleteRecipe(): void {
    if (!this.recipe) {
      return;
    }

    this.recipeStorage.deleteRecipe(this.recipe.id);
    this.showDeleteDialog = false;
    this.router.navigate(['/']);
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}