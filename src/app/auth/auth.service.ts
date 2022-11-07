import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Store } from "@ngrx/store";
import * as fromAuthActions from './store/auth.actions'
import * as fromApp from '../store/app.reducers';


@Injectable({
  providedIn : 'root'
})
export class AuthService {
 
  tokenExpirationTimer : any
  BASE_URL_SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
  BASE_URL_SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;

  constructor(private store: Store<fromApp.AppState>){}

  setLogoutTimer(expirationDuration : number){
    this.tokenExpirationTimer = setTimeout( () => {
     this.store.dispatch(new fromAuthActions.Logout())
    },expirationDuration);
  }

  clearLogoutTimer() {
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}