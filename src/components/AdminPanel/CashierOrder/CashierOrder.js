import React, { useEffect, useState } from 'react';
import { Ring } from 'react-awesome-spinners';
import './CashierOrder.css'
import { toast } from 'react-toastify';
function Page({data,setStatusPaid}){
    function paidHandler(){
        setStatusPaid(data.order_id).then(result=>{
            toast.info(result.detail,{autoClose:2000});
            setTimeout(()=>{window.location.reload();},3000)
        })
    }
    function getTotal(items){
        let sum=0;
        items.forEach(item=>{
            sum+=item.food.food_price*item.quantity;
        })
        return sum;
    }
    if(!data){
        return <div className='page'>
            <div className='orderList'>
            <div>No orders for this table</div>
            </div>
        </div> 
    }else{
        return <div className='page'>
        <div className='orderList'>
        Order List:
        {data.items.map(el=>
        <div className='listItem'>
            <div className='foodName'>{el.food.food_name}</div>
            <div className='foodQuantity'>{el.quantity}</div>
        </div>)}
        <div className='listItem'>
            <div className='foodName'>Total</div>
            <div className='foodQuantity'>Rs {getTotal(data.items)}</div>
        </div>
        </div>
        <div className='orderInfo'>
            <div>Note:{data.note}</div>
            <div>Order Date:{data.order_date}</div>
            <div>Status:{data.status}</div>
            <div className='cancelButton' onClick={paidHandler}>Set status paid</div>
        </div>
        </div>
    }
}
function TableSelect({setTable,active}){
    return <div className='tableSelect'>
        <div style={active===1?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(1)}}>Table 1</div>
        <div style={active===2?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(2)}}>Table 2</div>
        <div style={active===3?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(3)}}>Table 3</div>
        <div style={active===4?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(4)}}>Table 4</div>
        <div style={active===5?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(5)}}>Table 5</div>
        <div style={active===6?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(6)}}>Table 6</div>
        <div style={active===7?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(7)}}>Table 7</div>
        <div style={active===8?{borderBottom:"3px solid lime"}:{}} onClick={()=>{setTable(8)}}>Table 8</div>
    </div>
}
function CashierOrder(props) {
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const orderPrefix=process.env.REACT_APP_ORDER_PREFIX;
    const token=localStorage.getItem('token');
    const [data,setData]=useState([]);
    const [loaded,setLoaded]=useState(false);
    const [table,setTable]=useState(1);
    function getOrders(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${orderPrefix}/`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
    // function editOrder(id,newOrder){
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify(newOrder);

    //     var requestOptions = {
    //     method: 'PATCH',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //     };

    //     return fetch(`${baseUrl}//${orderPrefix}/${id}`, requestOptions)
    //     .then(response => response.json())
    //     .then(result => result)
    //     .catch(error => console.log('error', error));
    // }
    function completeOrder(id){
        var requestOptions = {
            method: 'PATCH',
            redirect: 'follow'
          };
          
          return fetch(`${baseUrl}//${orderPrefix}/${id}/Prepared`, requestOptions)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.log('error', error));
    }
    function deleteOrder(id){
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          };
          
          return fetch(`${baseUrl}//${orderPrefix}/?order_id=${id}`, requestOptions)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.log('error', error));
    }
    function setStatusPaid(id){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}/${orderPrefix}/${id}/Paid`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
    useEffect(()=>{
        getOrders().then(res=>{setData(res);setLoaded(true)});
    },[]);
    if(!loaded) {
        return <div className='loadingDiv'><Ring/></div>
    }else{
        return <div className='cashierOrder'>
            <TableSelect setTable={setTable} active={table}/>
            <Page data={data.find(el=>el.table===table)} setStatusPaid={setStatusPaid}/>
        </div>
    }
    
}

export default CashierOrder;