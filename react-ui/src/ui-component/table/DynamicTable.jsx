import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Fab} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const styles = {
    updateButton: {
        color: 'purple'
    },
    deleteButton: {
        color: 'red'
    }
};

function DynamicTable (props){
    const {headers, dataList} = props;
    return (
        <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <caption>{props.title}</caption>
                    <TableHead>
                    <TableRow>
                        {
                            headers && headers.map(header=>
                                <TableCell key={header.name} align={header.align} >{header.label}</TableCell>
                            )
                        }
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataList && dataList.map((row, i) => (
                        <TableRow key={i}>{
                            headers &&  headers.map(header=>
                                    
                                        header.name=='actions' 
                                        ?
                                        <TableCell key={header.name+'_'+i} align='right'>
                                             <Fab color="secondary" aria-label="Edit" className={styles.updateButton} onClick={() => props.editAction(row)}>
                                                <EditIcon/>
                                            </Fab>
                                            <Fab color="secondary" aria-label="Delete" className={styles.deleteButton} onClick={() => props.deleteAction(row)} >
                                                <DeleteIcon />
                                            </Fab>
                                        </TableCell>
                                        :
                                         <TableCell key={header.name+'_'+i} {...header.props}>{row[header.name]}</TableCell>
                                    
                                )
                            }
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
        </TableContainer>
    )
}

export default DynamicTable;