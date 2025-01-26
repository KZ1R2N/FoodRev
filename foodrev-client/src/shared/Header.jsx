import React from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from '../Context'
import { useContext } from 'react'

export default function Header() {
    const links = <><li><NavLink to='/'>Home</NavLink></li>
         <li><NavLink to='/Login'>Login</NavLink></li>
         <li><NavLink to='/Registration'>Registration</NavLink></li>
         <li><NavLink to='/Reviews'>Reviews</NavLink></li>
         {/* <li><NavLink to='/Reviewss'>Reviewss</NavLink></li> */}
         </>
     const {userDetails} = useContext(Context)
    //  console.log(userDetails)
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <NavLink to='/' className="btn btn-ghost text-xl" >FoodRev</NavLink>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="flex navbar-end">
               {userDetails?.displayName &&<a className="btn">{userDetails.displayName}</a>} 
               {userDetails?.photoURL && <img className="avatar avatar-sm rounded-full h-8 ml-2" src={userDetails.photoURL} alt="" />   }                
            </div>
        </div>
    )
}
