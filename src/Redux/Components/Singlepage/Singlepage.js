import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { singleMovie } from '../Reducer/mediaSlice';
import "./Singlepage.css"
import Divider from '@mui/material/Divider';
import Header from '../Header/Header';

const Singlepage = () => {
    const [state, setState] = useState("")
    const { id } = useParams()
    console.log("ID: ", id);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(singleMovie(id))
            .then((res) => {
                console.log("Res: ", res.payload);
                setState(res.payload)
            })
            .catch((err) => console.log(err))
    }, [dispatch, singleMovie, id])

    return (
        <div className="singlepage_main" style={{ backgroundImage: `url(${state.Poster})`}} >
            <Header />
            <div className="singlepage_main2">
                <div className="top_main">
                    <div className="poster">
                        <img src={state.Poster} alt="no image" />
                    </div>
                    <div className="title">
                        <h2>{state.Title}</h2>
                        <div>
                            <h4>{state.Year}</h4>
                            <p>{state.Genre}</p>
                        </div>
                        <p>imdbID Rating: ({state.imdbRating}/10)</p>
                    </div>
                    <div className="actors">
                        <div>
                            <h3>Director:</h3>
                            <br />
                            {state.Director}
                        </div>
                        <Divider />
                        <div>
                            <h3>Actors:</h3>
                            <br />
                            {state.Actors}
                        </div>
                    </div>
                </div>
                <div className="center_main">
                    <h3>Plot Summary</h3>
                    <p>{state.Plot}</p>
                </div>
                <div className="bottom_main">
                    <h3>Tech Specs</h3>
                    <div className="bottom_main_2">
                        <li>Runtime: {state.Runtime}</li>
                        <li>Language: {state.Language}</li>
                        <li>Country: {state.Country}</li>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Singlepage