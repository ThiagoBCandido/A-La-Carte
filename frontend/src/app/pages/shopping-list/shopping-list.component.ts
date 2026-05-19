import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShoppingListItem } from '../../core/models/recipe.model';
import { RecipeStorageService } from '../../core/services/recipe-storage.service';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit {
  private readonly recipeStorage = inject(RecipeStorageService);

  items: ShoppingListItem[] = [];

  get totalItems(): number {
    return this.items.length;
  }

  get pendingItems(): number {
    return this.items.filter((item) => !item.checked).length;
  }

  get checkedItems(): number {
    return this.items.filter((item) => item.checked).length;
  }

  ngOnInit(): void {
    this.loadItems();
  }

  toggleItem(itemId: string): void {
    this.items = this.recipeStorage.toggleShoppingListItem(itemId);
  }

  removeItem(itemId: string): void {
    this.items = this.recipeStorage.removeShoppingListItem(itemId);
  }

  clearList(): void {
    this.recipeStorage.clearShoppingList();
    this.loadItems();
  }

  private loadItems(): void {
    this.items = this.recipeStorage.getShoppingListItems();
  }
}