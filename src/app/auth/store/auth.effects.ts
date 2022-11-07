import { Injectable } from "@angular/core";
import {Actions, createEffect,ofType} from '@ngrx/effects';
import { switchMap, map, tap, catchError, of} from "rxjs";
import * as  AuthActions from './auth.actions';
import { environment} from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";



export interface AuthResponseData {
  idToken : string;
  email:	string;
  refreshToken:	string;	
  expiresIn:	string;
  localId : string;
  registered?: boolean
}
// voir les helper, util...
const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
  let expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId,token,expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess( { email, userId, token, expirationDate} )
}

const handleError = (errorRes) => {
  // Unlike map, catchError does not automatically wrap what i return into an observable, so here
  // I need to create my own one 
  let errorMessage = 'An unknown error occurred!'
  if(!errorRes.error || !errorRes.error.error){
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch(errorRes.error.error.message){
    case 'EMAIL_EXISTS':
      errorMessage=`this email exists already`;
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage=`this email does not exists`;
      break;
    case 'INVALID_PASSWORD':
      errorMessage=`this email is not valid`;
      break;
  }
  return of( new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
  BASE_URL_SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
  BASE_URL_SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
  
  authSignup$= createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction : AuthActions.SignupStart) => {
        return this.httpClient.post<AuthResponseData>(this.BASE_URL_SIGNUP,{ email: signupAction.payload.email, password:  signupAction.payload.password, returnSecureToken: true})
        .pipe(
          tap( (resData) => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
          map( (resData: AuthResponseData) => {
            return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
           }
          ),
          catchError(errorRes => {
            return handleError(errorRes)
          })
        )
      })
    )
  )

  authLogin$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData : AuthActions.LoginStart) => {
        return this.httpClient.post<AuthResponseData>(this.BASE_URL_SIGNIN,{ email: authData.payload.email, password:  authData.payload.password, returnSecureToken: true})
        .pipe(
          tap( (resData) => this.authService.setLogoutTimer(+resData.expiresIn  * 1000)),
          map( (resData: AuthResponseData) => {
            return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn * 1000)
           }
          ),
          catchError(errorRes => {
            return handleError(errorRes)
          })
        )
      })
    ),
  );

  authRedirect$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap(() => this.router.navigateByUrl('/'))
    ), {dispatch: false}
  )
  
  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigateByUrl('/auth');
        })
      ),{dispatch: false}
  ) 
  
  autoLogin$ = createEffect(
    () => 
      this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(
          () => {
          let userData:  { email : string, id: string, _token:string, _tokenExpirationDate:string}  = JSON.parse(localStorage.getItem('userData'));
          if(!userData) return { type : 'DUMMY'}
          
          const loadedUser = new User(userData.email, userData.id, userData._token, new Date( userData._tokenExpirationDate));
         
          if(loadedUser.token){
            const expirationDuration =   new Date( userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);
            return new AuthActions.AuthenticateSuccess(
              {email:loadedUser.email,userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date( userData._tokenExpirationDate)}
            )
          }
          return { type : 'DUMMY'}
        })
      )
  )

  // un effect doit retourner par defaut une action

  // l'observable actions$ ne doit jamais cesser d'emmettre, si j'ajoute un catchError à la suite
  // de l'operateur switchMap: en cas d'erreur retourné par http, l'observable actions$ cessera d'emmttre (c'est un observable mort)
  // c'est la raison pour laquelle il faut d'abord traiter  l'observable avant de le retourné


  // important : quend il y action c'est l'effect qui s'en charge de la dispatché d'où {dispatch; false/true}
  constructor(
    private actions$:Actions, 
    private httpClient : HttpClient, 
    private router: Router,
    private authService: AuthService){
  }
}