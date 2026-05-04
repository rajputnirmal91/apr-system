/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import emailSentAuthImg from '@project/assets/images/emailSentAuthImg.png'
import forgetPasswordImg from '@project/assets/images/forgetPasswordImg.png'
import lmsLogo from '@project/assets/images/lmsLogo.png'
import pedp from '@project/assets/images/pedp.png'
import Spinner from '@project/Common/Spinner'
import { useForgotPasswordMutation } from '@project/Store/Api/Login'
import { showSuccessToast } from '@project/Utils/notificationPopup'

import './Auth.scss'

// Validation schema
const forgotPasswordSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
})

function ForgetPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { email: sentEmail || '' },
    enableReinitialize: true,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        const cleanedEmail = values.email.trim()
        const response = await forgotPassword({ email: cleanedEmail }).unwrap()
        console.log('Forgot password response:', response)

        showSuccessToast(response.message)
        setIsEmailSent(true)
        setSentEmail(cleanedEmail)
      } catch (error) {
        console.error('Forgot password failed:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Cleaned button text logic
  let buttonText = 'Reset Password'
  if (isSubmitting) {
    buttonText = 'Sending...'
  } else if (isEmailSent) {
    buttonText = 'Resend'
  }

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
              src={isEmailSent ? emailSentAuthImg : forgetPasswordImg}
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
              <h4 className="mb-1 textDark font24 fontW700">
                {isEmailSent ? 'Check your email' : 'Forgot Password?'}
              </h4>
              <p className="textLight">
                {isEmailSent
                  ? ' We sent a password reset link to.'
                  : 'No worries, well send you reset instructions.'}
              </p>

              <p
                className={
                  isEmailSent
                    ? `mb-4 textLight font14 sucessColor`
                    : `mb-4 textLight font14`
                }
              >
                {isEmailSent &&
                  `Reset password link has been sent to ${sentEmail}`}
              </p>

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="forgotEmail" className="mb-4">
                  <Form.Label>Email Id</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="custom-form-control"
                    placeholder="Please enter email id"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="info"
                  className="w-100 mb-3 custom-button"
                  disabled={isSubmitting}
                >
                  {buttonText}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => navigate('/')}
                    className="p-0 primaryColor font14 custom-btn-link"
                  >
                    Back to login
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

export default ForgetPassword
