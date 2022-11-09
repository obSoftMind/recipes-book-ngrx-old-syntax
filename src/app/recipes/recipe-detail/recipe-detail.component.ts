import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import * as fromApp from '../../store/app.reducers';
import * as RecipesActions from '../../recipes/store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe : Recipe
  id: number;
  constructor(private route:ActivatedRoute, private router : Router, private store : Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map((params) => {
        return +params['id']
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState=> {
        return recipesState.recipes.find((recipe, index) => {
          return index===this.id;
        })
      })
    ).subscribe( (recipes) => this.recipe = recipes);
    // .subscribe(
    //   (params : Params) => {
    //     this.id = +params['id'];
         // this.recipe = this.recipeService.getRecipe(this.id);
    //     this.store.select('recipes').pipe(
    //       map(recipesState=> {
    //         return recipesState.recipes.find( (recipe, index) => {
    //           return index===this.id;
    //         })
    //       })
    //     ).subscribe( (recipes) => this.recipe = recipes);
    //   }
    // )
  }
  onAddIngredientsToShoppingList(){
   this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }
  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo:this.route})
  }
  onDeleteRecipe(){
    this.store.dispatch( new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipe']);
  }
}
