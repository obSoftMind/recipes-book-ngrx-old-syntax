import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/Ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('f', {static: true}) slForm : NgForm;
  editedIngredient : Ingredient;
  subscription : Subscription;
  editMode = false;
  editedIngredientIndex: number

  constructor(private shoppingListService :ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditingIngredient
    .subscribe( (index : number) => {
      this.editMode = true;
      this.editedIngredientIndex = index;
        this.editedIngredient = this.shoppingListService.getIngredient(this.editedIngredientIndex);
        this.slForm.setValue({
          'name': this.editedIngredient.name,
          'amount': this.editedIngredient.amount
        })
      }
    )
  }
  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.shoppingListService.updateIngredient(newIngredient, this.editedIngredientIndex)
    }else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
   this.slForm.reset();
  }

  onDeleteIngredient(){
    this.shoppingListService.deleteIngredient(this.editedIngredientIndex);
    this.onClearItem();
  }

  onClearItem(){
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy(){
    if(this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
}
