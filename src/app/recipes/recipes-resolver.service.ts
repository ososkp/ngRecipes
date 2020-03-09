import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        // Only send a request if we don't have local recipes
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          // The resolver dispatches, but then waits for SET_RECIPES to happen
          // Ensuring we won't load the page before we have the recipes
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          ); // Take 1 then unsubscribe
        } else {
          return of(recipes);
        }
      })
    );

  }
}