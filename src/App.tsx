// React router dom
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";

import jwt_decode from "jwt-decode";

// Pages
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import User from "./pages/user/user";
import CreateUser from "./pages/user/createUser";
import Admin from "./pages/admin/admin";
import CreateAdmin from "./pages/admin/createAdmin";
import Settings from "./pages/settings"

import Topbar from "./global/Topbar";

// Sidebar
import { ProSidebarProvider } from 'react-pro-sidebar';
import SidebarReact from "./global/Sidebar";
import React, { useEffect, useState } from "react";

//~ Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

//~ Redux
import { setUserData, removeUserData, getAdminData } from "./redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";




console.log("App");

const App: React.FC = () => {

  console.log("inside app");

  // path state
  const [path, setPath] = useState<string>('/')
  const location = useLocation()

  useEffect(() => {
    setPath(location.pathname)
  }, [location.pathname])

  // Redux
  const dispatch = useAppDispatch();
  const isUser = useAppSelector((state) => state?.auth?.user?.uid);
  const adminData = useAppSelector((state) => state?.auth?.admin);

  // Visible state for sidebar and topbar
  const isVisible = (path !== "/" && !!isUser)

  /** 
   * Auth state listener
   * 
   * If user is logged in then dispatch the user data to the redux store
   * Get admin user data from firestore
   */
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {

      if (user && user.uid) {
        user.getIdToken().then((token) => {

          // decode token and get custom claim
          const decodedToken = jwt_decode(token);
          const { admin, institute }: any = decodedToken;

          // if user is not admin then remove user data from redux store and signout
          if (!admin) {
            dispatch(removeUserData());
            auth.signOut();
            return;
          }

          // dispatch user data to redux store
          const userData = {
            displayName: user.displayName,
            uid: user.uid,
            institute: institute,
            email: user.email,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            accessToken: token,
          }

          dispatch(setUserData(userData));

          // Get admin user data from firestore if the data isn't in redux store
          if (adminData === null) {
            // update the lastLoginAt field in firestore
            const docRef = doc(db, 'institutes/smvec/admins', user.uid);


            updateDoc(docRef, {
              lastLoginAt: serverTimestamp()
            })
              .catch((error) => {
                console.error('Error updating document: ', error);
              });

            dispatch(getAdminData([institute, user.uid]))
          }
        })
      } else {
        dispatch(removeUserData());
      }
    });

    return () => unSubscribe();
  }, [dispatch]);

  return (
    <div className='flex'>
      {/* Global component */}
      <ProSidebarProvider>
        <SidebarReact isVisible={isVisible} activeMenu={path} />
        <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
          <main>
            {isVisible && <Topbar />}
            <Routes>
              <Route path="/" element={<Login />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/create-admin" element={<CreateAdmin />} />
                <Route path="/users" element={<User />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </main>
        </div>
      </ProSidebarProvider>
    </div>
  )
}

export default App;