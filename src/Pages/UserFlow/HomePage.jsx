import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import PropertyFilter from "../../components/common/PropertyFilter";
import PropertyListingGrid from "../../components/common/PropertyListGrid";

const HomePage = () => {
  return (
    <>
      <Header />

      <PropertyFilter />
      <PropertyListingGrid />

      <div className="w-[100%] h-[700px]"></div>
      <Footer />
    </>
  );
};

export default HomePage;
