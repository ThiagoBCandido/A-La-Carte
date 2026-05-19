import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeStorageService } from '../../core/services/recipe-storage.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

type CategorySummary = {
  name: string;
  count: number;
  description: string;
  sample: string;
};

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgClass, RouterLink, RecipeCardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly recipeStorage = inject(RecipeStorageService);
  private readonly allCategoriesFilter = 'Todas';

  recipes: Recipe[] = [];
  selectedCategory = this.allCategoriesFilter;

  get totalRecipes(): number {
    return this.recipes.length;
  }

  get categorySummaries(): CategorySummary[] {
    const groupedRecipes = new Map<string, Recipe[]>();

    this.recipes.forEach((recipe) => {
      const category = this.normalizeCategory(recipe.category);
      const recipes = groupedRecipes.get(category) ?? [];

      groupedRecipes.set(category, [...recipes, recipe]);
    });

    return Array.from(groupedRecipes.entries()).sort(([firstCategory], [secondCategory]) => {
        return firstCategory.localeCompare(secondCategory, 'pt-BR');
      }).map(([category, recipes]) => ({
        name: category,
        count: recipes.length,
        description: this.getCategoryDescription(category, recipes.length),
        sample: this.getRecipeSample(recipes)
      }));
  }

  get visibleRecipes(): Recipe[] {
    if (this.selectedCategory === this.allCategoriesFilter) {
      return this.recipes;
    }

    return this.recipes.filter((recipe) => {
      return this.normalizeCategory(recipe.category) === this.selectedCategory;
    });
  }

  get selectedCategoryTitle(): string {
    if (this.selectedCategory === this.allCategoriesFilter) {
      return 'Todas as receitas';
    }

    return this.selectedCategory;
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  toggleFavorite(recipeId: unknown): void {
    const normalizedRecipeId = String(recipeId);
    const recipe = this.recipeStorage.getRecipeById(normalizedRecipeId);
    if (!recipe) {
      return;
    }

    const nextFavoriteValue = !Boolean(recipe.favorite);
    const updatedRecipe = {
      ...recipe, favorite: nextFavoriteValue
    };

    (updatedRecipe as Recipe & { isFavorite?: boolean }).isFavorite = nextFavoriteValue;
    this.recipeStorage.updateRecipe(updatedRecipe);
    this.loadRecipes();
  }

  private loadRecipes(): void {
    this.recipes = this.recipeStorage.getRecipes();

    const selectedCategoryExists = this.selectedCategory === this.allCategoriesFilter || this.categorySummaries.some((category) => category.name === this.selectedCategory);
    if (!selectedCategoryExists) {
      this.selectedCategory = this.allCategoriesFilter;
    }
  }

  private normalizeCategory(category: string | undefined): string {
    const normalizedCategory = category?.trim();
    return normalizedCategory ? normalizedCategory : 'Sem categoria';
  }

  private getRecipeSample(recipes: Recipe[]): string {
    return recipes.slice(0, 2).map((recipe) => recipe.title).join(' • ');
  }

  private getCategoryDescription(category: string, count: number): string {
    const normalizedCategory = category.toLowerCase();

    if (
      normalizedCategory.includes('doce') ||
      normalizedCategory.includes('sobremesa') ||
      normalizedCategory.includes('confeitaria')
    ) {
      return 'Receitas doces, sobremesas e preparos de confeitaria.';
    }

    if (
      normalizedCategory.includes('jantar') ||
      normalizedCategory.includes('almoço') ||
      normalizedCategory.includes('massa')
    ) {
      return 'Pratos principais para refeições completas.';
    }

    if (
      normalizedCategory.includes('saudável') ||
      normalizedCategory.includes('leve') ||
      normalizedCategory.includes('salada')
    ) {
      return 'Opções leves, práticas e equilibradas.';
    }

    if (
      normalizedCategory.includes('lanche') ||
      normalizedCategory.includes('rápida') ||
      normalizedCategory.includes('rapida')
    ) {
      return 'Receitas práticas para o dia a dia.';
    }

    return `${count} receita${count > 1 ? 's' : ''} cadastrada${count > 1 ? 's' : ''} nesta categoria.`;
  }
}