import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  subscription : Subscription;
  recipes : Recipe[] = [];

  constructor(private router: Router, 
    private route : ActivatedRoute, private store : Store<fromApp.AppState>) {}

  ngOnInit(){
    this.subscription = this.store.select('recipes').pipe( map( (recipesState) => recipesState.recipes)).subscribe((recipes :Recipe[]) => this.recipes = recipes);
  }

  ngOnDestroy(): void {
    if(this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo: this.route});
  }
}
