
import { Outlet } from "react-router-dom";
import { Header, Footer, AppFooter } from "@/components";

const FormLayout = () => {
  return (
    <>
       <Header />
     <div className="bg-gray-100">
     <Outlet />
     </div>
     <Footer />
    </>
  )
}

export default FormLayout