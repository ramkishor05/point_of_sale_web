import React, { Component } from 'react';
import { connect} from 'react-redux';


import { 
    addCustSale, editCustSale, deleteCustSale, getCustSaleList, getCustCustomerList, getCustProductList,getCustBusinessList,
    editCart, getCustCurrencyItemList
 } from '../../../actions';
import PrintBill from './PrintBill';
import ProductGrids from '../../../component/products/ProductGrids';
import { Grid} from '@material-ui/core';
import SearchBox from '../../../component/box/SearchBox';

import CustOrderCart from './CustOrderCart';


const mainheaders = [
    {
        name: "idenNo",
        label: "Iden No",
        type: 'text'
    },
    {
        name: "saleDate",
        label: "Sale Date",
        type: 'text'
    },
    {
        name: "customerId",
        label: "Customer",
        type: 'text',
        render: (value, row, header, props)=>{
           let customer= props.custCustomerList? props.custCustomerList.find((custCustomer)=>custCustomer.id==value): null;
           return customer? customer.name : value;
        }
    },
    {
        name: "totalPrice",
        label: "Total Price",
        type: 'text'
    },
    {
        name: "totalQnt",
        label: "Total Qnt",
        type: 'text'
    },
    {
        name: "actions",
        label: "Actions"
    }
];

const custProductSaleItemListHeaders = [
    {
        name: "custProduct.idenNo",
        label: "Iden No",
        type: 'text'
    },
    {
        name: "custProduct.name",
        label: "Name",
        type: 'text'
    },
    {
        name: "salePrice.price",
        label: "Price",
        type: 'text'
    },
    {
        name: "saleQnt",
        label: "Qnt",
        type: 'text'
    },
    {
        name: "subTotal",
        label: "Sub Total",
        type: 'text',
        render: (value, row, header, props)=>{
           return value;// row.salePrice.price*row.saleQnt;
        }
    }
];
const headers= { 
    headers: mainheaders,
    childrens :[
        {
            label: "Items",
            name: "custProductSaleItemList",
            headers: custProductSaleItemListHeaders
        }
    ]
}

const modelheaders = [
    {
        name: "name",
        label: "Name",
        type: 'text'
    },
    {
        name: "emailAddress",
        label: "Email address",
        type: 'email'
    },
    {
        name: "phoneNumber",
        label: "Phone number",
        type: 'text'
    },
    {
        name: "mobileNumber",
        label: "mobileNumber",
        type: 'text'
    },
    {
        name: "permamentAddress",
        label: "Permament address",
        type: 'text'
    },
    {
        name: "presentAddress",
        label: "Present Address",
        type: 'text'
    }
];

class CustOrderPage extends Component {

     
    state={
        configPage : true,
        savePage : false,
        saveModel: false,
        deleteModel: false,
        printModel: false,
        dataObject: {},
        title: "",
        type: ""
    }

    constructor(props) {
        super(props);
    }

    _clearModel=()=>{
        this.setState({ deleteModel:false, saveModel:false, printModel: false,  savePage : false });
    }
    
    clearAndRefresh = () => {
        this.props.getCustSaleList();
        this.setState({ dataObject: {}, saveModel: false,deleteModel:false, savePage : false  });
    }
    
    _edit = row => {
        this._clearModel();
        if(this.state.configPage){
             this.setState({ dataObject: row, title:"Edit sale", type:"Edit", savePage: true  });
        } else{
            this.setState({ dataObject: row, title:"Edit sale", type:"Edit", saveModel: true  });
        }
    }

    _add = () => {
        this._clearModel();
        if(this.state.configPage){
            this.setState({ dataObject: {}, title:"Add sale", type:"Add", savePage: true  });
        } else{
            this.setState({ dataObject: {}, title:"Add sale", type:"Add", saveModel: true  });
        }
    }

    build=(row)=>{
        let custCustomer= this.props.custCustomerList.find(custCustomer=>custCustomer.id==row.customerId);
        let custBusiness= this.props.custBusinessList.find(custBusiness=>custBusiness.id==row.businessId);
        const subTotal=row.custProductSaleItemList.reduce((previousValue, currentValue) => {
            return previousValue + (Number.parseFloat(currentValue.salePrice.price)*currentValue.saleQnt);
        }, 0);
        const invoice={
            idenNo:row.idenNo,
            date:row.saleDate,
            from: {
                name: custBusiness.name, 
                phone: custBusiness.phoneNumber, 
                address: custBusiness.permamentAddress
            } ,
            to: {
                name: custCustomer.name, 
                phone: custCustomer.phoneNumber, 
                address: custCustomer.permamentAddress
            },
            payment: {
                status: 'Unpaid',
                amount: subTotal-row.discounts
            },
            headers:custProductSaleItemListHeaders,
            items: row.custProductSaleItemList,
            subTotal: subTotal,
            discounts: row.discounts,
            totalAmount:subTotal-row.discounts,
        }
        return invoice;
     }

    _print = (row) => {
        this._clearModel();
        this.setState({ dataObject: this.build(row), title:"Sale Invoice", type:"Print", printModel: true  });
     }
    _delete = row => {
        this._clearModel();
        this.setState({ dataObject: row, title:"Delete sale", type:"Delete", deleteModel: true  });
    };
    
     saveObject = (type, row) => {
        if(type=='Add')
            this.props.addCustSale(row, this.clearAndRefresh)
        if(type=='Edit')
            this.props.editCustSale(row.id,row, this.clearAndRefresh)
        if(type=='Delete')
            this.props.deleteCustSale(row.id, this.clearAndRefresh)

    };

    addToCart = (custProduct)=>{
        if(custProduct){
            let itemObject = {};
            itemObject['custProductId']=custProduct.id;
            itemObject['saleQnt']=1;
            itemObject['discount']=0;
            itemObject['isWholeSale']=false;
            itemObject['salePrice']=custProduct.retailPrice;
            itemObject['purchasePrice']=custProduct.purchasePrice;
            const newCart={...this.props.custCart};
            const custCartSaleItem=newCart.custCartSaleItemList.find(selectedItem=>selectedItem.custProductId==itemObject.custProductId);

            if(custCartSaleItem){
                custCartSaleItem.saleQnt=itemObject.saleQnt+custCartSaleItem.saleQnt;
                itemObject= custCartSaleItem;
            }
            const custCartSaleItemList= newCart.custCartSaleItemList.filter(selectedItem=>selectedItem.custProductId!=itemObject.custProductId);
            
            custCartSaleItemList.push(itemObject);

            newCart.custCartSaleItemList=[...custCartSaleItemList];
            
            this.props.editCart(newCart);
        }
    }

   async componentDidMount() {
        this.props.getCustBusinessList();
        this.props.getCustCustomerList();
        await this.props.getCustProductList();
        await this.props.getCustCurrencyItemList();
        this.clearAndRefresh();
    }
    
    searchProducts=(searchTxt)=>{
        console.log("searchProducts=",searchTxt)
    }

    render() {
        return (
            <>
                { !this.state.savePage &&
                       <> 
                       <Grid container>
                            <Grid item sm="12">
                             <Grid container>
                                    <Grid item sm={8} lg={8} md={8}>
                                    <SearchBox
                                        placeholder="Search product "
                                        action = {this.searchProducts}
                                        ></SearchBox>
                                    </Grid>
                                    </Grid>
                                    <Grid item sm={4} lg={4} md={4}>
                                        <CustOrderCart {...this.props}></CustOrderCart>
                                    </Grid>
                            </Grid>
                            
                            <Grid item sm="12">
                                <Grid container>
                                    <Grid item sm={12} lg={12} >
                                        <ProductGrids 
                                        items={this.props.custProductList}
                                        addToCart={this.addToCart}
                                        {...this.props}
                                        ></ProductGrids>
                                    </Grid>
                                </Grid>
                            </Grid>
                       </Grid>
                      </>
                }
                
                {
                    this.state.printModel && <PrintBill
                    title={this.state.title}
                    open={this.state.printModel}
                    headers={headers} 
                    custCustomerList={this.props.custCustomerList}
                    close={this._clearModel}
                    data={this.state.dataObject} 
                    type={this.state.type}
                    fields= {modelheaders}
                    saveAction = {this.saveObject}
                >
                </PrintBill>
                }
            
            </>
        );
    }
}

const mapStateToProps = state => {
    const { user } = state.userReducer;
    const { custSaleList, custCart} = state.custSaleReducer;
    const { custCustomerList} = state.custCustomerReducer;
    const { custProductList} = state.custProductReducer;
    const { custBusinessList} = state.custBusinessReducer;
    const { custCurrencyItemList} = state.custCurrencyItemReducer;

    return { user, custSaleList, custCustomerList, custProductList, custBusinessList, custCart, custCurrencyItemList};
};

export default connect(mapStateToProps, { addCustSale, editCustSale,deleteCustSale, getCustSaleList, getCustCustomerList, getCustProductList, getCustBusinessList, editCart, getCustCurrencyItemList})(CustOrderPage);
