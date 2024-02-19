import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@material-ui/styles';
import {
    Badge,
    Button,
    ButtonGroup,
    Drawer,
    Fab,
    Grid,
    IconButton,
    
    Tooltip,
    Typography
} from '@material-ui/core';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SubCard from '../../../component/cards/SubCard';
import { gridSpacing } from '../../../store/constant';
import ShoppingCartCheckout from '@mui/icons-material/ShoppingCartCheckout';

import ShoppingCartButton from '../../../component/buttons/ShoppingCartButton';
import DynamicField from '../../../component/fields/DynamicField';
import PaymentField from '../../../component/fields/PaymentField';
import moment from 'moment';
import CustomerDropDwon from '../../../component/dropdwons/CustomerDropDwon';
import { getCustCartByUser } from '../../../actions';
import CustSaleService from '../../../services/CustSaleService';
import CustSalePaymentService from '../../../services/CustSalePaymentService';

//-----------------------|| CustOrderCart ||-----------------------//

const CustOrderCart = (props) => {

    const {editCart, addItemToCart, custProductList}=props;
    const theme = useTheme();
    const dispatch = useDispatch();
   
    const custSaleReducer = useSelector((state) => state.custSaleReducer);

    const validationMap={};

    const {custCart} =custSaleReducer;

    // drawer on/off
    const [open, setOpen] = React.useState(false);

    const [step, setStep] = React.useState(1);

    const findProduct=(id)=>{
        return custProductList.find(custProduct=>custProduct.id==id)
    }
    
    const stepLevel= {
        1: "Check Out",
        2: "Additional",
        3: "Payment",
        4: "Place Order"
    }

    useEffect(() => {
        dispatch(getCustCartByUser(props.userDetail.id));
    }, [getCustCartByUser]);

    const handleToggle = () => {
        setOpen(!open);
    };

    const itemQnt=(cartItem, saleQnt)=>{
        cartItem['saleQnt']=saleQnt;
        addItemToCart(cartItem);
    }

    const addCartAdditionalList= (formValues)=>{
        custCart['custCartSaleAdditionalList']= [...formValues];
        editCart(custCart);
    }

    const setPayment=(payment)=>{
        custCart['payment']= payment;
        editCart(custCart);
    }

    const customerAction=(customer)=>{
        if(customer){
            //this.checkValidation(this.findField("customer"), customer.id)
            custCart['customerId']= customer.id;
        } else{
            //this.checkValidation(this.findField("customer"), null)
            this.setState({customerId: null});
        }
    }

    const isError = (name)=>{
        return validationMap[name]!=null;
    }

    const errorMessage = (name)=>{
        return validationMap[name];
    }
    


    const getSubTotal=()=>{
        return custCart.custCartSaleItemList && custCart.custCartSaleItemList.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.saleQnt * currentValue.salePrice.price;
        }, 0)
    }

    const getTotalSale = () =>{
        let subTotal=  getSubTotal();
        let otherItemTotal= custCart.custCartSaleAdditionalList && custCart.custCartSaleAdditionalList.reduce((previousValue, currentValue) => {
            return previousValue + Number.parseFloat(currentValue.value);
        }, 0);
        let discountTotal= custCart.custCartSaleItemList && custCart.custCartSaleItemList.reduce((previousValue, currentValue) => {
            return previousValue + Number.parseFloat(currentValue.discount);
        }, 0);
        return subTotal+otherItemTotal-discountTotal;
    }

    const items= ()=>{
        console.log("custCart=",custCart)
        const items= [...custCart.custCartSaleItemList];
        return items.map(item=>{
            item['custProduct']=findProduct(item.custProductId);
            return item;
        })
    }

    const rendorOrder= ()=>{
        switch(step){
            case 1:
                return <SubCard title="Cart Items">
                {
                    items().map(selectedItem=>
                        <Grid container spacing={2}>                        
                        <Grid item xs={12} lg={2} md={2}>
                            <img
                                width={40}
                                height={40}
                                src={selectedItem?.custProduct?.logoUrl}
                            />
                            
                        </Grid>
                        <Grid item xs={12} lg={5} md={5}>
                            <Typography>{selectedItem?.custProduct?.title}</Typography>
                            <Typography>{selectedItem?.salePrice?.price}</Typography>
                        </Grid>
                        <Grid item xs={12} lg={5} md={5} sx={{padding:2}}>
                        <ShoppingCartButton  
                            counter={selectedItem.saleQnt} 
                            updateCounter={(counter)=> itemQnt(selectedItem, counter )}>
                        </ShoppingCartButton>  
                        </Grid>
                        </Grid>
                    )
                }
                </SubCard>;
            case 2:
                return <SubCard content={true} title="Additional Charges" secondary={ 
                    <DynamicField list={custCart.custCartSaleAdditionalList} 
                    type={'number'}
                    onSave={addCartAdditionalList}></DynamicField>
                    }>                               
                    <Grid container >      
                        {
                        custCart.custCartSaleAdditionalList && custCart.custCartSaleAdditionalList.map((addAdditionalCharge,i)=>
                        <>
                            <Grid item xs={12} lg={5} md={5} >{addAdditionalCharge.field} </Grid>
                            <Grid item xs={12} lg={2} md={2} >:</Grid>
                            <Grid item xs={12} lg={5} md={5} sx={{ textAlign: 'right'}} >{addAdditionalCharge.value}</Grid>
                        </>
                        )
                        }
                    </Grid>
                 </SubCard>
            case 3:
                return <>
                <SubCard content={true} >

                <CustomerDropDwon 
                    label="Sale to" 
                    name="customerId"
                    value={custCart.customerId} 
                    customerList = {props.custCustomerList} 
                    customerAction={customerAction}
                    errorMessage={errorMessage}
                    isError={isError}
                    //checkValidation={this.checkValidation}
                    >
                    </CustomerDropDwon>    
                </SubCard>
                
                <SubCard content={true} >        
                                       
                     <PaymentField element={custCart.payment} setElement={setPayment} index='1'></PaymentField>
                 </SubCard>
                 </>

        }
    }

    const processOrder= ()=>{
        
        if(step<=4){
            switch(step){
                case 4:
                let custProductSale = {
                    id:custCart.id,
                    idenNo:custCart.idenNo,
                    saleDate: moment().format('YYYY-MM-DD'),
                    customerId: custCart.customerId,
                    discounts: custCart.discounts,
                    totalPrice: 0,
                    totalQnt: 0,
                    custProductSaleItemList: [],
                    custProductSaleAdditionalList:custCart.custProductSaleAdditionalList
                }
                custCart.custCartSaleItemList.forEach((item)=>{
                    custProductSale.totalQnt+=item.saleQnt;
                    custProductSale.totalPrice+=(item.saleQnt*item.salePrice.price);
                    let custProductSaleItem={
                        id:item.id,
                        name: item.name,
                        desc: item.desc,
                        discount: item.discount,
                        purchasePrice: item.purchasePrice,
                        saleQnt: item.saleQnt,
                        saleType: item.isWholeSale? "Whole Sale": "Retail Sale",
                        salePrice: item.salePrice,
                        custProductId: item.custProductId
                    }
                    custProductSale.custProductSaleItemList.push(custProductSaleItem);
                })

                CustSaleService.add(custProductSale).then(custProductSaleReturn=>{
                    const custTransaction={};
                    custTransaction['transactionAmount']=custCart.payment.amount;
                    custTransaction['transactionType']='Credit';
                    custTransaction['transactionMode']=custCart.payment.mode;
                    custTransaction['transactionDate']=moment().format('YYYY-MM-DD');
                    custTransaction['transactionStatus']=custCart.payment.mode=='Unpaid' ? 'Unpaid': 'Paid';
                    custTransaction['transactionReciverId']=props.userDetail.id;
                    custTransaction['transactionSenderId']=custCart.customerId;
                    custTransaction['transactionMakerId']=props.userDetail.id;
                    custTransaction['transactionService']='SALE';
                    console.log("transaction=",custTransaction)

                    const custProductSalePayment={
                        customerId: custCart.customerId,
                        custTransaction: custTransaction,
                        primaryPayment: true,
                        paymentState: "INITIAL",
                        custProductSaleId: custProductSaleReturn.id
                    };

                    CustSalePaymentService.add(custProductSalePayment).then(custProductSalePaymentReturn=>{
                        console.log("custProductSalePaymentReturn=", custProductSalePaymentReturn)
                    });
                })
               
            }
            if(step<4)
            setStep(step+1);
        }
    }
 
    useEffect(() => {

    }, [dispatch]);

    
    return (
        <React.Fragment>
            {/* toggle button */}

            <Tooltip title="Shopping Cart">
                <Fab
                    component="div"
                    onClick={handleToggle}
                    size="medium"
                    variant="string"
                    color="secondary"
                    sx={{
                        top: 80,
                        m: 2,
                        position: 'fixed',
                        right: 10,
                        zIndex: (theme) => theme.zIndex.speedDial,
                        boxShadow: theme.shadows[8]
                    }}
                >
                    
                        <IconButton color="warning" size="large"  >
                            <Badge  badgeContent={custCart?.custCartSaleItemList?.length} color="primary">
                                 <ShoppingCartCheckout > </ShoppingCartCheckout>
                            </Badge>
                        </IconButton>
                    
                </Fab>
            </Tooltip>

            <Drawer
                anchor="right"
                onClose={handleToggle}
                open={open}
                PaperProps={{
                    sx: {
                        width: 380
                    }
                }}
            >

                <Snackbar
                anchorOrigin={{ vertical:"top", horizontal: "center"}}
                open={true}
                onClose={false}
                message="I love snacks"
                key={"orderId"}
                autoHideDuration={1200}
                >

                    <Alert
                        onClose={false}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        This is a success Alert inside a Snackbar!
                    </Alert>

                </Snackbar>
                <PerfectScrollbar component="div">
                    <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                       
                        <Grid item xs={12}>
                            {
                                rendorOrder()
                            }
                        </Grid>
                        <Grid item xs={12}>
                            {/* font family */}
                            <SubCard title="Order summary">
                                <Grid container spacing={1}>
                                    <Grid item xs={10} lg={10} md={10}>Sub Total</Grid>
                                    <Grid item xs={2} lg={2} md={2} sx={{ textAlign: 'right'}}>{getSubTotal()}</Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={10} lg={10} md={10}>Coupon Discount</Grid>
                                    <Grid item xs={2} lg={2} md={2} sx={{ textAlign: 'right'}}>0</Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={10} lg={10} md={10}>Shipping Charges</Grid>
                                    <Grid item xs={2} lg={2} md={2} sx={{ textAlign: 'right'}}>0</Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={10} lg={10} md={10}>Total</Grid>
                                    <Grid item xs={2} lg={2} md={2} sx={{ textAlign: 'right'}}>{getTotalSale()}</Grid>
                                </Grid>
                            </SubCard>
                            <Grid container spacing={1}>
                                <Grid item xs={12} lg={12} md={12}>
                                 <ButtonGroup fullWidth>
                                    {step!==1 &&
                                    <Button sx variant='outlined' color='primary' fullWidth
                                        
                                    onClick={()=> setStep(step-1)}
                                    >{stepLevel[step-1]}</Button>
                                    }  
                                    
                                    <Button sx variant='outlined' color='error' fullWidth
                                    
                                     onClick={()=> processOrder()}
                                    >{stepLevel[step]}</Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </PerfectScrollbar>
            </Drawer>
        </React.Fragment>
    );
};

export default CustOrderCart;
