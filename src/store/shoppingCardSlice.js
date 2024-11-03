import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
};

const shoppingCard = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }
            state.totalQuantity += 1;
            state.totalPrice += action.payload.price || 0;
        },
        removeFromCart: (state, action) => {
            const itemToRemove = state.cartItems.find(item => item.id === action.payload);
            if (itemToRemove) {
                state.totalQuantity -= itemToRemove.quantity;
                state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
                state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = shoppingCard.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
export const selectTotalPrice = (state) => state.cart.totalPrice;

export default shoppingCard.reducer;
