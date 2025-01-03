import React from 'react'
import './feed.css'
import Navbar from '../components/navbar'
import { useState } from 'react'

const feed = () => {
      const [modalVisible, setModalVisible] = useState(false); //State that controls a pop up for editing your profile

      const openModal = () => {
        setModalVisible(true);
      };
      
  return (
    <div>
        <Navbar/>
      <h1> This is the feed </h1>
    </div>
  )
}

export default feed
