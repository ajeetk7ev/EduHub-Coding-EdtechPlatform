import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Search,
    Trash2,
    Eye,
    Plus,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Database,
    Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { API_URL } from '@/constants/api'
import { toast } from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'

interface Course {
    _id: string
    courseName: string
    instructor: {
        firstname: string
        lastname: string
    }
    category: {
        name: string
    }
    studentsEnrolled: string[]
    price: number
    totalRevenue: number
    status: string
}

interface PaginationData {
    totalCourses: number;
    currentPage: number;
    totalPages: number;
}

const CourseManagement = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [isSeeding, setIsSeeding] = useState(false)

    const fetchCourses = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')?.replace(/"/g, '')
            const res = await axios.get(`${API_URL}/admin/courses?page=${page}&limit=10&search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                setCourses(res.data.courses)
                setPagination(res.data.pagination)
            }
        } catch (error) {
            console.error('Error fetching admin courses:', error)
            toast.error('Failed to load courses')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(fetchCourses, 500)
        return () => clearTimeout(timeout)
    }, [page, search])

    const handleDelete = async (courseId: string) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return

        try {
            const token = localStorage.getItem('token')?.replace(/"/g, '')
            const res = await axios.delete(`${API_URL}/admin/course/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                toast.success('Course deleted successfully')
                fetchCourses()
            }
        } catch (error) {
            console.error('Error deleting course:', error)
            toast.error('Failed to delete course')
        }
    }

    const handleSeed = async () => {
        try {
            setIsSeeding(true)
            const token = localStorage.getItem('token')?.replace(/"/g, '')
            const res = await axios.post(`${API_URL}/admin/seed`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                toast.success('Mock data seeded successfully!')
                fetchCourses()
            }
        } catch (error) {
            console.error('Seed error:', error)
            toast.error('Failed to seed data')
        } finally {
            setIsSeeding(false)
        }
    }

    return (
        <div className='p-6 min-h-screen'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <div>
                    <h1 className='text-3xl font-black text-white'>Course Management</h1>
                    <p className='text-gray-400 mt-1'>Monitor and manage platform content</p>
                </div>
                <div className='flex gap-3'>
                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className='flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50'
                    >
                        {isSeeding ? <Loader2 className='w-5 h-5 animate-spin' /> : <Database className='w-5 h-5' />}
                        Generate Mock Data
                    </button>
                    <Link
                        to="/dashboard/add-course"
                        className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-1'
                    >
                        <Plus className='w-5 h-5' />
                        Add Course
                    </Link>
                </div>
            </div>

            {/* Search & Stats Section */}
            <div className='glass p-6 rounded-[2.5rem] border-white/10 mb-8'>
                <div className='relative max-w-md'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' size={20} />
                    <input
                        type="text"
                        placeholder="Search by course or instructor..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className='w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all'
                    />
                </div>
            </div>

            {/* Course Table */}
            <div className='glass rounded-[2.5rem] border-white/10 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='border-b border-white/10 bg-white/5'>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider'>Course</th>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider'>Instructor</th>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider'>Category</th>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-center'>Students</th>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider'>Price</th>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider'>Status</th>
                                <th className='p-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-right'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className='border-b border-white/5'>
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className='p-6'><Skeleton className='h-6 w-full' /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className='p-12 text-center text-gray-500'>
                                        <div className='flex flex-col items-center gap-3'>
                                            <AlertCircle size={48} className='opacity-20' />
                                            <p className='text-xl font-bold'>No courses found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {courses.map((course) => (
                                        <motion.tr
                                            key={course._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className='border-b border-white/5 hover:bg-white/[0.02] transition-colors group'
                                        >
                                            <td className='p-6'>
                                                <div className='font-bold text-white group-hover:text-blue-400 transition-colors'>
                                                    {course.courseName}
                                                </div>
                                            </td>
                                            <td className='p-6 text-gray-300'>
                                                {course.instructor?.firstname} {course.instructor?.lastname}
                                            </td>
                                            <td className='p-6'>
                                                <span className='px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20'>
                                                    {course.category?.name}
                                                </span>
                                            </td>
                                            <td className='p-6 text-center text-gray-300 font-bold'>
                                                {course.studentsEnrolled?.length || 0}
                                            </td>
                                            <td className='p-6 text-white font-bold'>
                                                ₹{course.price.toLocaleString()}
                                            </td>
                                            <td className='p-6'>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${course.status === 'Published'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className='p-6 text-right'>
                                                <div className='flex justify-end gap-2'>
                                                    <Link
                                                        to={`/course/${course._id}`}
                                                        className='p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all'
                                                        title="View Course"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className='p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all'
                                                        title="Delete Course"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className='p-6 flex justify-between items-center border-t border-white/5 bg-white/[0.01]'>
                        <p className='text-sm text-gray-500'>
                            Showing page <span className='text-white font-bold'>{pagination.currentPage}</span> of <span className='text-white font-bold'>{pagination.totalPages}</span>
                        </p>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className='p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl disabled:opacity-20 transition-all'
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className='p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl disabled:opacity-20 transition-all'
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CourseManagement
