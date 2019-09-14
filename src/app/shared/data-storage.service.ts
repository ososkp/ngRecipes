import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipesUrl: string = '';

  constructor(private http: HttpClient,
              private recipeService: RecipeService) {
    this.recipesUrl = environment.recipesUrl;
  }

  storeRecipes () {
    const recipes = this.recipeService.getRecipes();
    // Firebase 'put' lets us post multiple with overwriting
    this.http.put(this.recipesUrl, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes () {
        return this.http
          .get<Recipe[]>(this.recipesUrl)
          .pipe(
    // At this point we have the http observable and pipe just moves on to the next functions
            map(recipes => {
              return recipes.map(recipe => {
                return {
                  ...recipe,
                  ingredients: recipe.ingredients ? recipe.ingredients : []
                };
              });
            }),
            tap(recipes => {
              this.recipeService.setRecipes(recipes);
            })
          );
  }
}