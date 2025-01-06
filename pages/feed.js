import React from 'react'
import './feed.css'
import Navbar from '../components/navbar'
import { useState } from 'react'
import {Row,Col} from 'react-bootstrap'
const feed = () => {
      
  return (
    <div>
      <Row>
        <Col sm={12} md={12} lg={12}>
        <h1> This is where the search bar will be ideally</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={1} md={1} lg={1}>
  <h1 className='sidebar'> testing the balance </h1>
        </Col> 
      <Col sm={11} md={11} lg={11}>
        <div className="feed-container">
  <div className="feed-item">
    <img src="/images/Cat1.jpg" alt="Post 1" />
  </div>
  <div className="feed-item">
    <img src="/images/Cat2.jpg" alt="Post 2" />
  </div>
  <div className="feed-item">
    <img src="/images/Cat3.jpg" alt="Post 3" />
  </div>
</div>
</Col>
</Row>

    </div>
  )
}

export default feed
