import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators'
import { RecipeService } from '../recipes/recipe.service';
import { FirebaseAccessService } from './firebase-access.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipesUrl: string = '';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private firebase: FirebaseAccessService) {
    this.recipesUrl = this.firebase.getRecipesUrl();
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
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe
        (map(recipes => {
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
      )
  }
}