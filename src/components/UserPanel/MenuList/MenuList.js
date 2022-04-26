import React,{useState,useEffect} from 'react';
import Table from 'react-bootstrap/Table'
import './MenuList.css';
import { Ring } from 'react-awesome-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MenuList(props) {
  const [orderList,setOrderList]=useState([]);
  function Row({item}){
    const [count,setCount]=useState(0);
    const [confirmed,setConfirmed]=useState(false);
    const [itemIndex,setItemIndex]=useState(null);
    function confirmButtonHandler(){
      setConfirmed(true);
      let temp={food:item,quantity:count};
      orderList.push(temp);
      setItemIndex(orderList.indexOf(temp));
      setOrderList(orderList);
    }
    useEffect(()=>{
      count?setConfirmed(false):setConfirmed(true);
    },[count])
    useEffect(()=>{
      //remove item from orderList if confirmed false
      if(!confirmed) {
        orderList.splice(itemIndex,1);
        setOrderList(orderList);
      }
      console.log(orderList)
    },[confirmed,itemIndex]);
    
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
  function Section({index,header,items}){
  return(
    <>
      <thead><tr><td>{header}</td></tr></thead>
      <tbody>
        {items.map(el=>
          <Row item={el}/>
        )}
      </tbody>
    </>
  );

  }
  const[data,setData]=useState();//data format:[{header:"header",items:[{food_name:"momo",food_price:100},{}]},{}]
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
  return(
  !data?<div className='loadingDiv'><Ring/></div>:<Table className='userMenuTable' borderless hover>{data.map((el,index)=><Section index={index} header={el.header} items={el.items}/>)}</Table>
  );
}

export default MenuList;