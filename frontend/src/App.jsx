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
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import AdminLayout from "./components/AdminLayout";

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
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>

      {/* Admin Routes Wrapped in AdminLayout */}
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/" />}>
        <Route index element={<Admin />} />
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