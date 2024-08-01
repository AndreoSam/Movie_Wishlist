import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [selectedImdbID, setSelectedImdbID] = useState(null);
    const [searchQueries, setSearchQueries] = useState([]);
    const [searchedname, setSearchedname] = useState("");
    const [wishlist, setWishlist] = useState([]);
    const [selectedwishlist, setSelectedwishlist] = useState("");
    const [newarr, setNewarr] = useState("");
    const [state, setState] = useState([""])
    const [clickedItems, setClickedItems] = useState([]);
    const [newselected, setNewselected] = useState(null);

    // const addSearchQuery = (query, imdbID) => {
    //     setSearchQueries((prevQueries) => {
    //         if (!Array.isArray(prevQueries)) {
    //             console.error('prevQueries is not an array:', prevQueries);
    //             return [];
    //         }

    //         const queryIndex = prevQueries.findIndex(q => q.query === query);
    //         // console.log("prevQueries: ", prevQueries);

    //         if (queryIndex !== -1) {
    //             const updatedQueries = [...prevQueries];    //This creates a shallow copy of prevQueries to avoid mutating the original state directly.
    //             updatedQueries[queryIndex].imdbIDs = [...new Set([...updatedQueries[queryIndex].imdbIDs, imdbID])]; //The Set is used to ensure all imdbIDs are unique (i.e., no duplicates).
    //             return updatedQueries;
    //         } else {
    //             return [...prevQueries, { query, imdbIDs: [imdbID] }];
    //         }
    //     });
    // };

    // console.log("searchQueries: ", searchQueries);

    return (
        <AppContext.Provider value={{ newselected, setNewselected, clickedItems, setClickedItems, state, setState, newarr, setNewarr, selectedwishlist, setSelectedwishlist, wishlist, setWishlist, selectedImdbID, setSelectedImdbID, searchQueries, setSearchQueries, 
        // addSearchQuery,
        searchedname, setSearchedname }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
