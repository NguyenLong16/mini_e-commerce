import { Outlet, Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/useRedux"

const PrivateRoute = () => {
    const { isAuthenticated } = useAppSelector(state => state.auth)

    return isAuthenticated ? <Outlet /> : <Navigate to='login' replace />
}

export default PrivateRoute

//     < Routes >
//   <Route path="/login" element={<LoginPage />} />

//   <Route element={<PrivateRoute />}>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/profile" element={<ProfilePage />} />
//   </Route>
// </Routes >
