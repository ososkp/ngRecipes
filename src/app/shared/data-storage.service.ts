import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { RecipeService } from '../recipes/recipe.service';
import { FirebaseAccessService } from './firebase-access.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipesUrl: string = '';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService,
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