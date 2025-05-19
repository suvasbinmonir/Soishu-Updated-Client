import { Outlet } from 'react-router-dom';
import { Footer } from '../Shared/Footer/Footer';
import { Nav } from '../Shared/Navbar/Nav';

export const Main = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};
