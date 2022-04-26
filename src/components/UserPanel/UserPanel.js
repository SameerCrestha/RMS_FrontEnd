import React from 'react';
import MenuList from './MenuList/MenuList';
import './UserPanel.css'

function UserPanel(props) {
    
    return (
        <div className='userPanel'>
            <div className='menu'>
            <MenuList/>
            </div>
        </div>
    );
}

export default UserPanel;