import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients : Ingredient[];
  ingredientsSubscription : Subscription
  constructor(private shoppingListService : ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsSubscription = this.shoppingListService.ingredientsChanged
    .subscribe( (ingredients:Ingredient[]) => {
      this.ingredients =  ingredients;
      }
    )
  }

  onEditIngredient(index : number) {
    this.shoppingListService.startedEditingIngredient.next(index)
  }
  ngOnDestroy(): void {
    if(this.ingredientsSubscription !== null){
      this.ingredientsSubscription.unsubscribe();
    }
  }
}
