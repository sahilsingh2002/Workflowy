import { createSlice, PayloadAction } from '@reduxjs/toolkit';

 interface UserState {
    
    username: string | null;
    email: string | null;
    name: string | null;
    role:'owner' | 'editor' | 'reader' | null;
}

const initialState: UserState = {
    
    username: null,
    email: null,
    name:null,
    role:null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeUser: (state, action: PayloadAction<UserState>) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.role=action.payload.role;
        },
        changeRole: (state, action: PayloadAction<'owner' | 'editor' | 'reader' | null>) => {
            state.role = action.payload;
        },
        
    }
});

export const { changeUser, changeRole } = userSlice.actions;

export default userSlice.reducer;