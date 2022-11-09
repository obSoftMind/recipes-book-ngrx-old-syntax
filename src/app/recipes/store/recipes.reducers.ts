import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface State{
  recipes : Recipe[];
}

export const initialState: State = {
 recipes: []
}

export function recipesReducer(state = initialState, action : RecipesActions.RecipesActions){
  switch(action.type){
    case RecipesActions.SET_RECIPES :
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipesActions.FETCH_RECIPES :
      return {
        ...state
      }

    case RecipesActions.STORE_RECIPES :
      return {
        ...state
      }
    case RecipesActions.ADD_RECIPE :
      return {
        ...state,
        recipe:[...state.recipes, action.payload]
      }
    case RecipesActions.DELET_RECIPE :
      return {
        ...state,
        recipes: state.recipes.filter( (recipe, index) => {
          return  index !== action.payload;
        })
      } 
    case RecipesActions.UPDATE_RECIPE :
      const updatedRecipe =  {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe
      }
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index]= updatedRecipe;
      return {
        ...state,
        recipes:updatedRecipes
      } 
    default:
      return state;
  }
}