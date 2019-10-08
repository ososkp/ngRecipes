import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private loggingService: LoggingService,
              // Store type is reducer (key, from Module) and what it yields (value)
              private store: Store<fromApp.AppState>) { }  // Import app state as seen from shopping list reducer only, which is all we care about here

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit.')
  }

  onEditItem (index: number) {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
