// import { Row, Col, Container } from 'react-bootstrap';
// import './mapping.scss'
// import TableResponsive from '@project/Components/TableResponsive/TableResponsive';
// import { useState } from 'react';
// import TableHeading from '@project/Components/TableHeading/TableHeading';
// import CustomDropdown from '@project/Components/Dropdown/DropDown';
// import DropdownOption from '@project/Utils/dummyApiData';
// import CommonInput from '@project/Common/CommonInput/CommonInput';
// import { FaSearch } from 'react-icons/fa'
// import FilterIcon from '@project/assets/images/Filter.svg'
// import SharedButton from '@project/Components/Button/SharedButton';

// const GoalMapping = () => {
//     const [select, setSelect] = useState<number>(0)
//     const [checkBox, setCheckBox] = useState<boolean>(false)
//     const [search, setSearch] = useState<string>('')

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value)
//     }

//     return (
//         <>
//             <Container fluid>
//                 <Row className="align-items-center mb-4 mt-3">
//                     <Col lg={6} md={12} className="px-0">
//                         <TableHeading heading="List of mapped goals" />
//                     </Col>
//                     <Col lg={6}>
//                         <Row>
//                             <Col lg={4}>
//                                 <CustomDropdown
//                                     id="Select type"
//                                     options={DropdownOption}
//                                     placeholder="Select type"
//                                     append={document.body}
//                                     value={select}
//                                     onChange={(e) => (e: {
//                                         target: { value: number }
//                                     }) => setSelect(e.target.value)
//                                     }
//                                 />
//                             </Col>
//                             <Col lg={4}>
//                                 <CommonInput
//                                     className="common-input"
//                                     placeholder="Search"
//                                     width="100%"
//                                     icon={<FaSearch />}
//                                     value={search}
//                                     onChange={handleSearch}
//                                 />
//                             </Col>
//                             <Col lg={4}>
//                                 <SharedButton
//                                     icon={FilterIcon}
//                                     label="Manage weightage"
//                                     variant="outline"
//                                     onClick={() => console.log('manage weightage')}
//                                     classname="weightageBtn"
//                                 />
//                             </Col>
//                         </Row>
//                     </Col>
//                 </Row>
//             </Container>

//             <div className='userTableMain commonTable'>
//                 <TableResponsive maxHeight="55vh">
//                     <table className="table custom-table">
//                         <thead className="custom-thead">
//                             <tr className="custom-thead-row">
//                                 <th scope="col" className="custom-th font14 font400">
//                                     (All)
//                                     <input
//                                         type='checkbox'
//                                         checked={checkBox}
//                                         onChange={() => setCheckBox(!checkBox)}
//                                         className='checkBox'
//                                     />
//                                 </th>
//                                 <th scope="col" className="custom-th font14 font400">
//                                     <div className="d-flex align-items-center gap-2 ">
//                                         <span className="onest-regular-14">Goal Name</span>
//                                     </div>
//                                 </th>
//                                 <th scope="col" className="custom-th font14 font400">
//                                     <div className="d-flex align-items-center gap-2">
//                                         <span className="onest-regular-14">Goal Type</span>

//                                     </div>
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr className="custom-row">
//                                 <td>
//                                     <input
//                                         type='checkbox'
//                                         checked={checkBox}
//                                         onChange={() => setCheckBox(!checkBox)}
//                                         className='checkBox'
//                                     />
//                                 </td>
//                                 <td className="custom-td font16 font400">
//                                     <p className="mb-0 font16 font400 fontOnest textDark">
//                                         Goal name
//                                     </p>
//                                 </td>
//                                 <td className="custom-td">
//                                     <p className="mb-0 font16 font400 fontOnest textDark">
//                                         test
//                                     </p>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </TableResponsive>
//             </div>
//         </>
//     )
// }

// export default GoalMapping;
