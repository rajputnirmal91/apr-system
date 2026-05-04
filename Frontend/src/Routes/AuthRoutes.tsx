/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import ChangePassword from '@project/Pages/Auth/ChangePassword'
import ForgetPassword from '@project/Pages/Auth/ForgetPassword'
import Login from '@project/Pages/Auth/Login'

type AuthRoutesProps = {
  root: string
  forgotPassword: string
  resetPassword: string
}

function AuthRoutes(route: AuthRoutesProps) {
  return (
    <>
      <Route path={route.root} element={<Login />} />
      <Route path={route.forgotPassword} element={<ForgetPassword />} />
      <Route path={route.resetPassword} element={<ChangePassword />} />
    </>
  )
}

export default AuthRoutes
