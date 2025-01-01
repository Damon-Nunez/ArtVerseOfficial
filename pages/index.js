import React from 'react';
import './index.css';
import StarryBackground from '../promo-parts/StarryBackground';
import PromoNavbar from '../promo-parts/promoNavbar';
import StellarPurple from '../promo-parts/StellarPurple';
import AuroraBorealis from '../promo-parts/AuroraBorealis';
import { Fade } from 'react-reveal';
import 'bootstrap/dist/css/bootstrap.min.css';


function PromoPage() {
  return (
    <div>
      {/* This is importing the front end code into what we see upon our first load */}
        <PromoNavbar />
        <AuroraBorealis />
        <StarryBackground />
        <StellarPurple />
     
    </div>
  );
}

export default PromoPage;
