import { Routes, Route } from "react-router";
import Home from "../Pages/Home";
import App from "./App";
import Login from "./Login";

import Reviews from "../Pages/Reviews";
import Profile from "../Pages/Profile";




export default function Routepaths() {
  return (
    <Routes future={{
      v7_startTransition: true,
    }}>

        <Route path="/" element={<App></App>}>
          <Route index element={<Home></Home>} /> {/* Default child route */}
          <Route path="login" element={<Login></Login>} />
          <Route path="Reviews" element={<Reviews></Reviews>} />
          <Route path="Profile/:userId" element={<Profile></Profile>} />


          {/* <Route path="Reviewss" element={<Reviewss></Reviewss>} /> */}
        </Route>


    </Routes>

  )
}
