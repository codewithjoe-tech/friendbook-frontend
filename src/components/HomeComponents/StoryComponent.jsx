import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import StoryAvatar from './StoryAvatar';

const StoryComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:9,
    slidesToScroll: 3,
    arrows: true,  
    
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: true, 
        }
      }
    ]
  };

  return (
    <div className=" max-w-full h-40 overflow-hidden mt-7">
        <h1 className='text-3xl font-bold mb-7'>Stories</h1>
      <Slider className='h-40'  {...settings}>
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
       <StoryAvatar imgSrc={'/user.webp'} />
      </Slider>
    </div>
  );
};

export default StoryComponent;
