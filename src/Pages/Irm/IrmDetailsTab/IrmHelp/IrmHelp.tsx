import { Accordion, Card, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import RightArrow from '@project/assets/images/RightArrowBlue.svg'

import './IrmHelp.scss'

export default function IrmHelp() {
  const navigate = useNavigate()
  const ratingScales = [
    {
      title: 'Rating scale 5',
      description:
        'Leading performance. Sustained excellent achievement and distinguished performance. Some of the characteristics you might have observed include:',
      points: [
        'Highly sought after by others',
        'Exemplary demonstration of all attributes',
        'Willingly accepts all assigned responsibilities and consistently seeks to accept new responsibilities without requiring additional supervision',
        'Demonstrates an interest and initiative in the development of others',
        'Exhibits extraordinary involvement in practice office activities',
        'Surpasses all planned accomplishments agreed to in Professional Development Plan',
      ],
    },
    {
      title: 'Rating scale 4',
      description:
        'Strong performance. Consistently meets and occasionally exceeds expectations. Demonstrates high levels of achievement and reliability. Some of the characteristics you might have observed include:',
      points: [
        'Sought after for input by others',
        'Demonstrates most attributes at a high level',
        'Accepts and completes responsibilities with minimal supervision',
        'Shows initiative in learning and contributes effectively to team goals',
        'Actively participates in firm and practice activities',
      ],
    },
    {
      title: 'Rating scale 3',
      description:
        'Solid performance. Consistently meets expectations and delivers satisfactory results. Performs effectively with occasional guidance. Some of the characteristics you might have observed include:',
      points: [
        'Performs duties with acceptable quality and timeliness',
        'Demonstrates required attributes for current role',
        'Requires normal supervision and guidance',
        'Contributes to team goals and demonstrates willingness to learn',
      ],
    },
    {
      title: 'Rating scale 2',
      description:
        'Needs improvement. Occasionally meets expectations but requires development in key areas to perform effectively. Some of the characteristics you might have observed include:',
      points: [
        'Inconsistently demonstrates required skills',
        'Requires frequent supervision and direction',
        'Needs improvement in quality, timeliness, or collaboration',
        'Should actively work on development goals to improve performance',
      ],
    },
    {
      title: 'Rating scale 1',
      description:
        'Unsatisfactory performance. Frequently fails to meet expectations despite feedback and coaching. Immediate improvement is required.',
      points: [
        'Performance consistently below expectations',
        'Requires close supervision to complete tasks',
        'Demonstrates limited ownership or accountability',
        'Shows little progress despite feedback or development opportunities',
      ],
    },
  ]

  const scale = [
    {
      rating: 5,
      label: 'Strength to build upon',
      description: 'Exceeds expectations; performs at the next level.',
    },
    {
      rating: 4,
      label: 'Performs well & meets expectations',
      description: 'Meets expected performance for this level.',
    },
    {
      rating: 3,
      label: 'Developmental need',
      description:
        'Falls short in some areas; requires improvement (address in Section 5).',
    },
    {
      rating: 2,
      label: 'Issue',
      description: 'Repeatedly does not meet expectations despite feedback.',
    },
    {
      rating: 1,
      label: 'Not applicable',
      description: 'This competency does not apply to the role.',
    },
  ]

  const handleBackBtn = () => {
    navigate('/irm/irmDetailsTab')
  }
  return (
    <Container fluid className="p-0 irmHelpContainer">
      <button
        onClick={() => handleBackBtn()}
        className="transparentButton mb-3 d-flex align-items-center"
      >
        <img src={ArrowLeft} alt="Back" className="me-2" />
        <span className="font14 font400 fontOnest">Back</span>
      </button>
      {/* ======= First Card ======= */}
      <Card className="customCard irmpedpCardBorder irmPedpCard p-0 mb-4">
        <div className="lightBlueBg p-4">
          <p className="mb-0">Competencies</p>
        </div>
        <div className="CompetenciesWrapper p-4 d-flex flex-column">
          <div>
            <p className="mb-1 font14 textLight">Instructions</p>
            <p className="mb-0">
              The purpose of this appraisal is to evaluate the employee's
              performance over the review period, focusing on the competencies
              relevant to their job role and service line. The evaluator will
              consider the feedback provided by the employee to guide the
              appraisal discussion. We are committed to fostering employee
              development by offering the resources and support needed for
              growth. This assessment will be essential in shaping the
              employee's Development Plan for the next year.
            </p>
          </div>

          <div className="ratingKey pt-4">
            <p className="mb-1 font14 textLight">Rating Key</p>
            <div className="d-flex flex-column gap-2">
              {scale.map(({ rating, label, description }) => (
                <p key={rating} className="mb-0 font16 font400 fontOnest">
                  <span className="primaryColor">{rating}</span>
                  <span> - ({label}): </span>
                  <span className="textLight">{description}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ======= Second Card (with icons) ======= */}
      <Card className="customCard irmpedpCardBorder irmPedpCard p-0 mb-4">
        <div className="lightBlueBg p-4">
          <p className="mb-0">Rating guidelines</p>
        </div>

        <div className="p-4">
          <p className="mt-3">
            An evaluation rating directly translates to an overall year end
            rating. The year end rating also takes into consideration factors
            such as: contribution to firm initiatives, level of commitment to
            the firm, contribution to the practice success, and also considers
            the Team Lead's and Leadership Inputs.
          </p>

          <div className="RatingGuidAccordion mt-4">
            <Accordion alwaysOpen defaultActiveKey="0">
              {ratingScales.map((item, idx) => (
                <Accordion.Item eventKey={idx.toString()} key={item.title}>
                  <Accordion.Header>{item.title}</Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-3">{item.description}</p>
                    <ul className="list-unstyled m-0 px-2">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="d-flex align-items-start mb-2"
                        >
                          <img
                            src={RightArrow}
                            alt="icon"
                            className="me-2 mt-1"
                            width={14}
                            height={14}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </Card>
    </Container>
  )
}
