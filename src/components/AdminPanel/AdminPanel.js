import React from 'react';
import SideBar from './SideBar/SideBar';
import './AdminPanel.css'
import {Routes,Route} from 'react-router-dom'
import Order from './Order/Order';
import Inventory from './Inventory/Inventory';
import Home from './Home/Home';
import Menu from './Menu/Menu'

function AdminPanel(props) {
    return (
        <div className='adminPanel'>
        <SideBar/>
        <div className='main'>
            <Routes>
                <Route path='/menu' element={<Menu/>}></Route>
                <Route path='/order' element={<Order/>}></Route>
                <Route path='/inventory' element={<Inventory/>}/>
                <Route path='/' element={<Home/>}/>
                
            </Routes>
        </div>
        </div>
    );
}

export default AdminPanel;