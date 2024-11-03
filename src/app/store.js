import {configureStore} from '@reduxjs/toolkit'
import cartReducer from '../store/shoppingCardSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
})