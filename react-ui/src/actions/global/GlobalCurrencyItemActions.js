import { 
   GET_ALL_GLOBAL_CURRENCY_ITEM_SUCCESS,
   GET_ALL_GLOBAL_CURRENCY_ITEM_FAIL,
   SHOW_GLOBAL_CURRENCY_ITEM_LOADER,
   REMOVE_GLOBAL_CURRENCY_ITEM_LOADER,
   ADD_GLOBAL_CURRENCY_ITEM_SUCCESS,
   EDIT_GLOBAL_CURRENCY_ITEM_SUCCESS,
   RENDER_GLOBAL_CURRENCY_ITEM_TO_EDIT
} from '../../types';
import GlobalCurrencyItemService from '../../services/GlobalCurrencyItemService';

// Action creator for getting all items --<
export const getGlobalCurrencyItemList = () => async dispatch => {
    dispatch({ type: SHOW_GLOBAL_CURRENCY_ITEM_LOADER });
    try {
        const globalCategoryList = await GlobalCurrencyItemService.getAll();
        console.log("coll globalCategoryList 2")
        if (globalCategoryList) {
            dispatch({ type: GET_ALL_GLOBAL_CURRENCY_ITEM_SUCCESS, payload: globalCategoryList });
            dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
        }
    } catch(error) {
        dispatch({ type: GET_ALL_GLOBAL_CURRENCY_ITEM_FAIL });
        dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
        //console.log(error);
    }
};

// Action creator for adding item --<
export const addGlobalCurrencyItem = (data, refreshItemsList, clear, successNotification, errorNotification) => async dispatch => {
    dispatch({ type: SHOW_GLOBAL_CURRENCY_ITEM_LOADER });

    try {
        const globalCategory = await GlobalCurrencyItemService.add(data);

        if (globalCategory) {
            dispatch({ type: ADD_GLOBAL_CURRENCY_ITEM_SUCCESS });
            dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
        }

        refreshItemsList && refreshItemsList();

        clear && clear();

        successNotification && successNotification();
        
    } catch(error) {
        dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
        
        clear && clear();

        errorNotification && errorNotification();
    }
};

export const renderGlobalCurrencyItemToEdit = item => {
    return {
        type: RENDER_GLOBAL_CURRENCY_ITEM_TO_EDIT,
        payload: item,
    };
};

export const editGlobalCurrencyItem = (id, data, clearAndRefresh, successNotification, errorNotification) => async dispatch => {
    dispatch({ type: SHOW_GLOBAL_CURRENCY_ITEM_LOADER });

    try {
        const globalCategory = await GlobalCurrencyItemService.update(id, data);

        if (globalCategory) {
            dispatch({ type: EDIT_GLOBAL_CURRENCY_ITEM_SUCCESS });
            dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
            
            successNotification && successNotification();

            clearAndRefresh && clearAndRefresh();
        }
    } catch(error) {
        dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
        errorNotification && errorNotification();
    }
};

export const updateGlobalCurrencyItem = (id, data, clearAndRefresh, successNotification, errorNotification) => async dispatch => {
    dispatch({ type: SHOW_GLOBAL_CURRENCY_ITEM_LOADER });

    try {
        const globalCategory = await GlobalCurrencyItemService.update(id, data);

        if (globalCategory) {
            dispatch({ type: EDIT_GLOBAL_CURRENCY_ITEM_SUCCESS });
            dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
            
            successNotification && successNotification();

            clearAndRefresh && clearAndRefresh();
        }
    } catch(error) {
        dispatch({ type: REMOVE_GLOBAL_CURRENCY_ITEM_LOADER });
        errorNotification && errorNotification();
    }
};

// Action creator for deleting football transaction from the system.
export const deleteGlobalCurrencyItem = (id, refresh) => async dispatch => {
    try {
        const deleted_global_category = await GlobalCurrencyItemService.delete(id);

        if (deleted_global_category) {
            refresh && refresh();
        }
    } catch (error) {
        console.log(error);
    }
};