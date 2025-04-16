import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import SaleShopOfficeForm from "../../features/SaleShopOfficeForm";

const SaleShopOfficeFormPage = () => {
  return (
    <>
 <HeroSection tittle="Sale ( Shop & Office ) " />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <SaleShopOfficeForm/>
            </div>
      
    </>
  )
}

export default SaleShopOfficeFormPage
