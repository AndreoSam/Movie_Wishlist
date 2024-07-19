import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [selectedImdbID, setSelectedImdbID] = useState(null);
    const [searchQueries, setSearchQueries] = useState([]);
    const [searchedname, setSearchedname] = useState("");
    const [wishlist, setWishlist] = useState([]);
    const [selectedwishlist, setSelectedwishlist] = useState("");
    const [wishlistItems, setWishlistItems] = useState([]);
    const [newarr, setNewarr] = useState("");
    const [state, setState] = useState([""])
    const [clickedItems, setClickedItems] = useState([]);
    const [newselected, setNewselected] = useState(null);

    const addSearchQuery = (query, imdbID) => {
        setSearchQueries((prevQueries) => {
            if (!Array.isArray(prevQueries)) {
                console.error('prevQueries is not an array:', prevQueries);
                return [];
            }

            const queryIndex = prevQueries.findIndex(q => q.query === query);

            if (queryIndex !== -1) {
                const updatedQueries = [...prevQueries];
                updatedQueries[queryIndex].imdbIDs = [...new Set([...updatedQueries[queryIndex].imdbIDs, imdbID])];
                return updatedQueries;
            } else {
                return [...prevQueries, { query, imdbIDs: [imdbID] }];
            }
        });
    };

    return (
        <AppContext.Provider value={{newselected, setNewselected, clickedItems, setClickedItems, state, setState, newarr, setNewarr, wishlistItems, selectedwishlist, setSelectedwishlist, wishlist, setWishlist, selectedImdbID, setSelectedImdbID, searchQueries, setSearchQueries, addSearchQuery, searchedname, setSearchedname }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
