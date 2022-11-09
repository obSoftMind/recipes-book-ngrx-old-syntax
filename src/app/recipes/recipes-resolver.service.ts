import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, of, switchMap, take } from "rxjs";
import { Recipe } from "./recipe.model";
import * as RecipesActions from '../recipes/store/recipes.actions';
import * as fromApp from '../store/app.reducers';

@Injectable({
  providedIn : 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {
  }
  resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot){
    // const recipes = this.recipeService.getRecipes();
    // if(recipes.length === 0){
       // le resolver va souscrir automatiquement au data 
    //   return this.dataStorageService.fetchRecipes();
    // }else{
    //   return recipes;
    // }
    return this.store.select('recipes').pipe(
      take(1),
      map( recipesState => recipesState.recipes),
      switchMap( recipes => {
        if(recipes.length === 0){
          // le resolver va dispatcher fetchRecipe but then also waits for recipes to be set
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe( 
            ofType(RecipesActions.SET_RECIPES), 
            take(1));
        }else {
          return of(recipes);
        }
      })
    )
  }
}