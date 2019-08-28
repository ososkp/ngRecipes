import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { RepositoryService } from '../services/repository.service';

export class ShoppingListService extends RepositoryService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10)
  ];

  getIngredients () {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.save(this.ingredients, this.ingredientsChanged);
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.save(this.ingredients, this.ingredientsChanged);
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.save(this.ingredients, this.ingredientsChanged);
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.save(this.ingredients, this.ingredientsChanged);
  }
}