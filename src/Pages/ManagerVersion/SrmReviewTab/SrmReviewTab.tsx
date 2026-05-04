import { useState } from 'react'

import { Card, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import SharedButton from '@project/Components/Button/SharedButton'
import {
  useAddEmployeeRatingMutation,
  useGetTeamMemberCdpDetailsQuery,
} from '@project/Store/Api/Manager'
import { showErrorToast } from '@project/Utils/notificationPopup'

import IrmpedpForm from '../IrmPedpTab/SrmpedpForm/SrmpedpForm'

import './SrmReviewTab.scss'

export default function SrmReviewTab({
  onPreview,
}: {
  onPreview?: () => void
}) {
  const { employee_user_id } = useParams<{ employee_user_id: string }>()
  const { data: getTeamMemberCdpDetails, refetch: refetchDetails } =
    useGetTeamMemberCdpDetailsQuery(employee_user_id!, {
      skip: !employee_user_id,
      refetchOnMountOrArgChange: true,
    })

  const { employee_cdp } = getTeamMemberCdpDetails || {}

  const [remarksByAppraiser, setRemarksByAppraiser] = useState(
    getTeamMemberCdpDetails?.appraiser_remarks || ''
  )

  const [addEmployeeRating] = useAddEmployeeRatingMutation()

  const navigate = useNavigate()

  const handleSave = async (formStatus: 'Draft' | 'Reviewed') => {
    const payload = {
      pedp_form_id: getTeamMemberCdpDetails?.pedp_form_id,
      employee_user_id: employee_user_id!,
      appraiser_remarks: remarksByAppraiser,
      form_status: formStatus,
    }
    try {
      await addEmployeeRating(payload).unwrap()
      refetchDetails()
    } catch (err) {
      const message = 'Something went wrong while publishing PEDP'
      showErrorToast(message)
    }
  }

  return (
    <div className="srm-review-tab">
      <div className="srm-review-content">
        <h3>Review SRM Details</h3>
        <p>Please review the details of the SRM before submission.</p>
        <Card className="cdpCard irmpedpCardBorder irmPedpCard p-0 mb-4">
          <div className="lightBlueBg p-4">
            <p className="mb-0 ">Career development plan (CDP)</p>
          </div>
          <div className="p-4">
            <p className="mb-1 font14 textLight">
              Strengths, Developmental & Training Needs
            </p>
            The Appraiser assesses the Appraisee's strengths that contribute to
            job performance and identifies areas for improvement. Additionally,
            relevant training, certifications, or educational programs are
            recommended to enhance professional growth and equip the Appraisee
            with essential skills for successful task execution. Based on these
            needs, a mandatory 32-hour Career Development Plan will be designed,
            including at least 20 hours of technical training and 12 hours of
            soft skills training, providing a clear pathway for career
            progression.
          </div>
          <div className="irmPedpForm p-4">
            <IrmpedpForm
              employee_user_id={employee_user_id ?? ''}
              pedp_form_id={getTeamMemberCdpDetails?.pedp_form_id}
              refetchDetails={refetchDetails}
              existingCdp={employee_cdp}
            />
          </div>
        </Card>
      </div>

      {/* Competency description  */}
      <Card className="competencyDescriptionCard  irmpedpCardBorder p-0 mb-4">
        <div className="lightBlueBg p-4">
          <p className="mb-0 ">Remarks by SRM</p>
        </div>
        <div className="p-4">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Please Write"
            value={remarksByAppraiser}
            disabled={getTeamMemberCdpDetails?.form_status === 'Reviewed'}
            onChange={(e) => {
              setRemarksByAppraiser(e.target.value)
            }}
            style={{ border: '1px solid var(--border)' }}
          />
        </div>
      </Card>

      <div
        className="d-flex justify-content-start mt-4 "
        style={{ position: 'absolute', bottom: '24px', gap: '24px' }}
      >
        <SharedButton
          label="Close"
          variant="outline"
          onClick={() => navigate('/irm/irm-dashboard')}
        />
        <SharedButton
          label="Previous"
          variant="outline"
          onClick={() => {
            if (onPreview) onPreview()
          }}
        />
        <SharedButton
          label="Save as draft"
          variant="outline"
          onClick={() => handleSave('Draft')}
        />

        <SharedButton
          label="Submit"
          variant="outline"
          onClick={() => handleSave('Reviewed')}
        />
      </div>
    </div>
  )
}
