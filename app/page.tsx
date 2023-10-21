import Header from "@/app/header/Header";
import HomeIntro from "@/app/components/HomeIntro";
import HomeAbout from "@/app/components/HomeAbout";
import Quote from "@/app/components/Quote";
import BloodBanks from "@/app/components/BloodBanks";

const Home = () => {
  return (
    <div>
      <Header />

      <HomeIntro />

      <HomeAbout />

      <Quote quote="Blood cannot be manufactured, it can only come from generous donors. By bridging the gap between blood donors and those in need, we can make a life-saving difference for patients and their families." />

      <BloodBanks />
    </div>
  )
};

export default Home;
