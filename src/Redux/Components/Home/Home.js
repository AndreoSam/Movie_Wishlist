import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { CgProfile } from "react-icons/cg";
import { useMediaQuery } from 'react-responsive';
import MenuIcon from '@mui/icons-material/Menu';
import { IoMdClose } from "react-icons/io";
import Divider from '@mui/material/Divider';
import './Home.css';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BiCommentAdd } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";
import Wishlists from '../Wishlists/Wishlists';
import Movies from '../Movielist/Movies';
import { AppContext } from '../Context/Appcontext';

const Home = ({ loggedInUser, setLoggedInUser }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 992 });
  const [selected, setSelected] = useState("home");
  const { newselected, setNewselected, newarr, clickedItems, setClickedItems, setNewarr, wishlist, setWishlist, setSelectedwishlist, setSearchQueries, searchQueries, searchedname, selectedwishlist } = useContext(AppContext);
  // const [newarr, setNewarr] = useState("");
  const [searchwishlist, setSearchwishlist] = useState("")
  // console.log("ID: ", wishlist, searchQueries)
  // console.log("searchQueries: ", searchQueries)
  // console.log("Selected: ", selected)
  // console.log("newselected: ", newselected)

  /////////////////////////////////////////////////////////////////////////
  // const [wishlist, setWishlist] = useState([]);
  const [item, setItem] = useState('');
  const navigate = useNavigate();

  const filteredWishlist = wishlist.filter(item => item.toLowerCase().includes(searchwishlist.toLowerCase()));


  useEffect(() => {
    if (loggedInUser) {
      // Load user-specific data from local storage
      const storedSearchQueries = localStorage.getItem(`searchQueries_${loggedInUser}`);
      const storedWishlist = localStorage.getItem(`wishlist_${loggedInUser}`);
      const storedSelectedWishlist = localStorage.getItem(`selectedWishlist_${loggedInUser}`);
      const storedClickedItems = localStorage.getItem(`clickedItems_${loggedInUser}`);


      if (storedSearchQueries) {
        setSearchQueries(JSON.parse(storedSearchQueries));
      }
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
      if (storedSelectedWishlist) {
        setSelectedwishlist(JSON.parse(storedSelectedWishlist));
      }
      if (storedClickedItems) {
        setClickedItems(JSON.parse(storedClickedItems)); // Update state from localStorage
      }
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      // console.log("loggedInUser: ", loggedInUser);

      // Save user-specific data to local storage
      localStorage.setItem(`searchQueries_${loggedInUser}`, JSON.stringify(searchQueries));
      localStorage.setItem(`wishlist_${loggedInUser}`, JSON.stringify(wishlist));
      localStorage.setItem(`selectedWishlist_${loggedInUser}`, JSON.stringify(selectedwishlist));
      localStorage.setItem(`clickedItems_${loggedInUser}`, JSON.stringify(clickedItems));
    }
  }, [searchQueries, wishlist, selectedwishlist, loggedInUser, clickedItems]);

  const handleLogout = () => {
    // localStorage.removeItem('user');
    setLoggedInUser(null);
    setWishlist([]);
    setSearchQueries([]);
    navigate('/');
    setClickedItems([])
  };

  const addItemToWishlist = () => {
    if (item.trim() === '') {
      return; //
    }

    // Check if the item already exists in the wishlist
    if (wishlist.includes(item.trim())) {
      alert("Wishlist item already exists.");
      setItem('');
      return;
    }
    const updatedWishlist = [...wishlist, item.trim()];
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${loggedInUser}`, JSON.stringify(updatedWishlist));
    setItem('');

  };

  // console.log("Clicked Items: ", clickedItems)

  const removeItemFromWishlist = (index) => {
    // console.log("Removing item from wishlist:", index);

    const updatedWishlist = wishlist.filter((_, i) => i !== index);
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${loggedInUser}`, JSON.stringify(updatedWishlist));

    const updatedQuery = searchQueries.filter((_, i) => i !== index);
    setSearchQueries(updatedQuery);
    localStorage.setItem(`searchQueries_${loggedInUser}`, JSON.stringify(updatedQuery));

    if (Array.isArray(clickedItems)) {
      const updatedClickedItems = clickedItems.filter((_, i) => i !== index);
      setClickedItems(updatedClickedItems);
      localStorage.setItem(`clickedItems_${loggedInUser}`, JSON.stringify(updatedClickedItems));
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  let dataFound = (false);

  // const combinedResults =
  //   searchQueries.reduce((acc, prod) => {
  //     acc.push(prod);
  //     if (newselected == prod.query) {
  //       // console.log("Found: ", prod.imdbIDs);
  //       setNewarr(prod)
  //       dataFound = true;
  //     }
  //     return acc;
  //   }, []);

  // if (!dataFound) {
  //   setNewarr("")
  // }
  const combinedResults = searchQueries.reduce((acc, prod) => {
    acc.push(prod);
    return acc;
  }, []);

  useEffect(() => {
    const selectedQuery = searchQueries.find(prod => newselected === prod.query);

    if (selectedQuery) {
      setNewarr(selectedQuery);
    } else {
      setNewarr("");
    }
  }, [newselected, searchQueries]);

  // console.log("filteredWishlist: ", filteredWishlist);

  return (
    <div className='home_main'>
      <Header />
      <div className='home_bottom'>
        {isMobile && (
          <button className={`drawer_toggle ${drawerOpen ? 'open' : ''}`} onClick={toggleDrawer}>
            {drawerOpen ? "" : <MenuIcon className="MenuIcon" />}
          </button>
        )}
        {(!isMobile || drawerOpen) && (
          <div className={`home_bar_left ${isMobile ? 'drawer' : ''} ${drawerOpen ? 'open' : ''}`}>
            <div className='home_bar_left_top'>
              <button className={`drawer_toggle ${drawerOpen ? 'open' : ''}`} onClick={toggleDrawer}>
                {drawerOpen ? <IoMdClose className="IoMdClose" /> : <MenuIcon className="MenuIcon" />}
              </button>
              <h3>Watchlists</h3>

              <div className='left_search'>
                <CiSearch className='LiaSearchSolid' />
                <input placeholder='Search' onChange={((e) => setSearchwishlist(e.target.value))} />
              </div>
              <div className="button_left_css">
                <Link onClick={() => { setSelected("home"); setNewselected(""); }} className={selected === "home" ? 'active' : "inactive"} ><FaHome />
                  Home</Link>
                <Link className={`link ${selected === "watchlist" ? 'active' : 'inactive'} disabled`}>My Lists</Link>
                <Divider className="divider_css" />

                <div className="home_input_css">
                  <input
                    className="home_input_css_2"
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="Add a wishlist"
                  />
                  <button onClick={addItemToWishlist}>Add</button>
                </div>

               <div className='wishlist_scrollable'>
                  <Link>
                    {searchedname}</Link>
                  {filteredWishlist.map((item, index) => (
                    <div key={index} className='wishlist_css'>
                      <Link onClick={() => setNewselected(item)} style={{ textDecoration: "none", color: "black" }} className='wishlist_scrollable_items'>
                        {item}
                      </Link>
                      <button onClick={() => removeItemFromWishlist(index)}>Remove</button>
                    </div>
                  ))}
                </div>

                
              </div>
            </div>
            <div className='home_bar_left_bottom'>
              <div className='user_bottom'>
                <CgProfile className='FaRegCircleUser' />
                <p>GUEST</p>
              </div>
              <button onClick={handleLogout}>Logout</button>
              {/* <BsThreeDots className='BsThreeDots' /> */}
            </div>
          </div>
        )}
        <div className='home_bar_right'>

          <div className="main_movies">
            {
              (selected === "home" && !newselected) ?
                <div className="main_top">
                  <div className="main_top_banner">
                    <h1>Welcome to
                      <p>Watchlists</p></h1>
                    <div className="main_top_banner_2">
                      <p className='topbanner_withouticon'>Browse movies, add them to watchlists and share them with friends.</p>
                      <p className='topbanner_withicon'>Just click the <BiCommentAdd />to add a movie, click the poster to see more details or <SiTicktick /> to mark the movie as watched.</p>
                    </div>
                  </div>
                  <Movies loggedInUser={loggedInUser} />
                </div>

                : <Wishlists loggedInUser={loggedInUser} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
