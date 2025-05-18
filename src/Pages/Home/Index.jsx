import { Shop } from '../../Shared/Shop/Shop';
import { VideoSection } from '../VideoSection/VideoSection';
import { Banner } from './Banner';
import { DontMiss } from './pages/DontMiss/DontMiss';
import { New } from './pages/New/New';
import { Offer } from './pages/Offer/Offer';
import { Shipping } from './pages/Shipping/Shipping';

export const Index = () => {
  return (
    <div className="">
      <Banner />
      <Offer />
      <Shipping />
      {/* <New /> */}
      {/* <Shop /> */}
      <VideoSection />
      {/* <DontMiss /> */}
    </div>
  );
};
