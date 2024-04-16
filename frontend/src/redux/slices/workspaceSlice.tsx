import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceState {
    
    value:[],
}

const initialState: WorkspaceState = {
    
    value: [],
};

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWork: (state, action: PayloadAction<WorkspaceState>) => {
            state.value = action.payload
            
        }
    }
});

export const { setWork } = workspaceSlice.actions;

export default workspaceSlice.reducer;