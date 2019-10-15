import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = true;
  isAuthenticated: boolean = false;
  private userSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>
  ) { }

  ngOnInit () {
   this.userSubscription = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
      this.isAuthenticated = !!user;  // Shorthand for a ternary
    });
  }

  onSaveData () {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData () {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout () {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy () {
    this.userSubscription.unsubscribe();
  }
}