import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id : number;
  editMode = false;
  recipeForm: UntypedFormGroup;

  constructor(
    private route : ActivatedRoute, 
    private recipeService : RecipeService, 
    private router : Router) { }

  ngOnInit(): void {
    this.route.params
    .subscribe( 
      (params : Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null; // undefined != null --> false
        //this.editMode = params['id'] !== null;// undefined !== null -->true
        this.initForm();
      } 
    );
  }

  onSubmit(){
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }else{
      this.recipeService.addRecipe(this.recipeForm.value);
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
    (<UntypedFormArray>this.recipeForm.get('ingredients')).push(new UntypedFormGroup({
      'name': new UntypedFormControl(null, Validators.required),
      'amount': new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
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
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      
      if(recipe['ingredients']){
        for(let ingredient of recipe.ingredients)[
          recipeIngredients.push(new UntypedFormGroup({
            'name': new UntypedFormControl(ingredient.name, Validators.required),
            'amount':  new UntypedFormControl(ingredient.amount,
              [Validators.required, 
              Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        ]
      }
    }
    this.recipeForm = new UntypedFormGroup({
      'name' : new UntypedFormControl(recipeName, Validators.required),
      'imagePath' : new UntypedFormControl(recipeImagePath,Validators.required),
      'description' : new UntypedFormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredients
    })
  }
}
