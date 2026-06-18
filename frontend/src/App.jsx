import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import UpdateProblem from './pages/UpdateProblem.jsx';
import UpdateProblemList from './pages/UpdateProblemList.jsx';
import ProblemPage from "./pages/ProblemPage"
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import AdminLayout from "./components/AdminLayout";
import ProblemsPage from "./pages/user/Problems";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComingSoon from "./pages/ComingSoon";
import ProfilePage from "./pages/user/Profile";
import SettingsPage from "./pages/user/Settings";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>;
  }

  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <ProblemsPage />) : <Navigate to="/signup" />}></Route>
      <Route path="/problems" element={isAuthenticated ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <ProblemsPage />) : <Navigate to="/signup" />}></Route>
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/signup" />}></Route>
      <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>

      {/* Coming Soon Routes */}
      <Route path="/myschool" element={<ComingSoon />} />
      <Route path="/contests" element={<ComingSoon />} />
      <Route path="/leaderboard" element={<ComingSoon />} />

      {/* Admin Routes Wrapped in AdminLayout */}
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}>
      </Route>
      
      {/* Fallback Legacy Admin Routes */}
      <Route path="/admin-legacy" element={isAuthenticated && user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="create" element={<AdminPanel />} />
        <Route path="delete" element={<AdminDelete />} />
        <Route path="video" element={<AdminVideo />} />
        <Route path="upload/:problemId" element={<AdminUpload />} />
        <Route path="update" element={<UpdateProblemList />} />
        <Route path="update/:id" element={<UpdateProblem />} />
      </Route>
    </Routes>
  </>
  )
}

export default App;