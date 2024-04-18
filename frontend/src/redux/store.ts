import {configureStore} from "@reduxjs/toolkit";
import userReducer from '@/redux/slices/userSlice'
import workspaceReducer from './slices/workspaceSlice';
import favouriteReducer from './slices/favouriteSlice';

export const store = configureStore({
    reducer:{
        user:userReducer,
        workspace:workspaceReducer,
        favourite:favouriteReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch