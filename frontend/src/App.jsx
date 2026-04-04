import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import AuthModal from './components/auth/AuthModal'
import GlobalJobSearch from './components/GlobalJobSearch'

const Layout = ({ children }) => (
  <>
    {children}
    <AuthModal />
  </>
);

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>
  },
  {
    path: "/jobs",
    element: <Layout><Jobs /></Layout>
  },
  {
    path: "/description/:id",
    element: <Layout><JobDescription /></Layout>
  },
  {
    path: "/browse",
    element: <Layout><Browse /></Layout>
  },
  {
    path: "/profile",
    element: <Layout><Profile /></Layout>
  },
  {
    path: "/global-search",
    element: <Layout><GlobalJobSearch /></Layout>
  },
  {
    path: "/forgot-password",
    element: <Layout><ForgotPassword /></Layout>
  },
  {
    path: "/reset-password/:token",
    element: <Layout><ResetPassword /></Layout>
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Layout><Companies/></Layout></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><Layout><CompanyCreate/></Layout></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><Layout><CompanySetup/></Layout></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><Layout><AdminJobs/></Layout></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><Layout><PostJob/></Layout></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Layout><Applicants/></Layout></ProtectedRoute> 
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
