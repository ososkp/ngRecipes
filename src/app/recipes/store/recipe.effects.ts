import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as RecipesActions from '../store/recipe.actions';
import { Recipe } from '../recipe.model';
import { environment } from 'src/environments/environment';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  recipesUrl: string = '';

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(this.recipesUrl);
    }),
    // At this point we have the http observable and pipe just moves on to the next functions
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    }),
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    // Merge a value from another observable into this observable stream
    withLatestFrom(this.store.select('recipes')),
    // switchMap given results from previous functions in order
    switchMap(([actionData, recipesState]) => {
      // Firebase 'put' lets us post multiple with overwriting
      return this.http.put(this.recipesUrl, recipesState.recipes)
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {
    this.recipesUrl = environment.recipesUrl;
  }
}