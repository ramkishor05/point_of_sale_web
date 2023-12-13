import React, { useState } from 'react';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getMenuGroupByRoleId } from '../../../../actions';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const dispatch=useDispatch()
    const accountReducer = useSelector((state) => state.account);
    const userMenuGroupReducer = useSelector((state) => state.userMenuGroupReducer);
    const userRole = accountReducer.userDetail.userRole;
    let menuGroups = userMenuGroupReducer.userMenuGroups;
    console.log("userMenuGroups=",menuGroups)
    useEffect(()=>{
        if(userRole){
            dispatch(getMenuGroupByRoleId(userRole.id));
        }
       
    },[getMenuGroupByRoleId])

    if(userRole){
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
    } 

    return <></>;
};

export default MenuList;
