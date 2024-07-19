import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../Context/Appcontext';
import { useDispatch, useSelector } from 'react-redux';
import { wishlistsMovie } from '../Reducer/mediaSlice';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { GoAlertFill, GoX } from "react-icons/go";
import "./Wishlists.css"
import Skeleton from '@mui/material/Skeleton';
import { GoCheck } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Wishlists = ({ loggedInUser, setLoggedInUser, prod }) => {
  const { newselected, clickedItems, setClickedItems, state = [], setState, newarr, setNewarr, addToWishlist, wishlistItems, selectedwishlist, setSelectedwishlist, wishlist, setWishlist, selectedImdbID, setSelectedImdbID, searchQueries, setSearchQueries, addSearchQuery, searchedname, setSearchedname } = useContext(AppContext);

  const [watchedItems, setWatchedItems] = useState([]);
  const [newclicked, setNewclicked] = useState([]);
  const [newData, setnewData] = useState([]);

  const dispatch = useDispatch()
  const mappedImdbIDs = useMemo(() => {
    return Array.isArray(newarr.imdbIDs)
      ? newarr.imdbIDs.map(imdbID => `${imdbID}`)
      : [];
  }, [newarr.imdbIDs]);

  // const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user)
  // console.log("loading: ", loading)

  // Memoize effect callback
  const fetchWishlists = useCallback(async () => {
    try {
      const res = await dispatch(wishlistsMovie(mappedImdbIDs));
      // console.log("Res: ", res.payload);
      setState(res.payload);
      // console.log("data found");
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, mappedImdbIDs, setState]);

  useEffect(() => {
    if (mappedImdbIDs.length > 0) {
      fetchWishlists();
    }
    else {
      setState("")
      // alert("data not found")
    }
  }, [fetchWishlists, mappedImdbIDs]);

  useEffect(() => {
    if (loggedInUser) {
      const storedWatchedItems = JSON.parse(localStorage.getItem(`watchedItems_${loggedInUser}`)) || [];
      setWatchedItems(storedWatchedItems);
    }
  }, [loggedInUser]);


  const toggleCompletion = (prod) => {
    const updatedWatchedItems = watchedItems.includes(prod.imdbID)
      ? watchedItems.filter(item => item !== prod.imdbID)
      : [...watchedItems, prod.imdbID];
    setWatchedItems(updatedWatchedItems);
    localStorage.setItem(`watchedItems_${loggedInUser}`, JSON.stringify(updatedWatchedItems));
    const isWatched = watchedItems.includes(prod.imdbID);
    // console.log("Is watched? ", isWatched);
  };

  useEffect(() => {
    const newDataArray = [];
    searchQueries.forEach((prod) => {
      newDataArray.push(...prod.imdbIDs);
    });
    setnewData(newDataArray);
  }, [searchQueries]);


  // console.log("Selected: ", newselected);
  // console.log("Data: ", newData);
  useEffect(() => {
    clickedItems.map((prod) => {
      // console.log(prod.query)
      if (newselected === prod.query) {
        // console.log("prod: ", prod.imdbIDs)
        setNewclicked(prod.imdbIDs)
      }
    })
  }, [clickedItems, newselected])

  const removeItemFromWishlist = (imdbID) => {
    console.log('Removing item with imdbID:', imdbID);
    // Update the wishlist
    const updatedWishlist = wishlist.filter(item => item.imdbID !== imdbID);
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${loggedInUser}`, JSON.stringify(updatedWishlist));

    // Update searchQueries
    const updatedQuery = searchQueries.map((item) => ({
      ...item,
      imdbIDs: item.imdbIDs.filter(id => id !== imdbID)
    })).filter(item => item.imdbIDs.length > 0); // Filter out items where imdbIDs is empty
    setSearchQueries(updatedQuery);
    localStorage.setItem(`searchQueries_${loggedInUser}`, JSON.stringify(updatedQuery));

    // Update clickedItems
    const updatedClickedItems = clickedItems.map((item) => {
      if (item.query === newselected) {
        const updatedImdbIDs = item.imdbIDs.filter(id => id !== imdbID);
        return updatedImdbIDs.length > 0 ? { ...item, imdbIDs: updatedImdbIDs } : null;
      }
      return item;
    }).filter(item => item !== null); // Filter out items where imdbIDs is empty
    console.log('Updated clickedItems:', updatedClickedItems);
    setClickedItems(updatedClickedItems);
    localStorage.setItem(`clickedItems_${loggedInUser}`, JSON.stringify(updatedClickedItems));
  };

  // console.log("clickedItems: ", clickedItems)

  return (
    <div className='movies_css_2' >
      <div className='movies_css_3'>
        <div className='css_h1'>
          <h1>Movies of {newselected}</h1>
        </div>
        <div className='css_h2'>
          <b>About this watchlist</b>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        
      </div>
      <div className='movies_css_4'>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='movies_margin_2' style={{ display: 'flex', justifyContent: "space-around" }}>
          {
            state === "" ? <div className='notdatafound_css'>
              <GoAlertFill />
              <p> Items not added yet!</p>
            </div> : (state.map((prod, index) => (
              <Grid key={index}>
                {loading ?
                  (<Skeleton variant="rectangular" animation="wave" value={prod} width={171} height={316} className='skeleton_item_item_css' />)
                  :
                  (
                    <Item className='movie_item_item_css' >
                      <div>
                        {/* <RxCross2 className='RxCross1' style={{ fontWeight: "600" }} /> */}
                        <img src={prod.Poster} className='item_item_css' alt="no img" />
                      </div>
                      <div className='Movie_title_date'>
                        <p className='Movie_title'>{prod.Title}</p>
                        <p>({prod.Year})</p>
                      </div>
                      <div className='completion_icon' >
                        <button className='completion_icon_watched' onClick={() => toggleCompletion(prod)}>
                          {watchedItems.includes(prod.imdbID) ? "Watched" : "Not Watched?"}
                        </button>
                        <button className='completion_icon_cross' onClick={() => removeItemFromWishlist(prod.imdbID)}><GoX /></button>
                      </div>
                    </Item>
                  )
                }
              </Grid>)))
          }
        </Grid>
      </div >
    </div >
  )
}

export default Wishlists