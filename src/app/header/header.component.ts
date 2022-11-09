import { Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducers';
import * as AuthAction from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  authSub : Subscription;

  constructor(private router : Router, private store: Store<fromApp.AppState>) { }


  

  ngOnInit(): void {
    this.authSub = this.store.select('auth')
    .pipe(
      map(authState => authState.user)
    )
    .subscribe(
      user => {
        this.isAuthenticated = !!user;
      }
    )
  }

  onSaveData(){
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData(){
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogOut(){
    this.store.dispatch(new AuthAction.Logout());
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
