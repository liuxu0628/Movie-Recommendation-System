import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import CustomDotGroup from './CustomDotGroup'
import HomePageHeading from './HomePageHeading'

import m1 from '../../assets/images/m1.png';
import m2 from '../../assets/images/m2.png';
import m3 from '../../assets/images/m3.png';
import m4 from '../../assets/images/m4.png';
import m5 from '../../assets/images/m5.png';

import './index.scss'

export default class extends React.Component {
    render() {
      return (
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={55}
          totalSlides={5}
          hasMasterSpinner={true}
          isPlaying={true}
          className="myCarouselContainer"
        >
          <Slider>
            <Slide index={0}>
                <HomePageHeading />
                <Image className='carousel-image' src={m1} />
            </Slide>
            <Slide index={1}>
                <Image className='carousel-image' src={m2} />
            </Slide>
            <Slide index={2}>
                <Image className='carousel-image' src={m3} />
            </Slide>
            <Slide index={3}>
                <Image className='carousel-image' src={m4} />
            </Slide>
            <Slide index={4}>
                <Image className='carousel-image' src={m5} />
            </Slide>
          </Slider>
          <CustomDotGroup slides={5} />
        </CarouselProvider>
      );
    }
}