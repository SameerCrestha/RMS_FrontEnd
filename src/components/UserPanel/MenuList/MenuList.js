import React,{useState,useEffect} from 'react';
import Table from 'react-bootstrap/Table'
import './MenuList.css';
function Section({index,header,items}){
  return(
    <>
      <thead><tr><td>{header}</td></tr></thead>
      <tbody>
        {items.map(el=>
          <tr key={el.food_id}>
            <td>{el.food_name}</td>
            <td>Rs {el.food_price}</td>
          </tr>
        )}
      </tbody>
    </>
  );

}
function MenuList(props) {
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
  !data?<div>loading</div>:<Table className='userMenuTable' borderless hover>{data.map((el,index)=><Section index={index} header={el.header} items={el.items}/>)}</Table>
  );
}

export default MenuList;