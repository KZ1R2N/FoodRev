import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../Context';

export default function Header() {
    const { userDetails, setUserId, setUserDetails, signout } = useContext(Context);
    // console.log(userDetails?.photoURL)
    const links = (
        <>
            <li><NavLink to='/'>Home</NavLink></li>
            {!userDetails && <li><NavLink to='/Login'>Login</NavLink></li> }
            {!userDetails && <li><NavLink to='/Registration'>Registration</NavLink></li> }

            
            
            <li><NavLink to='/Reviews'>Reviews</NavLink></li>
        </>
    );



    const handleSignOut = () => {
        signout();
    };

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
                <NavLink to='/' className="btn btn-ghost text-xl">FoodRev</NavLink>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="flex navbar-end relative">
                {userDetails?.displayName && (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn">
                            {userDetails.displayName}
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 z-50 rounded-box w-52">
                            <li>
                                <button onClick={handleSignOut} className="btn btn-secondary">Sign Out</button>
                            </li>
                        </ul>
                    </div>
                )}
                {userDetails?.photoURL && (
                    <img
                        className="avatar avatar-sm rounded-full h-8 ml-2"
                        src={userDetails.photoURL}
                        alt=""
                    />
                )}
            </div>
        </div>
    );
}
