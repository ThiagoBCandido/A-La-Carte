import { Recipe } from '../../core/models/recipe.model';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Massa ao molho rústico',
    description: 'Simples, confortável e cheia de sabor.',
    difficulty: 'Fácil',
    time: '35 min',
    servings: '2 porções',
    category: 'Jantar',
    favorite: true,
    variant: 'warm',
    ingredients: [
      {
        id: '1',
        name: 'Macarrão',
        quantity: 250,
        unit: 'g',
        checked: false
      },
      {
        id: '2',
        name: 'Tomate pelado',
        quantity: 1,
        unit: 'lata',
        checked: false
      },
      {
        id: '3',
        name: 'Alho',
        quantity: 2,
        unit: 'dentes',
        checked: false
      }
    ],

    steps: [
    {
      id: '1',
      order: 1,
      description: 'Cozinhe a massa até ficar al dente.',
      checked: false
    },
    {
      id: '2',
      order: 2,
      description: 'Prepare o molho com alho, tomate e temperos.',
      checked: false
    },
    {
      id: '3',
      order: 3,
      description: 'Misture a massa ao molho e finalize ainda quente.',
      checked: false
    }
  ]
  },
  {
    id: '2',
    title: 'Salada de ervas frescas',
    description: 'Leve, prática e perfeita para acompanhar.',
    difficulty: 'Rápida',
    time: '15 min',
    servings: '1 porção',
    category: 'Saudável',
    favorite: false,
    variant: 'green',
    ingredients: [
      {
        id: '1',
        name: 'Alface',
        quantity: 1,
        unit: 'maço',
        checked: false
      },
      {
        id: '2',
        name: 'Manjericão',
        quantity: 10,
        unit: 'folhas',
        checked: false
      },
      {
        id: '3',
        name: 'Azeite',
        quantity: 2,
        unit: 'colheres',
        checked: false
      }
    ],
    
    steps: [
    {
      id: '1',
      order: 1,
      description: 'Cozinhe a massa até ficar al dente.',
      checked: false
    },
    {
      id: '2',
      order: 2,
      description: 'Prepare o molho com alho, tomate e temperos.',
      checked: false
    },
    {
      id: '3',
      order: 3,
      description: 'Misture a massa ao molho e finalize ainda quente.',
      checked: false
    }
  ]
  }
];