import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = true;
  isAuthenticated: boolean = false;
  private userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>
  ) { }

  ngOnInit () {
   this.userSubscription = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
      this.isAuthenticated = !!user;  // Shorthand for a ternary
    });
  }

  onSaveData () {
    this.dataStorageService.storeRecipes();
  }

  onFetchData () {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout () {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy () {
    this.userSubscription.unsubscribe();
  }
}