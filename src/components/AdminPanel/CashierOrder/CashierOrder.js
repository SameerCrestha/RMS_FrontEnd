import React, { useEffect, useState } from 'react';
import { Ring } from 'react-awesome-spinners';
import './CashierOrder.css'
function Page({data}){
    return(
        <div className='page'>
        {data.items.map(el=><div></div>)}
        </div>
    )
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
    function editOrder(id,newOrder){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(newOrder);

        var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${orderPrefix}/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
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
    useEffect(()=>{
        getOrders().then(res=>{setData(res);setLoaded(true)});
    },[]);
    if(!loaded) {
        return <div className='loadingDiv'><Ring/></div>
    }else{
        return <div className='cashierOrder'>
            <TableSelect setTable={setTable} active={table}/>
            <Page data={data.find(el=>el.table===table)}/>
        </div>
    }
    
}

export default CashierOrder;