
import { Inter } from "next/font/google";
import Navbar from "../components/navbar";
import "./globals.css";
import store from "../redux/store";
import { Provider } from 'react-redux';
import "primereact/resources/themes/lara-light-cyan/theme.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WizardToolBox : All in one Destination",
  description: "Your all in one destination for your needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
     
        <Navbar/>
        {/* <Provider store={store}> */}
        <div className="w-full justify-center flex">
          <div className="w-5/6">
          
          {children}
          </div>
      
        </div>
        {/* </Provider> */}

      </body>

    </html>
  );
}
