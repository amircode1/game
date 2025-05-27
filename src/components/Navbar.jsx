import { IoGameControllerOutline } from 'react-icons/io5'
import { useNavigate, Link } from "react-router-dom";
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import Search from "./Search";
import Category from './Category';

function NavbarGame() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);  

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen); 
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-black sticky top-0 z-50 px-5 lg:px-20">
            {/* لوگوی ناوبار */}
            <div className="flex items-center gap-3">
                <IoGameControllerOutline className="text-red-500 h-10 w-10" />
                <Link className="text-2xl font-bold text-white" to="/">GameStore</Link>
            </div>

            {/* آیتم‌های ناوبار در سایزهای بزرگ و متوسط */}
            <div className="hidden xl:flex gap-8 justify-center items-center w-full pr-5"> {/* فقط در 2xl به بالا نمایش داده شود */}
                <Search />
                <button className="text-white hover:text-red-500" onClick={() => handleNavigation('/platform')}>
                    Platforms
                </button>
                <button className="text-white hover:text-red-500">
                    <Category />
                </button>
                <button className="text-white hover:text-red-500" onClick={() => handleNavigation('/developers')}>
                    Developer
                </button>
            </div>

            {/* دکمه‌های ورود و ثبت‌نام */}
            <div className="hidden xl:flex items-center gap-4"> {/* فقط در 2xl به بالا نمایش داده شود */}
                <Button
                    type="button"
                    variant="light"
                    className="px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                    onPress={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button
                    type="button"
                    variant="flat"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onPress={() => navigate('/signup')}
                >
                    Sign Up
                </Button>
            </div>

            {/* منو همبرگری برای سایزهای xl و پایین‌تر */}
            <div className="xl:hidden flex items-center"> {/* در سایزهای کوچک‌تر از 2xl نمایش داده شود */}
                <Button
                    type="button"
                    variant="light"
                    className="text-white"
                    onPress={toggleMenu}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </Button>
            </div>

            {/* نمایش منوی کشویی در سایزهای xl و کوچکتر */}
            {isOpen && (
                <div className="xl:hidden absolute top-16 left-0 w-full bg-black z-40 flex flex-col items-center gap-4 py-4">
                    <Search />
                    <button className="text-white hover:text-red-500" onClick={() => handleNavigation('/platform')}>
                        Platforms
                    </button>
                    <button className="text-white hover:text-red-500">
                        <Category />
                    </button>
                    <button className="text-white hover:text-red-500" onClick={() => handleNavigation('/developers')}>
                        Developer
                    </button>
                    <Button
                        type="button"
                        variant="light"
                        className="px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                        onPress={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button
                        type="button"
                        variant="flat"
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onPress={() => navigate('/signup')}
                    >
                        Sign Up
                    </Button>
                </div>
            )}
        </nav>
    );
}

export default NavbarGame;
