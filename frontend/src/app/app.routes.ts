import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';

import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ShoppingListComponent } from './pages/shopping-list/shopping-list.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'receitas',
    pathMatch: 'full',
  },
  {
    path: 'receitas',
    component: HomeComponent,
  },
  {
    path: 'receitas/nova',
    component: NewRecipeComponent,
  },
  {
    path: 'receitas/:id',
    component: RecipeDetailsComponent,
  },
  {
    path: 'favoritas',
    component: FavoritesComponent,
  },
  {
    path: 'lista',
    component: ShoppingListComponent,
  },
  {
    path: 'categorias',
    component: CategoriesComponent,
  },
  {
    path: 'ajustes',
    component: SettingsComponent,
  },
  {
    path: '**',
    redirectTo: 'receitas',
  },
];