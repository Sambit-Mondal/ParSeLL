import React from 'react';
import SignoutButton from './SignoutButton';

const Navbar = () => {
    return (
        <div className='left-3 my-4 bg-navbar-bg fixed z-50 text-white'>
            ParSeLL
            <SignoutButton />
        </div>
    );
};

export default Navbar;