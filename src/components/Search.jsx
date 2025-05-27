import { Input } from "@nextui-org/react";
import { CiSearch } from 'react-icons/ci';
import { useEffect, useState, useRef } from "react";
import { createPortal } from 'react-dom';
import CardGame from "./Card";
import { useSearchGames } from "./../hooks/useQueries"; 

function Search() {
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const { data: searchResults = [], isLoading, isSuccess } = useSearchGames(search); // Use the correct hook
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (text.trim() !== "") {
            setSearch(text);
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [text]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    let content = null;
    if (isLoading) {
        content = <p className="text-white p-2">Loading...</p>;
    } else if (isSuccess && searchResults.length > 0) {
        content = searchResults.map((game) => (
            <div key={game.id} className="dark p-2 border-b border-gray-700 hover:bg-gray-800 cursor-pointer">
                <CardGame
                    id={game.id}
                    name={game.name}
                    background_image={game.background_image}
                    released={game.released}
                    price={game.price}
                    rating={game.rating}
                    slug={game.slug}
                />
            </div>
        ));
    }

    return (
        <div className="relative w-96" ref={searchRef}>
            <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                startContent={<CiSearch color="white" className="text-3xl cursor-pointer" />}
                placeholder="Type to search..."
                onFocus={() => setIsDropdownOpen(true)}
                style={{ caretColor: "white" }}
            />
            {isDropdownOpen && searchResults.length > 0 && createPortal(
                <div 
                    className="fixed inset-0 bg-transparent z-[9999]"
                    onPress={() => setIsDropdownOpen(false)}
                >
                    <div 
                        className="absolute bg-gray-900 rounded-md shadow-lg overflow-hidden"
                        style={{
                            top: `${searchRef.current.getBoundingClientRect().bottom + window.scrollY}px`,
                            left: `${searchRef.current.getBoundingClientRect().left + window.scrollX}px`,
                            width: `${searchRef.current.offsetWidth}px`, 
                            maxWidth: '350px', 
                            maxHeight: '500px'
                        }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <div className="max-h-96 overflow-y-auto flex items-center flex-col">
                            {content}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Search;
