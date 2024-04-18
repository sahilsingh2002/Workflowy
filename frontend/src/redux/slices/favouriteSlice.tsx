import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouriteState {
    
    value:[],
}

const initialState: FavouriteState = {
    
    value: [],
};

export const favouriteSlice = createSlice({
    name: 'faourite',
    initialState,
    reducers: {
        setFav: (state, action: PayloadAction<FavouriteState>) => {
            state.value = action.payload
            
        },
    }
});

export const { setFav } = favouriteSlice.actions;

export default favouriteSlice.reducer;