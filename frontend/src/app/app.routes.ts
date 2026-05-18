import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'receitas/nova', component: NewRecipeComponent },
  { path: 'receitas/:id', component: RecipeDetailsComponent },
  { path: '**', redirectTo: '' }
];