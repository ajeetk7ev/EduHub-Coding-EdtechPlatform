

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
import { ACCOUNT_TYPE } from './constants/role'
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

function App() {

  const {loadUser, user} = useAuthStore();
  const { fetchAllCategories } = useCategoryStore();
  const {fetchAllCourses} = useCoursesStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllCourses();
  }, []);
  return (
    <div>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/contact' element={<ContactUsPage/>} />
        <Route path='/signup' element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path='/login' element={<OpenRoute><Login /></OpenRoute>} />
        <Route path='/forgot-password' element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path='/reset-password/:id' element={<OpenRoute><UpdatePassword /></OpenRoute>} />
        <Route path='/course/:id' element={<CourseDetails/>} />
        <Route path='/course/:id/content' element={<CourseView/>} />
        <Route path='*' element={<NotFoundPage/>} />
        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route path='/dashboard/my-profile' index element={<MyProfile />} />
          <Route path='/dashboard/settings' element={<Settings />} />

          {user?.role === ACCOUNT_TYPE.STUDENT && 
            <>
            <Route path='/dashboard/enrolled-courses' element={<StudentEnrolledCourses/>} />
            </>
          }
         
          {user?.role === ACCOUNT_TYPE.INSTRUCTOR &&
           <>
           <Route path='/dashboard/add-course' element={<CreateCourse />} />
           <Route path='/dashboard/my-courses' element={<MyCoursesPage />} />
           </>
           }
        </Route>
      </Routes>

    </div>
  )
}

export default App
