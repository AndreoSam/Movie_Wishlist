import React, { useContext, useEffect, useState } from 'react'
import "./Movies.css"
import { movieList } from '../Reducer/mediaSlice'
import { useDispatch, useSelector } from 'react-redux'
import { CiSearch } from "react-icons/ci";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { BiCommentAdd } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";
import { AppContext } from '../Context/Appcontext';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Link } from 'react-router-dom';
import { CiFaceFrown } from "react-icons/ci";

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Movies = ({ loggedInUser }) => {
    const [state, setState] = useState("")
    const [newstate, setNewstate] = useState("james")
    const [searchedmovies, setSearchedmovies] = useState([])
    const [pages, setPages] = useState(1)
    const [pageno, setPageno] = useState(1)
    const { setSearchQueries, clickedItems, setClickedItems, selectedwishlist, setSelectedwishlist, wishlist, selectedImdbID, setSelectedImdbID, addSearchQuery, setSearchedname } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState(null);

    const [selectedRadio, setSelectedRadio] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedwishlist('');
        setError(null);
    };

    const dispatch = useDispatch("")
    const { loading } = useSelector((state) => state.user)


    const getMovies = (() => {
        if (!newstate.trim()) {
            setSearchedmovies([]);
            setPages(1);
            return;
        }
        dispatch(movieList({ newstate, pageno })).then((res) => {
            // console.log("Data: ", res);
            setSearchedmovies(res.payload.Search)
            const totalResults = res.payload.totalResults;
            setPages(Math.ceil(totalResults / 10))
            if (res.response == "False") {
                alert("no data found")
            }
        }).catch((err) => {
            console.log("error: ", err);
            setSearchedmovies([]);
            setPages(1);
        })
    })
    // console.log("Page no: ", pages);
    // console.log("Add: ", add);

    // console.log("selectedwishlist: ", selectedwishlist);

    useEffect(() => {
        getMovies()
    }, [dispatch, newstate, pageno])

    const submitHandler = ((e) => {
        e.preventDefault();
        if (!state.trim()) {
            setError('Search input cannot be empty.');
            return;
        }
        setNewstate(state);
        setPageno(1); // Reset to the first page for new searches
        setPages(1);
        setError(null);
    })

    // console.log("selectedwishlist: ", selectedwishlist);

    const handleItemClick = (imdbID) => {
        setSelectedImdbID(imdbID);
        handleOpen();
    };

    const performSearch = (query) => {
        // Simulate search results (empty array means no results found)
        return query === 'notfound' ? [] : ['result1', 'result2'];
    };
    const handleSearch = (query) => {
        setSearchQuery(query);
        const searchResults = performSearch(query);

        if (searchResults.length === 0) {
            setError('No results found');
        } else {
            setError('');
            // Process search results as needed
        }
    };

    const handleModalConfirm = () => {
        if (selectedwishlist) {
            setClickedItems((prevState) => {
                // Create a copy of the current state
                const updatedClickedItems = [...prevState];

                // Find the wishlist object in the array
                const wishlistIndex = updatedClickedItems.findIndex(item => item.query === selectedwishlist);

                if (wishlistIndex !== -1) {
                    // If the wishlist exists, add the new imdbID
                    updatedClickedItems[wishlistIndex].imdbIDs.push(selectedImdbID);
                } else {
                    // If the wishlist doesn't exist, create a new one
                    updatedClickedItems.push({
                        query: selectedwishlist,
                        imdbIDs: [selectedImdbID]
                    });
                }

                // console.log("Updated Clicked Items: ", updatedClickedItems);
                return updatedClickedItems;
            });

            setSearchQueries((prevState) => {
                const updatedSearchQueries = [...prevState];
                // Find the search query in the array
                const queryIndex = updatedSearchQueries.findIndex(item => item.query === selectedwishlist);

                if (queryIndex !== -1) {
                    // If the query exists, add the new imdbID
                    updatedSearchQueries[queryIndex].imdbIDs.push(selectedImdbID);
                } else {
                    // If the query doesn't exist, create a new one
                    updatedSearchQueries.push({
                        query: selectedwishlist,
                        imdbIDs: [selectedImdbID]
                    });
                }

                // console.log("Updated Search Queries: ", updatedSearchQueries);
                return updatedSearchQueries;
            });

            handleClose();
            setError(null);
        } else {
            setError('Please select an option before confirming.');
        }
    };

    // console.log("Clicked Items: ", clickedItems);

    // useEffect(() => {
    //     clickedItems.map((prod) => {
            // console.log("Clicked Items:: ", prod.imdbIDs);
    //     })
    // })
    // console.log("Selected: ", selectedwishlist);
    const isMovieInWishlist = (imdbID) => {
        return clickedItems.some(item => item.imdbIDs.includes(imdbID));
    };
    return (
        <div className='movies_css'>
            <div>
                <form onSubmit={submitHandler} >
                    <div className="main_top_search">
                        <CiSearch className='main_top_search_icon' />
                        <input placeholder='Enter to search' onChange={(e) => { setState(e.target.value); handleSearch(e.target.value) }} value={searchQuery} />
                        <button className='main_top_button_icon' type='submit'>Search</button>
                    </div>
                </form>
            </div>
            <div className="movies_margin">
                <div sx={{ width: '100%' }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='movies_margin_1'>
                        {
                            !searchedmovies ? <div className='notdatafound_css'>
                                <CiFaceFrown />

                                <p>*Searched input too small or no data exist!</p>
                            </div> : (
                                searchedmovies.map((prod) => (
                                    <Grid item key={prod.imdbID} >
                                        {loading ? (
                                            <Skeleton variant="rectangular" animation="wave" className='skeleton_css' />
                                        ) : (
                                            <div className='movie_item_css'>
                                                <Item className='movie_item_item_css'>
                                                    {isMovieInWishlist(prod.imdbID) ? (
                                                        <SiTicktick className="SiTicktick" />
                                                    ) : (
                                                        <BiCommentAdd
                                                            onClick={() => { handleItemClick(prod.imdbID); setSelectedImdbID(prod.imdbID); handleOpen() }}
                                                            className="addto_wishlist"
                                                        />
                                                    )}
                                                    <Link to={`/single/${prod.imdbID}`} style={{ textDecoration: "none" }}>
                                                        <img src={prod.Poster} height="240px"
                                                            width="100%" alt="no img" className='item_item_css' />
                                                    </Link>
                                                    <div className='Movie_title_date'>
                                                        <p>{prod.Title}</p>
                                                        <p>({prod.Year})</p>
                                                    </div>
                                                </Item>
                                            </div>
                                        )}
                                    </Grid>
                                ))
                            )
                        }
                        {/*                         
                        {
                            searchedmovies.map((prod) => (
                                <Grid item key={prod.imdbID} >
                                    {loading ? (
                                        <Skeleton variant="rectangular" animation="wave" className='skeleton_css' />
                                    ) : (
                                        <div className='movie_item_css'>
                                            <Item className='movie_item_item_css'>
                                                {clickedItems[prod.imdbID] ? (
                                                    <SiTicktick className="SiTicktick" />
                                                ) : (
                                                    <BiCommentAdd
                                                        onClick={() => { handleItemClick(prod.imdbID); setSelectedImdbID(prod.imdbID); handleOpen() }}
                                                        className="addto_wishlist"
                                                    />
                                                )}
                                                <Link to={`/single/${prod.imdbID}`} style={{ textDecoration: "none" }}>
                                                    <img src={prod.Poster} height="240px"
                                                        width="100%" alt="no img" className='item_item_css' />
                                                </Link>
                                                <div className='Movie_title_date'>
                                                    <p className='Movie_title'>{prod.Title}</p>
                                                    <p>({prod.Year})</p>
                                                </div>
                                            </Item>
                                        </div>
                                    )}
                                </Grid>
                            ))
                        } */}
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                        >
                            <Fade in={open}>
                                <Box sx={style}>
                                    <Typography id="transition-modal-title" variant="h6" component="h2">
                                        Wishlist item to:
                                    </Typography>
                                    <div>
                                        <FormControl>
                                            <RadioGroup
                                                aria-label="wishlist"
                                                name="wishlist"
                                                value={selectedwishlist}
                                                onChange={(e) => setSelectedwishlist(e.target.value)}
                                            >
                                                {wishlist.map((prod, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        value={prod}
                                                        control={<Radio />}
                                                        label={prod}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>

                                    </div>
                                    <button onClick={handleModalConfirm}>Confirm</button>
                                    <button onClick={handleClose}>Close</button>
                                    {error && <Typography color="error">{error}</Typography>}
                                </Box>
                            </Fade>
                        </Modal>
                    </Grid>
                </div>
                <div >
                    <Stack spacing={2} className="movie_pagination">
                        <Pagination count={Math.ceil(pages)} onChange={(e, value) => setPageno(value)} variant="outlined" shape="rounded" />
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default Movies