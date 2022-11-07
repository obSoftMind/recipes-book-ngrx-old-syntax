import { Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducers';
import * as AuthAction from '../auth/store/auth.actions';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  authSub : Subscription;

  constructor(private dataStorageService :DataStorageService, private authService: AuthService,
    private router : Router, 
    private store: Store<fromApp.AppState>) { }


  

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
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogOut(){
    this.store.dispatch(new AuthAction.Logout());
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
