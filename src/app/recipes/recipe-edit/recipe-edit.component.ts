import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducers';
import * as RecipesActions from '../../recipes/store/recipes.actions';
import { Store } from '@ngrx/store';
import { map,Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id : number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription
  constructor(
    private route : ActivatedRoute, 
    private router : Router, private store : Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
    .subscribe( 
      (params : Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null; // undefined != null --> false
        //--> LA FAMEUSE ERREUR this.editMode = params['id'] !== null;// undefined !== null -->true
        this.initForm();
      } 
    );
  }

  onSubmit(){
    if(this.editMode){
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}))
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }else{
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
      // this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  get ingredients(){
    return (<UntypedFormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient(){
    (<UntypedFormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }))
  }

  onDeleteIngredient(index : number){
    (<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  private initForm(){
    let recipeName = '';
    let recipeImagePath='';
    let recipeDescription= '';
    let recipeIngredients = new UntypedFormArray([]);
  
    if(this.editMode){
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipes').pipe(
        map(recipesState => {
          return recipesState.recipes.find( (recipe, index) => {
            return index === this.id
          })
        })
      ).subscribe( recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        
        if(recipe['ingredients']){
          for(let ingredient of recipe.ingredients)[
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount':  new FormControl(ingredient.amount,
                [Validators.required, 
                Validators.pattern(/^[1-9]+[0-9]*$/)])
            }))
          ]
        }
      })
    }
    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName, Validators.required),
      'imagePath' : new FormControl(recipeImagePath,Validators.required),
      'description' : new FormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredients
    })
  }
  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
}
