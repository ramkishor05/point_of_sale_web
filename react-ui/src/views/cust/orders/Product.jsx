import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import { ButtonGroup } from '@material-ui/core';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import defaultImg from '../../../assets/images/product/no-item-found.png'

export default function MediaCard(props) {
  const {item, addToCart, buyNow}= props;

  const price=(productPrice)=>{
      let custCurrency=props.custCurrencyItemList.find(custCurrencyItem=>custCurrencyItem.id==productPrice.currencyId)
      return custCurrency ? custCurrency.symbol +""+ productPrice.price : productPrice.price;
  }

  return (
    <Card className="card" >
      <img
        sx={{ height: 150, margin:1}}
        src={
            item.logoUrl? item.logoUrl: defaultImg
        }
        
        title={item.title}
      />
      <CardContent style={{padding:'10px'}}>
        <Typography gutterBottom variant="h5" component="div">
        {item.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
        {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {item.desciption}
        </Typography>
      </CardContent>
      <CardActions style={{padding:'10px'}}>
        <ButtonGroup fullWidth>
          <Button variant='outlined' size="medium"><SellOutlinedIcon></SellOutlinedIcon>{price(item.retailPrice)} 
          <del style={{color: 'GrayText', marginLeft:'10px'}}>{price(item.retailPrice)}</del>
          </Button>
          <Button variant='contained' size="medium" color='secondary' onClick={()=> 
            addToCart(item)}><AddShoppingCart></AddShoppingCart></Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}