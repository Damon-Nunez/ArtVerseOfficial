import React from 'react'
import {Row,Col} from 'react-bootstrap'
import './AuroraBorealis.css'
import Connect from '../public/images/ConnectWithOthers.jpg'
import { generateWhiteStars } from '../utils/generateWhiteStars'
import Image from 'next/image'


const AuroraBorealis = () => {
    return (
      <div>
        <Row> 
            <Col sm={6} md={6} lg={6}  className='PaddingFix'>
            <div className='Aurora2'>
            <Image 
              className="imgAlter"
              src={Connect} 
              alt="darn" 
              layout="responsive" 
              width={600} // Specify width
              height={400} // Specify height
            />
                        {generateWhiteStars(50)}
            </div>
            </Col>
            <Col sm={6} md={6} lg={6}  className='PaddingFix' >
         <div className='Aurora'>
            <p className = 'header'> Expand Your Artistic Network</p>
            <p className = 'text'> <strong>Build connections that inspire and motivate. ArtVerse makes it easy to grow your social network 
              within the art world. Share your work, follow your favorite creators, and engage in meaningful discussions. 
              Your next collaboration or source of inspiration could be just a click away</strong></p>
              {generateWhiteStars(50)}
            </div>
            </Col>
          </Row>
      </div>
    )
  }
  
  export default AuroraBorealis