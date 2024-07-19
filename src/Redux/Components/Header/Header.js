import React from 'react'
import "./Header.css"
import { LiaSearchSolid } from "react-icons/lia";

const Header = () => {
    return (
        <div className='header_main'>
            <div className='header_main_2' >
                <input placeholder='www.andreo.com' disabled />
                <LiaSearchSolid className='header_search_icon' />
            </div>
        </div>
    )
}

export default Header