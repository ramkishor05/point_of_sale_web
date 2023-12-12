

import GlobalDashboard from "../../global/dasboard";
import GlobalCategoryGroup from "../../global/category/GlobalCategoryGroup";
import GlobalCategoryList from "../../global/category/GlobalCategoryList";
import GlobalCountFreq from "../../global/count_freq/GlobalCountFreq";
import GlobalCurrencyGroup from "../../global/currency/GlobalCurrencyGroup";
import GlobalCurrencyList from "../../global/currency/GlobalCurrencyList";
import GlobalUnitGroup from "../../global/unit/GlobalUnitGroup";
import GlobalUnitList from "../../global/unit/GlobalUnitList";
import UserProfilePage from "../../profile";
import MenuGroupsPage from "./MenuGroupsPage";
import MenuItemsPage from "./MenuItemsPage";
import RoleMenuGroupsPage from "./RoleMenuGroupsPage";
import RoleMenuItemsPage from "./RoleMenuItemsPage";
import GlobalVendorPage from "../../global/parties/GlobalVendorPage";
import GlobalSupplierPage from "../../global/parties/GlobalSupplierPage";
import GlobalCustomerPage from "../../global/parties/GlobalCustomerPage";

export const PageMapper = {
    "/global/dashboard/default": GlobalDashboard,
    "/global/menus/groups": MenuGroupsPage,
    "/global/menus/items": MenuItemsPage,
    "/global/menus/role/groups": RoleMenuGroupsPage,
    "/global/menus/role/items": RoleMenuItemsPage,
    "/global/setups/category/group": GlobalCategoryGroup,
    "/global/setups/category/list": GlobalCategoryList,
    "/global/setups/unit/group": GlobalUnitGroup,
    "/global/setups/unit/list": GlobalUnitList,
    "/global/setups/currency/group": GlobalCurrencyGroup,
    "/global/setups/currency/list": GlobalCurrencyList,
    "/global/setups/count/freq": GlobalCountFreq,
    "/global/portal/userprofile/detial": UserProfilePage,
    "/global/parties/vendors" : GlobalVendorPage,
    "/global/parties/suppliers" : GlobalSupplierPage,
    "/global/parties/customers" : GlobalCustomerPage
}