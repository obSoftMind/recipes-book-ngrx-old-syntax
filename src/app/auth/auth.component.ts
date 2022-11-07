import { Component,OnDestroy,OnInit} from "@angular/core";
import { NgForm } from "@angular/forms";
import * as fromApp from '../store/app.reducers';
import * as AuthActions from './store/auth.actions';
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl:'./auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string;
  storeSub:Subscription
  constructor(private store : Store<fromApp.AppState>){}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading= authState.loading,
      this.error= authState.authError
    })
  }

  onSwitchMode(){
   this.isLoginMode = !this.isLoginMode;
  }

  onAuthSubmit(form: NgForm){
  
    if(!form.valid){
      return;
    }
    this.isLoading = true;
    if(this.isLoginMode){
      this.store.dispatch(new AuthActions.LoginStart({email: form.value.email, password: form.value.password}));
    }else{
      this.store.dispatch(new AuthActions.SignupStart({email: form.value.email, password: form.value.password}))
    }
    form.reset();
  }

  onHAndleError(){
   this.store.dispatch(new AuthActions.ClearError());
  }
  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
}