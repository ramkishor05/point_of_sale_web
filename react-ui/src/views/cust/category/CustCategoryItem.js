import React, { Component} from 'react';

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';


import MainCard from '../../../component/cards/MainCard';
import DynamicTable from '../../../component/table/DynamicTable';
import DynamicModel from '../../../component/model/DynamicModel';
import ConfirmModel from '../../../component/model/ConfirmModel';

import { getCustCategoryList, addCustCategory, editCustCategory, deleteCustCategory, getCustCategoryGroupList } 
from '../../../actions';
import { connect } from 'react-redux';

const headers = [
    {
        name: "logoUrl",
        key: "logoUrl",
        label: "Logo",
        type:'img',
        grid: 12,
        width: 100,
        height: 100
    },
    {
        name: "name",
        label: "Name",
        type: 'text'
    },
    {
        name: "description",
        label: "Description",
        type: 'text'
    },
    {
        name: "typeId",
        label: "Type",
        type: 'text'
    },
    {
        name: "custCategoryGroupId",
        key: "custCategoryGroupId",
        label: "Group",
        type: "select",
        onItems : (value, data, field, props)=>{
            return props.custCategoryGroupList? props.custCategoryGroupList: [];
        },
        itemKey: 'id',
        itemVal: 'name'
    }
]

const table = [
    {
        name: "logoUrl",
        key: "logoUrl",
        label: "Logo",
        type:'img',
        grid: 12,
        width: 50,
        height: 50
    },
    {
        name: "name",
        label: "Name",
        type: 'text'
    },
    {
        name: "description",
        label: "Description",
        type: 'text'
    },
    {
        name: "typeId",
        label: "Type",
        type: 'text'
    },
    {
        name: "actions",
        label: "Actions"
    }
]

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    input: {
      display: 'none',
    },
});
class CustCategoryItem extends Component {
    state={
        saveModel: false,
        deleteModel: false,
        dataObject: {},
        title: "",
        type: ""
    }
    
    _edit = row => {
       this.setState({ dataObject: row, title:"Edit category list", type:"Edit", saveModel: true  });
    }

    _add = () => {
       this.setState({ dataObject: {}, title:"Add category list", type:"Add", saveModel: true  });
    }

    _delete = row => {
        this.setState({ dataObject: row, title:"Delete category list", type:"Delete", deleteModel: true  });
    };
    
     saveObject = (type, row) => {
        if(type=='Add')
            this.props.addCustCategory(row, this.clearAndRefresh)
        if(type=='Edit')
            this.props.editCustCategory(row.id, row, this.clearAndRefresh)
        if(type=='Delete')
            this.props.deleteCustCategory(row.id, this.clearAndRefresh)

    };

    clearAndRefresh = () => {
        this.props.getCustCategoryList();
        this.setState({ dataObject: {}, saveModel: false,deleteModel:false  });
    }
    
    componentDidMount() {
        this.props.getCustCategoryList();
        this.props.getCustCategoryGroupList();
    }
    render() {
        return (
            <>
                
                <MainCard title="Category List" 
                  border = {false}
                 content = {false}
                        button ={
                            
                            <Fab size="medium" color="primary" aria-label="Add" className={styles.button}
                                onClick={this._add}>
                                <AddIcon />
                            </Fab>
                        }
                    >
                        <DynamicTable 
                        headers={table} 
                        dataList={this.props.custCategoryItemList}
                        deleteAction = {this._delete}
                        editAction = {this._edit}
                        ></DynamicTable>
                    </MainCard>
                {
                    this.state.saveModel && 
                    <DynamicModel
                    title={this.state.title}
                    openAction={this.state.saveModel}
                    closeAction={()=> this.setState({saveModel: false})}
                    data={this.state.dataObject} 
                    type={this.state.type}
                    fields= {headers}
                    saveAction = {this.saveObject}
                    custCategoryGroupList= {this.props.custCategoryGroupList}
                    >
                    </DynamicModel>
                }
               
            
                <ConfirmModel
                openAction={this.state.deleteModel}
                closeAction={()=> this.setState({deleteModel: false})}
                data={this.state.dataObject} 
                type={this.state.type}
                message= 'Do you want to delete'
                saveAction = {this.saveObject}
                >
                </ConfirmModel>
            </>
        );
    };
}



const mapStateToProps = state => {
    const { custCategoryGroupList, show_cust_category_group_loader } = state.custCategoryGroupReducer;
    const { custCategoryItemList, show_cust_category_loader } = state.custCategoryItemReducer;
    return { custCategoryItemList, show_cust_category_loader, custCategoryGroupList, show_cust_category_group_loader };
};


export default connect(mapStateToProps, { getCustCategoryList, addCustCategory, editCustCategory, deleteCustCategory, getCustCategoryGroupList })(CustCategoryItem);


