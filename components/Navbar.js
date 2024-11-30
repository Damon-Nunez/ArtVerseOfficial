import React from 'react'
import {Row,Col} from 'react-bootstrap'
import { FaHome } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GrStatusPlaceholder } from "react-icons/gr";

import './Navbar.css'

const Navbar = () => {
  return (
    <div className='navBackground'>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className='navBlock'>
            <div className='navItems'>
              <GrStatusPlaceholder className='navItemsChildren' />
              <FaHome className='navItemsChildren'  />
              <MdOutlineExplore className='navItemsChildren'  />
              <FaPlusCircle className='navItemsChildren' />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="searchBar"
              style={{
                width: '35rem',  // Adjust width as needed
                height: '3rem',  // Increase height for a larger search bar
                fontSize: '1.2rem',  // Adjust font size if needed to fit
                borderRadius: '5px',
                border: '1px solid #ccc',
                outline: 'none',
                marginRight: '3rem', 
                alignItems: 'center' // Add some padding inside the search bar
              }}
            />
            <div className='navBlockPt2'>
              <FiMessageCircle className='navItemsPt2' />
              <FaBell className='navItemsPt2' />
              <FaPeopleGroup className='navItemsPt2' />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};



export default Navbar
