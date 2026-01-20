

import './App.css'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/Forgot-password'
import UpdatePassword from './pages/UpdatePassword'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import MyProfile from './components/dashboard/MyProfile'
import Settings from './components/dashboard/Setting'
import { useCategoryStore } from './store/categoryStore'
import CreateCourse from './components/dashboard/createCourse/CreateCourse'
import MyCoursesPage from './components/dashboard/myCourse/MyCourse'
import { useCoursesStore } from './store/courseStore'
import CourseDetails from './pages/Course'
import StudentEnrolledCourses from './pages/StudentEnrolledCourses'
import CourseView from './pages/CourseVIew'
import NotFoundPage from './pages/NotFound'
import OpenRoute from './components/auth/OpenRoute'
import PrivateRoute from './components/auth/PrivateRoute'
import AboutPage from './pages/AboutUs'
import ContactUsPage from './pages/ContactUs'
import AllCourses from './pages/AllCourses'
import ColdStartNotice from './components/header/ColdStartNotice'
import InstructorAnalytics from './components/dashboard/instructor/InstructorAnalytics'
import AdminDashboard from './components/dashboard/admin/AdminDashboard'
import UserManagement from './components/dashboard/admin/UserManagement'
import CourseManagement from './components/dashboard/admin/CourseManagement'
import TestPayment from './pages/TestPayment'
import StudentRoute from './components/auth/StudentRoute'
import InstructorRoute from './components/auth/InstructorRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {

  const { loadUser } = useAuthStore();
  const { fetchAllCategories } = useCategoryStore();
  const { fetchAllCourses } = useCoursesStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllCourses();
  }, []);
  return (
    <div>

      <ColdStartNotice />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactUsPage />} />
        <Route path='/signup' element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path='/login' element={<OpenRoute><Login /></OpenRoute>} />
        <Route path='/forgot-password' element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path='/reset-password/:id' element={<OpenRoute><UpdatePassword /></OpenRoute>} />
        <Route path='/courses' element={<AllCourses />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/test-payment/:courseId' element={<PrivateRoute><TestPayment /></PrivateRoute>} />
        <Route path='/course/:id/content' element={<CourseView />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route path='/dashboard/my-profile' index element={<MyProfile />} />
          <Route path='/dashboard/settings' element={<Settings />} />

          {/* Student Routes */}
          <Route path='/dashboard/enrolled-courses' element={<StudentRoute><StudentEnrolledCourses /></StudentRoute>} />

          {/* Instructor Routes */}
          <Route path='/dashboard/add-course' element={<InstructorRoute><CreateCourse /></InstructorRoute>} />
          <Route path='/dashboard/my-courses' element={<InstructorRoute><MyCoursesPage /></InstructorRoute>} />
          <Route path='/dashboard/instructor/analytics' element={<InstructorRoute><InstructorAnalytics /></InstructorRoute>} />

          {/* Admin Routes */}
          <Route path='/dashboard/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path='/dashboard/admin/users' element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path='/dashboard/admin/courses' element={<AdminRoute><CourseManagement /></AdminRoute>} />
        </Route>
      </Routes>

    </div>
  )
}

export default App
