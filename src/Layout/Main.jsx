import { Outlet } from 'react-router-dom';
import { Nav } from '../Shared/Navbar/nav';
import { Footer } from '../Shared/Footer/Footer';

export const Main = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};
