import React from 'react';
import SideBar from './SideBar/SideBar';
import './AdminPanel.css'
import {Routes,Route} from 'react-router-dom'
import Inventory from './Inventory/Inventory';
import Home from './Home/Home';
import Menu from './Menu/Menu'
import MenuList from '../UserPanel/MenuList/MenuList';
import CashierOrder from './CashierOrder/CashierOrder';
import KitchenOrder from './KitchenOrder/KitchenOrder';

function AdminPanel(props) {
    return (
        <div className='adminPanel'>
        <SideBar/>
        <div className='main'>
            <Routes>
                <Route path='/menu' element={<Menu/>}></Route>
                <Route path='/cashierorder' element={<CashierOrder/>}></Route>
                <Route path='/kitchenorder' element={<KitchenOrder/>}></Route>
                <Route path='/view-menu' element={<MenuList/>}/>
                <Route path='/inventory' element={<Inventory/>}/>
                <Route path='/' element={<Home/>}/>
                <Route path='/view-order' element={<MenuList/>}/>
            </Routes>
        </div>
        </div>
    );
}

export default AdminPanel;