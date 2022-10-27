import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/Ingredient.model";


@Injectable({
    providedIn:'root'
})
export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>()
    startedEditingIngredient = new Subject<number>()

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];


    getIngredients(){
        return this.ingredients.slice();
    }
    getIngredient(index : number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(IngredientIndex : number){
        this.ingredients.splice(IngredientIndex,1)
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(newIngredient : Ingredient, IngredientIndex : number){
        this.ingredients.splice(IngredientIndex,1, newIngredient)
        this.ingredientsChanged.next(this.ingredients.slice());
    }
  
}