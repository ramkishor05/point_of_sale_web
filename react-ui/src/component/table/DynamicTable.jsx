import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, ButtonGroup, Fab} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles({
    table: {
      minWidth: '90%',
      height:'100%',
      margin: 0,
      padding:0,
      "& .MuiTableCell-root": {
        border: "1px solid rgba(224, 224, 224, 1)"
      }
    }
  });

const styles = {
    updateButton: {
        color: 'purple'
    },
    deleteButton: {
        color: 'red'
    }
};

function DynamicTable (props){
    const classes = useStyles();

    const getValue=(data, keyStr)=>{
        let keys=keyStr.split("\.");
        let val=data;
        for (let i = 0; i < keys.length; i++){
          if( typeof val === 'object'){
            if(!val){
              val={};
            }
            val=val[keys[i]];
          }
        }
        return val;
      }

    const renderCell= (data, field)=>{
        switch(field.type) {
        case 'img':
            return  <img
                    width={field.width}
                    height={field.height}
                    className={classes.img}
                    src={getValue(data,field.name)}
                />
        default:
           return getValue(data,field.name);
        }
    }

    const {headers, dataList} = props;
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table" className={classes.table}>
                <caption>{props.title}</caption>
                <TableHead>
                <TableRow>
                    {
                        headers && headers.map(header=>
                            header.name=='actions' 
                            ?
                            <TableCell component="th" scope="row" 
                            key={header.name} 
                            align={header.align? header.align: 'center'} 
                            style={{width: header.width}}
                            >{header.label}</TableCell>
                            :
                            <TableCell component="th" scope="row" 
                            key={header.name} align={header.align? header.align: 'left'} 
                            style={{width: header.width}}
                            >{header.label}</TableCell>
                        )
                    }
                </TableRow>
                </TableHead>
                <TableBody>
                {dataList && dataList.length>0 ?  dataList.map((row, i) => (
                    <TableRow key={i}>{
                        headers &&  headers.map(header=>
                            header.name=='actions' 
                            ?
                            header.render ? header.render('', row, i, header, props) :
                            <TableCell key={header.name+'_'+i} align={header.align? header.align: 'center'}>
                               <ButtonGroup>
                                {
                                props.editAction &&
                                <Button color="secondary" aria-label="Edit" size="small" variant='outlined'  onClick={() => props.editAction(row)}>
                                        <EditIcon/>
                                </Button>
                                }
                                {
                                props.deleteAction &&
                                <Button  color="error" aria-label="Delete"  size="small" variant='outlined' onClick={() => props.deleteAction(row)} >
                                    <DeleteIcon />
                                </Button>

                                }
                                {
                                props.printAction && 
                                <Button color="primary"  aria-label="Print"  size="small" variant='outlined'  onClick={() => props.printAction(row)} >
                                    <PrintIcon />
                                </Button>
                                }
                                </ButtonGroup>
                            </TableCell>
                            :
                            <TableCell key={header.name+'_'+i} {...header.props}>{
                                renderCell(row,header)
                                
                                
                             }</TableCell>
                            )
                        }
                    </TableRow>
                )) :
                <TableRow>
                    <TableCell colSpan={headers.length+1} align='center'>
                        No rows found
                    </TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DynamicTable;