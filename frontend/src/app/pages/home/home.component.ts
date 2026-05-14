import { Component } from '@angular/core';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { MOCK_RECIPES } from '../../shared/data/mock.recipes';
import { Recipe } from '../../core/models/recipe.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  recipes: Recipe[] = MOCK_RECIPES;
}
