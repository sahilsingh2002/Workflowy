import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    
    username: string;
    email: string;
    name: string;
}

const initialState: UserState = {
    
    username: "",
    email: "",
    name:""
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeUser: (state, action: PayloadAction<UserState>) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.name = action.payload.name;
        }
    }
});

export const { changeUser } = userSlice.actions;

export default userSlice.reducer;