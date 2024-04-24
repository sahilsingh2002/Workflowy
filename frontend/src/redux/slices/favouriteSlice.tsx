import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Workspace {
  content: string;
  created_at: number;
  favourite: boolean;
  favpos: number;
  icon: string;
  name: string;
  owner: string;
  position: number;
  sections: string[];
  updated_at: number;
  _id: string;
}
export interface FavdataArray extends Array<Workspace> {}
export interface FavouriteState {
    
    value:FavdataArray,
}


const initialState: FavouriteState = {
    
    value: [],
};

export const favouriteSlice = createSlice({
    name: 'faourite',
    initialState,
    reducers: {
        setFav: (state, action: PayloadAction<FavdataArray>) => {
            state.value = action.payload 
        },
    }
});

export const { setFav } = favouriteSlice.actions;

export default favouriteSlice.reducer;