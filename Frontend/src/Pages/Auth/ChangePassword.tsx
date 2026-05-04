/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import changePaasswordAuthImg from '@project/assets/images/changePasswordAuthImg.png'
import Hide from '@project/assets/images/Hide.png'
import lmsLogo from '@project/assets/images/lmsLogo.png'
import pedp from '@project/assets/images/pedp.png'
import Spinner from '@project/Common/Spinner'
import { useResetPasswordMutation } from '@project/Store/Api/Login'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'

import './Auth.scss'

// Validation schema
const changePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
})

function ChangePassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = useParams<{ token?: string }>()
  const tokenFromQuery = searchParams.get('token')
  const tokenFromParams = params.token
  const token = tokenFromQuery ?? tokenFromParams

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const formik = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      if (!token) {
        showErrorToast(
          'Reset token missing. Please use the link from your email or request a new password reset.'
        )
        return
      }

      try {
        const payload = {
          token,
          new_password: values.newPassword,
        }

        const response = await resetPassword(payload).unwrap()
        showSuccessToast(
          response?.message ?? 'Password reset successfully. Please login.'
        )
        navigate('/')
      } catch (err: any) {
        const errMsg =
          err?.data?.message ??
          err?.data?.error ??
          err?.message ??
          'Failed to reset password. Please try again.'
        showErrorToast(errMsg)
      }
    },
  })

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

            <img
              src={changePaasswordAuthImg}
              alt="Background"
              className="login-image"
            />

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
              <h4 className="mb-3 textDark font24 fontW700">
                Set New Password
              </h4>
              <p className="mb-4 textLight font14">
                Please enter your new password below.
              </p>

              <Form onSubmit={formik.handleSubmit}>
                {/* New Password */}
                <Form.Group
                  controlId="newPassword"
                  className="mb-3"
                  style={{ position: 'relative' }}
                >
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    className="custom-form-control"
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.newPassword && !!formik.errors.newPassword
                    }
                  />
                  <span
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#999',
                    }}
                  >
                    <img src={Hide} alt={showNewPassword ? 'Hide' : 'Show'} />
                  </span>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group
                  controlId="confirmPassword"
                  className="mb-4"
                  style={{ position: 'relative' }}
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    className="custom-form-control"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.confirmPassword &&
                      !!formik.errors.confirmPassword
                    }
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#999',
                    }}
                  >
                    <img
                      src={Hide}
                      alt={showConfirmPassword ? 'Hide' : 'Show'}
                    />
                  </span>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="info"
                  className="w-100 mb-3 custom-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => navigate('/')}
                    className="p-0 primaryColor font14 custom-btn-link"
                  >
                    Back to Login
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

export default ChangePassword
