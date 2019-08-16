import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A German treat',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1600px-Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
        new Ingredient('Lemon', 1)
      ]),
    new Recipe(
      'Big Fat Burger',
      'The ultimate food',
      'https://upload.wikimedia.org/wikipedia/commons/9/9a/Big_Mac_hamburger.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Lettuce', 1),
        new Ingredient('Sauce', 1),
        new Ingredient('Pickles', 4),
        new Ingredient('Meat', 1)
      ])
  ];

  constructor (private shoppingListService: ShoppingListService) {}

  getRecipes () {
    return this.recipes.slice();  // slice() to return a copy, not a reference to the original
  }

  addToShoppingList (ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients)
  }
}