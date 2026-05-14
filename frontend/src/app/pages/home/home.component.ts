import { Component } from '@angular/core';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  recipes = [
    {
      title: 'Massa ao molho rústico',
      description: 'Simples, confortável e cheia de sabor.',
      difficulty: 'Fácil',
      time: '35 min',
      servings: '2 porções',
      category: 'Jantar',
      variant: 'warm' as const
    },
    {
      title: 'Salada de ervas frescas',
      description: 'Leve, prática e perfeita para acompanhar.',
      difficulty: 'Rápida',
      time: '15 min',
      servings: '1 porção',
      category: 'Saudável',
      variant: 'green' as const
    }
  ];
}