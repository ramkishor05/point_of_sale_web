import React, { useState } from 'react';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import NavGroup from './NavGroup';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const userMenuGroupReducer = useSelector((state) => state.userReducer);
    let userRole=userMenuGroupReducer?.userDetail?.userRole;
    let menuGroups = userRole? userRole.roleMenuGroups: [];
    const navItems = menuGroups.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item}/>;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });
    return navItems;
};

export default MenuList;
