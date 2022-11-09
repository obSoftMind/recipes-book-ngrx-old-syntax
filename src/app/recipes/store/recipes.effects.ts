import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map,switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducers';
import { Store } from "@ngrx/store";

@Injectable()

export class RecipesEffects {
  
  BASE_URL_FIREBASE =`https://recipes-book-ngrx-default-rtdb.europe-west1.firebasedatabase.app/recipes.json`;
 
  fetchRecipes$ = createEffect(
    () => this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap( () => {
        return this.http.get<Recipe[]>(this.BASE_URL_FIREBASE)
      }),
      map( recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe, 
            ingredients : recipe.ingredients ? recipe.ingredients : []
          }
        })
      }),
      map( (recipes) => {
        return new RecipesActions.SetRecipes(recipes)
      })
    ),{dispatch: true}
  )
  

  storeRecipes$ = createEffect(
    () => this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap( ([actionData, recipesState]) => {
        return this.http.put(this.BASE_URL_FIREBASE,recipesState.recipes)
      })
    ),{dispatch: false}
  )

  constructor(private actions$ : Actions, private http : HttpClient, private store : Store<fromApp.AppState>) {}
}