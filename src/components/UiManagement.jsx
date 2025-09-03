import { BannerManagement } from '../Pages/Home/pages/BannerManager/BannerManagement';
import { CategoryManagement } from './CategoryManagement';

const UiManagement = () => {
  return (
    <div className="p-4 md:p-6 bg-white min-h-screen w-full flex gap-6">
      <div className="w-2/3">
        <BannerManagement />
      </div>
      <div className="w-1/3">
        <CategoryManagement />
      </div>
    </div>
  );
};

export default UiManagement;
