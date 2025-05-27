import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectTotalPrice, removeFromCart, clearCart } from "../store/shoppingCardSlice";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaBasketShopping } from "react-icons/fa6";

function ShoppingCard() {
    const cartItems = useSelector(selectCartItems);
    const totalPrice = useSelector(selectTotalPrice);
    const dispatch = useDispatch();
    const [isCartOpen, setIsCartOpen] = useState(false);  

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen); 
    };

    return (
        <>
            <button
                className="fixed bottom-5 right-10 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg"
                onClick={toggleCart}
            >
                {isCartOpen ? "Close Cart" : <FaBasketShopping />}
            </button>

            <div
                className={`dark fixed top-16 right-0 w-[300px] h-full bg-white shadow-lg z-40 transition-transform transform ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <h2 className="dark text-xl font-bold p-4 text-white">Shopping Cart</h2>
                <ul className="p-4 dark">
                    {cartItems.map(item => (
                        <li key={item.id} className="dark hover:bg-zinc-700 p-3 rounded-lg flex justify-between items-center mb-2">
                            <div>
                                <p className="text-white font-bold">{item.name}</p>
                                <p className="text-white">Quantity: {item.quantity}</p>
                                <p className="text-white">Price: ${item.price}</p>
                            </div>
                            <Button
                                auto
                                color="danger"
                                onPress={() => dispatch(removeFromCart(item.id))}
                            >
                                Remove
                            </Button>
                        </li>
                    ))}
                </ul>
                <div className="p-4 dark">
                    <p className="text-white font-bold">Total Price: ${totalPrice}</p>
                    <Button auto color="success" className="w-full my-2">
                        <Link to="/checkout">Proceed to Checkout</Link>
                    </Button>
                    <Button auto color="warning" className="w-full" onPress={() => dispatch(clearCart())}>
                        Clear Cart
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ShoppingCard;
