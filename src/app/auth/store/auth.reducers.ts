import {User} from '../user.model';
import * as fromAuthActions from './auth.actions';
import * as AuthActions from './auth.actions';


export interface State {
  user : User;
  authError : string,
  loading : boolean
}

export const initialState: State = {
 user: null,
 authError: null,
 loading :false
}

export function AuthReducer(state= initialState, action:AuthActions.AuthActions) {
  switch(action.type){
    case fromAuthActions.AUTHENTICATE_SUCCESS :
      const user = new User(action.payload.email,action.payload.userId,action.payload.token,action.payload.expirationDate);
      return {
        ...state,
        user,
        authError: null,
        loading: false
      }
    case fromAuthActions.AUTHENTICATE_FAIL :
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      }
    case fromAuthActions.LOGIN_START:
    case fromAuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      }
    case fromAuthActions.LOGOUT :
      return {
        ...state,
        user: null,
        authError: null,
        loading: false
      }
    case fromAuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      }
    default:
      return state;
  }
}
