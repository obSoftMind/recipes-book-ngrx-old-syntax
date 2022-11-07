import { Injectable } from "@angular/core";
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot,
  UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";

import * as fromApp from '../store/app.reducers';
import { Store } from "@ngrx/store";

@Injectable({providedIn : 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router : Router, private store : Store<fromApp.AppState>){
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store.select('auth')
    .pipe(
      take(1),
      map( authState => authState.user),
      map(user=>{
        const isAuth = !!user;
        if(isAuth){
          return true;
        }
        return this.router.createUrlTree(['/auth']) // new way to redirect
      }),
      // tap((isAuth)=> {    // old way to redirect
      //   if(!isAuth){
      //     this.router.navigate(['/auth']);
      //   }
      // })
    )
  }
}