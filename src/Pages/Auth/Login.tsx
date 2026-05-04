/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'

import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Hide from '@project/assets/images/Hide.png'
import lmsLogo from '@project/assets/images/lmsLogo.png'
import LoginImg from '@project/assets/images/LoginImg.png'
import pedp from '@project/assets/images/pedp.png'
import Spinner from '@project/Common/Spinner'
import { useLoginMutation } from '@project/Store/Api/Login'
import {
  selectUserState,
  setUserLoginData,
} from '@project/Store/Feature/UserSlice'
import { useAppDispatch } from '@project/Store/hooks'
import { LoginType } from '@project/Types/loginTypes'
import {
  getAdminPostLoginPath,
  getRoleDashboardPath,
} from '@project/Utils/authRedirect'
import {
  getLocalStorage,
  removeLocalStorage,
} from '@project/Utils/browserStorage'
import { showErrorToast } from '@project/Utils/notificationPopup'

import './Auth.scss'

// Validation schema
const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'password should be Minimum 6 characters')
    .required('Password is required'),
})

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const navigate = useNavigate()
  // const location = useLocation()
  // const fromPath = (location.state as any)?.from?.pathname ?? null

  useEffect(() => {
    const showAuthToast = getLocalStorage<boolean>('showNotAuthToast')
    if (showAuthToast) {
      // showErrorToast('Not authenticated')
      removeLocalStorage('showNotAuthToast')
    }
  }, [])

  const currentUser = useSelector(selectUserState)

  // If user is already authenticated and lands on login page, auto-redirect to role dashboard
  useEffect(() => {
    if (currentUser?.accessToken) {
      const path = getRoleDashboardPath(currentUser.user_role)
      if (path) navigate(path)
    }
  }, [currentUser, navigate])

  // Actual login logic
  const handleLogin = useCallback(
    async (values: LoginType, formikHelpers: any) => {
      const payload: LoginType = {
        email: values.email,
        password: values.password,
      }

      try {
        const response = await login(payload).unwrap()
        if (response) {
          dispatch(setUserLoginData(response))
          formikHelpers.resetForm()
          localStorage.removeItem('openMenu')
          // If the user was redirected to login from a protected page, go back there after login
          // if (fromPath) {
          //   navigate(fromPath)
          // } else
          if (response.user_role === 'ADMIN') {
            const path = await getAdminPostLoginPath(dispatch)
            navigate(path)
          } else {
            const path = getRoleDashboardPath(response.user_role)
            if (path) navigate(path)
          }
        }
      } catch (error) {
        showErrorToast('Login failed. Please try again.')
        // Optional: show error toast
      }
    },
    [dispatch, login, navigate]
  )

  // Formik configuration
  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  })

  // Get image based on current auth mode

  return (
    <>
      {isLoading && <Spinner />}
      <Container
        fluid
        className="d-flex align-items-center justify-content-center bg-light p-0"
      >
        <Row
          className="w-100 shadow-lg flex-column flex-md-row m-0"
          style={{ minHeight: '100vh' }}
        >
          {/* Left */}
          <Col xs={12} sm={12} md={7} lg={7} className="p-0 position-relative">
            <div className="logo-overlay">
              <div className="d-flex align-items-center justify-content-start">
                <img src={lmsLogo} alt="LMS Logo" className="logo-img" />
                <div className="vr mx-3" />
                <img
                  src={pedp}
                  alt="PEDP Logo"
                  className="logo-img logo-img-pedp"
                />
              </div>
            </div>

            <img src={LoginImg} alt="Background" className="login-image" />

            <div className="login-overlay-text">
              <h5 className="font32 text-white">Welcome to the</h5>
              <h3 className="text-info fw-bold font40">Appraisal System</h3>
              <p className="text-light font20">
                Appraisal Management Platform helps to manage your organization
                appraisal cycle
              </p>
            </div>
          </Col>

          {/* Right */}
          <Col
            sm={12}
            xs={12}
            md={5}
            lg={5}
            className="d-flex flex-column justify-content-center align-items-center p-0 position-relative"
          >
            <div className="w-75 p-4">
              <h4 className="mb-3 textDark font24 fontW700">Login</h4>
              <p className="mb-4 textLight font14">
                Enter credentials to access your account
              </p>

              <Form onSubmit={loginFormik.handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="font14 textDark">Email Id</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Please enter email id"
                    className="custom-form-control"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    isInvalid={
                      loginFormik.touched.email && !!loginFormik.errors.email
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {loginFormik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId="formPassword"
                  className="mb-4 position-relative"
                >
                  <Form.Label className="font14 textDark">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      autoComplete="off"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Please enter password"
                      className="custom-form-control"
                      value={loginFormik.values.password}
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      isInvalid={
                        loginFormik.touched.password &&
                        !!loginFormik.errors.password
                      }
                      style={{ paddingRight: '48px' }}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '40px',
                        cursor: 'pointer',
                        color: '#999',
                        display: 'flex',
                        justifyContent: 'end',
                        zIndex: 2,
                      }}
                    >
                      {!loginFormik.errors.password && (
                        <img src={Hide} alt="Hide" />
                      )}
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {loginFormik.errors.password}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="info"
                  className="custom-button w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Login' : 'Login'}{' '}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    className="p-0 primaryColor font14 custom-btn-link"
                    onClick={() => navigate('/forgot-password')}
                    style={{ fontSize: '0.9rem' }}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </Form>
            </div>

            <footer
              className="mt-5 text-center loginFooter"
              style={{ fontSize: '0.8rem' }}
            >
              © 2025 LMS Solutions (India) Pvt. Ltd.
            </footer>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Login
