import SplashScreen from "@/_components/SplashScreen";

export default function Home() {
  console.log("NODE_ENV", process.env.NODE_ENV);
  return <SplashScreen />;
}
