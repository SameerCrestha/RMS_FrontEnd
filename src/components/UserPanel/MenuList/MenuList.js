import React,{useState,useEffect} from 'react';
import Table from 'react-bootstrap/Table'
import './MenuList.css';
import { Ring } from 'react-awesome-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';

function Row({item,orderList,setOrderList}){
  const [count,setCount]=useState(0);
  const [confirmed,setConfirmed]=useState(false);
  function confirmButtonHandler(){
    setConfirmed(true);
    let temp={food:item,quantity:count};
    setOrderList((prevOrderList)=>{
      let newOrderList=[...prevOrderList,temp];
      return newOrderList;
    });
    
  }
  
  useEffect(()=>{
    if(count===0)setConfirmed(true)
    else setConfirmed(false);
  },[count])
  useEffect(()=>{
    //remove item from orderList if confirmed false
    if(!confirmed ) {
      setOrderList(prevOrderList=>{
        if(prevOrderList.length!==0){
          let newOrderList=prevOrderList.filter(el => el.food.food_id !== item.food_id)
          return newOrderList;
        }else return prevOrderList;
      });
    }
  },[confirmed]);
  
  return (<tr key={item.food_id}>
          <td>{item.food_name}</td>
          <td>Rs {item.food_price}</td>
          <div className='counter'>
          <FontAwesomeIcon className='countButton' icon="fa-plus" onClick={()=>{setCount(count+1)}}/>
          <div className='counterText'>{count}x</div>
          <FontAwesomeIcon className='countButton' icon="fa-minus" onClick={()=>count?setCount(count-1):""}/>
          <FontAwesomeIcon className={'countButton addButton '+(confirmed?"disable":"")} icon="fa-check" onClick={confirmButtonHandler}/>
          </div>
        </tr>)
}
function Section({index,header,items,orderList,setOrderList}){
  return(
    <>
      <thead><tr><td>{header}</td></tr></thead>
      <tbody>
        {items.map(el=>
          <Row item={el} orderList={orderList} setOrderList={setOrderList}/>
        )}
      </tbody>
    </>
  );

}
function OrderList({orderList,setOrdered,setOverlay}){
  
  const[total,setTotal]=useState(0);
  const [note,setNote]=useState('');
  const [table,setTable]=useState(1);
  function postOrder(req){
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const orderPrefix=process.env.REACT_APP_ORDER_PREFIX;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(req);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`${baseUrl}//${orderPrefix}`, requestOptions)
      .then(response => response.json())
      .then(result =>{ toast.success("Order confirmed",{autoClose:3000});setOrdered(true)})
      .catch(error => console.log('error', error));
  }
  useEffect(()=>{
    let sum=0;
    orderList.forEach((el)=>{
      sum+=el.food.food_price*el.quantity;
    });
    setTotal(sum);
  },[orderList])
  return(
  <div className='orderListOverlay'>
  <FontAwesomeIcon className='closeButton' icon="fa-xmark" onClick={()=>{setOverlay(false)}}/>
    <div className='orderList'>
    <div><label for="table">Select your table:</label>
    <select defaultValue={1} id="table" name="table" onChange={e=>{setTable(e.target.value)}}>
      <option value={1} selected>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
      <option value={6}>6</option>
      <option value={7}>7</option>
      <option value={8}>8</option>
    </select></div>
    Your order list:
    {orderList.length===0?<div>Empty</div>:<>
    {orderList.map(el=>{
        return <div className='listItem'>
      <div className='foodName'>{el.food.food_name}</div><div className='foodQuantity'>x{el.quantity}</div>
      </div>
    })}
    <input onChange={(e)=>{setNote(e.target.value);}} placeholder='Note for chef'/>
      </>
    }
    <div className='listItem'>
      <div className='foodName'>Total</div><div className='foodQuantity'>Rs {total}</div>
      </div>
    <div className='confirmButton' onClick={()=>{if (total!==0)postOrder({items:orderList,table:table,note:note})}}>Confirm order</div>
  </div>
  </div>
  );
}

function MenuList(props) {
  const [ordered,setOrdered]=useState(false);
  const [orderList,setOrderList]=useState([]);
  const [overlay,setOverlay]=useState(false);
  const[data,setData]=useState([]);//data format:[{header:"header",items:[{food_name:"momo",food_price:100},{}]},{}]  
  useEffect(()=>{
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const foodPrefix=process.env.REACT_APP_FOOD_PREFIX;
    function getCategories(){
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      return fetch(`${baseUrl}//${foodPrefix}/categories/`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
    function getFoodsByCategory(category){
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      return fetch(`${baseUrl}//${foodPrefix}/menu-by-category/?category=${category}`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
    function populateData(categories){
      return Promise.all(categories.map(el=>{
        return getFoodsByCategory(el).then(res=>{
          return {
            header:el,
            items:res[el]
          };
        });
       
        }));
    }
   getCategories().then(categories=>populateData(categories)).then(data=>setData(data));
  },[])
  
  if(ordered){
    return <div>Ordered</div>
  } else if(data.length===0){
      return <div className='loadingDiv'><Ring/></div>
    }else{
      return <>
      {overlay?<OrderList orderList={orderList} setOrdered={setOrdered} setOverlay={setOverlay}/>:""}
      <FontAwesomeIcon icon="fa-list" className='orderListButton' onClick={()=>{setOverlay(true)}}/>
     <Table className='userMenuTable' borderless hover>
       {data.map((el,index)=><Section index={index} header={el.header} items={el.items} orderList={orderList} setOrderList={setOrderList}/>)}
     </Table>
     </>
    } 
}

export default MenuList;