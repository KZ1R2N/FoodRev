import { Routes, Route } from "react-router";
import Home from "./Pages/Home";
import App from "./App";
import Login from "./Pages/Login";
import Reviews from "./Pages/Reviews";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UsersPage from "./Pages/UsersPage";
import ReviewsPage from "./Pages/Admin/ReviewsPage";
import FoodsPage from "./Pages/Admin/FoodsPage"; 
import FoodDetails from "./Pages/FoodDetails"; 
import Registration from "./Pages/Registration";
import './index.css'
import PrivateRoute from "./PrivateRoute";

export default function Routepaths() {
  return (
    <Routes
      future={{
        v7_startTransition: true,
      }}
    >
      {/* Main App Wrapper */}
      <Route path="/" element={<App></App>}>
        <Route index element={<Home></Home>} /> {/* Default child route */}
        <Route path="login" element={<Login></Login>} />
        <Route path="reviews" element={<PrivateRoute><Reviews></Reviews></PrivateRoute>} />
        <Route path="profile/:userId" element={<Profile></Profile>} />
        <Route path="food-details/:foodId" element={<PrivateRoute><FoodDetails></FoodDetails></PrivateRoute>} />
        <Route path="registration" element={<Registration></Registration>} />

      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Dashboard */}
      <Route path="/admin/users" element={<UsersPage />} /> {/* Admin Users Page */}
      <Route path="/admin/reviews" element={<ReviewsPage />} /> {/* Admin Reviews Page */}
      <Route path="/admin/foods" element={<FoodsPage />} /> {/* Admin Foods Page */}
    </Routes>
  );
}
