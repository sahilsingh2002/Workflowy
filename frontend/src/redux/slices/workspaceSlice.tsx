import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentData {
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

 export interface ContentDataArray extends Array<ContentData> {}
interface WorkspaceState {
    
    value:ContentDataArray,
}

const initialState: WorkspaceState = {
    
    value: [],
};

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWork: (state, action: PayloadAction<ContentDataArray>) => {
            state.value = action.payload
            
        }
    }
});

export const { setWork } = workspaceSlice.actions;

export default workspaceSlice.reducer;