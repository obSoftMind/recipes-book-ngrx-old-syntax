
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducers';
import * as fromRecipes from '../recipes/store/recipes.reducers';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  shoppingList:fromShoppingList.State;
  auth: fromAuth.State
  recipes : fromRecipes.State
}

export const appReducer: ActionReducerMap<AppState> ={
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.AuthReducer,
  recipes: fromRecipes.recipesReducer
}