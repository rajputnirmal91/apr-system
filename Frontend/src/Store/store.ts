import { type Action, combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import sessionStorage from 'redux-persist/es/storage/session'

import AccessPermissionApi from './Api/Admin/AccessPermission/AccessPermissionApi'
import EmployeeEligibilityApi from './Api/Admin/EmployeeEligibility/EmployeeEligibilityApi'
import GoalsAssociationApi from './Api/Admin/GoalsAssociation/GoalsAssociationApi'
import KraApi from './Api/Admin/Kra/kraApi'
import DateApi from './Api/Admin/Masters/Date/dateApi'
import EmailTemplateApi from './Api/Admin/Masters/EmailTemplate/emailTemplateApi'
import GoalsApi from './Api/Admin/Masters/Goals/goalsApi'
import ratingApi from './Api/Admin/Ratings/rating'
import sessionMasterApi from './Api/Admin/SessionMaster/sessionMasterApi'
import commonApi from './Api/Common/commonApi'
import CertificationApi from './Api/Employee/Certification/certificationApi'
import PedpDetailsApi from './Api/Employee/Pedp/PedpDetailsApi'
import ProjectDetailsApi from './Api/Employee/ProjectDetails/ProjectDetailsApi'
import reportsApi from './Api/General/Reports/reports'
import HrDetailsApi from './Api/Hr/HrDetailsApi'
import HrEmailTemplateApi from './Api/Hr/HrEmailTemplateApi'
import HrEmployeeEligibilityApi from './Api/Hr/HrEmployeeEligibilityApi'
import IrmApi from './Api/Irm/IrmApi'
import loginApi from './Api/Login/loginApi'
import managementApi from './Api/Management/managementApi'
import ManagerApi from './Api/Manager/managerApi'
import UnitHeadApi from './Api/UnitHead/UnitHeadApi'
import loadingSlice from './Feature/LoadingSlice/LoadingSlice'
import unsavedChangesGoalsSlice from './Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import UnSavedChangesSlice from './Feature/UnSavedChangesSlice/UnSavedChangesSlice'
import { userSlice } from './Feature/UserSlice'
import globalLoadingMiddleware from './Middleware/globalLoadingMiddleware'

const middlewares = [
  loginApi.middleware,
  KraApi.middleware,
  GoalsApi.middleware,
  DateApi.middleware,
  commonApi.middleware,
  ratingApi.middleware,
  GoalsAssociationApi.middleware,
  reportsApi.middleware,
  EmployeeEligibilityApi.middleware,
  AccessPermissionApi.middleware,
  CertificationApi.middleware,
  PedpDetailsApi.middleware,
  ProjectDetailsApi.middleware,
  ManagerApi.middleware,
  HrDetailsApi.middleware,
  HrEmailTemplateApi.middleware,
  HrEmployeeEligibilityApi.middleware,
  IrmApi.middleware,
  UnitHeadApi.middleware,
  managementApi.middleware,
  EmailTemplateApi.middleware,
  sessionMasterApi.middleware,
]

const rootReducer = combineReducers({
  /** FEATURE SLICES */
  [userSlice.name]: userSlice.reducer,
  [loadingSlice.name]: loadingSlice.reducer,
  [unsavedChangesGoalsSlice.name]: unsavedChangesGoalsSlice.reducer,
  [UnSavedChangesSlice.name]: UnSavedChangesSlice.reducer,

  /** API SLICES */
  [loginApi.reducerPath]: loginApi.reducer,
  [KraApi.reducerPath]: KraApi.reducer,
  [GoalsApi.reducerPath]: GoalsApi.reducer,
  [DateApi.reducerPath]: DateApi.reducer,
  [commonApi.reducerPath]: commonApi.reducer,
  [ratingApi.reducerPath]: ratingApi.reducer,
  [EmailTemplateApi.reducerPath]: EmailTemplateApi.reducer,
  [GoalsAssociationApi.reducerPath]: GoalsAssociationApi.reducer,
  [reportsApi.reducerPath]: reportsApi.reducer,
  [EmployeeEligibilityApi.reducerPath]: EmployeeEligibilityApi.reducer,
  [AccessPermissionApi.reducerPath]: AccessPermissionApi.reducer,
  [CertificationApi.reducerPath]: CertificationApi.reducer,
  [PedpDetailsApi.reducerPath]: PedpDetailsApi.reducer,
  [ProjectDetailsApi.reducerPath]: ProjectDetailsApi.reducer,
  [ManagerApi.reducerPath]: ManagerApi.reducer,
  [HrDetailsApi.reducerPath]: HrDetailsApi.reducer,
  [HrEmailTemplateApi.reducerPath]: HrEmailTemplateApi.reducer,
  [HrEmployeeEligibilityApi.reducerPath]: HrEmployeeEligibilityApi.reducer,
  [IrmApi.reducerPath]: IrmApi.reducer,
  [UnitHeadApi.reducerPath]: UnitHeadApi.reducer,
  [managementApi.reducerPath]: managementApi.reducer,
  [sessionMasterApi.reducerPath]: sessionMasterApi.reducer,
})

const resettableRootReducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: Action
) => {
  if (action.type === 'reset') {
    return rootReducer(undefined, action)
  }

  return rootReducer(state, action)
}

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
}

const persistedReducer = persistReducer(persistConfig, resettableRootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    // Update this to add all actions to ignore serialization

    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(middlewares)
      .concat(globalLoadingMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type UnpersistedRootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)

export default store
