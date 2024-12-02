import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaHome, FaPlusCircle, FaBell } from 'react-icons/fa';
import { MdOutlineExplore } from 'react-icons/md';
import { FiMessageCircle } from 'react-icons/fi';
import { FaPeopleGroup } from 'react-icons/fa6';
import { GrStatusPlaceholder } from 'react-icons/gr';

import './navbar.css';

const Navbar = () => {
  return (
    <div className="navBackground">
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="navBlock">
            {/* Left-side navigation items */}
            <div className="navItems">
              <GrStatusPlaceholder className="navItemsChildren" />
              <MdOutlineExplore className="navItemsChildren" />
              <FaPlusCircle className="navItemsChildren" />
            </div>

            {/* Search bar */}
            <input
              type="text"
              placeholder="Search..."
              className="searchBar"
              style={{
                width: '40rem', // Adjust width as needed
                height: '3rem', // Increase height for a larger search bar
                fontSize: '1.2rem', // Adjust font size to fit
                borderRadius: '5px',
                border: '1px solid #ccc',
                outline: 'none',
                marginLeft: '2rem',
                alignItems: 'center', // Center content inside the search bar
              }}
            />

            {/* Right-side navigation items */}
            <div className="navBlockPt2">
              <FiMessageCircle className="navItemsPt2" />
              <FaBell className="navItemsPt2" />
              <FaPeopleGroup className="navItemsPt2" />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Navbar;
