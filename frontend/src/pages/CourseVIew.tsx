import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Play, Clock, Menu, ArrowLeft, CheckCircle2, Star, Loader2, Layers } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCoursesStore } from "@/store/courseStore";
import { useAuthStore } from "@/store/authStore";
import type { Subsection, Section } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/constants/api";

const formatDuration = (seconds: string | number) => {
    const totalSeconds = Math.floor(Number(seconds));
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const CourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { fetchCourseDetails, courseDetails: course, courseDetailsLoading } =
        useCoursesStore();
    const { user, token } = useAuthStore();

    const [currentVideo, setCurrentVideo] = useState<Subsection | null>(null);
    const [completed, setCompleted] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    // Review modal state
    const [reviewOpen, setReviewOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        if (id) fetchCourseDetails(id);
    }, [id, fetchCourseDetails]);

    useEffect(() => {
        if (course && course.courseContent.length > 0) {
            setCurrentVideo(course.courseContent[0].subSections[0]);
        }
    }, [course]);

    const handleSelectLesson = (sub: Subsection) => {
        setCurrentVideo(sub);
        if (!completed.includes(sub._id)) {
            setCompleted((prev) => [...prev, sub._id]);
        }
        if (open) setOpen(false);
    };

    const SidebarContent = () => {
        if (!course) return null;

        return (
            <div className="h-full flex flex-col bg-[#050816] text-gray-100 border-r border-white/5">
                <div className="p-6 border-b border-white/5">
                    <button
                        onClick={() => navigate("/dashboard/enrolled-courses")}
                        className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all mb-8"
                    >
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Back to Courses</span>
                    </button>

                    <div className="space-y-1">
                        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Course Curriculum</span>
                        <h2 className="text-xl font-black leading-tight line-clamp-2">{course.courseName}</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {course.courseContent.map((section: Section, sectionIdx: number) => (
                            <AccordionItem
                                key={section._id}
                                value={section._id}
                                className="border-0"
                            >
                                <AccordionTrigger className="px-4 py-3 rounded-2xl bg-white/2 hover:bg-white/5 hover:no-underline transition-all group">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-xs">
                                            {String(sectionIdx + 1).padStart(2, '0')}
                                        </div>
                                        <span className="text-sm font-bold opacity-80 group-data-[state=open]:opacity-100">{section.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 px-1">
                                    <div className="space-y-1">
                                        {section.subSections.map((sub: Subsection) => (
                                            <div
                                                key={sub._id}
                                                onClick={() => handleSelectLesson(sub)}
                                                className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${currentVideo?._id === sub._id
                                                    ? "bg-blue-600 shadow-[0_10px_20px_rgba(37,99,235,0.3)] text-white"
                                                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {completed.includes(sub._id) ? (
                                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                            <CheckCircle2 size={12} className="text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentVideo?._id === sub._id ? "bg-white/20" : "bg-white/5"}`}>
                                                            <Play size={10} />
                                                        </div>
                                                    )}
                                                    <span className="text-xs font-bold leading-none">{sub.title}</span>
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] font-black opacity-60 tabular-nums">
                                                    {formatDuration(sub.timeDuration)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="p-6 border-t border-white/5 bg-gradient-to-t from-blue-600/5 to-transparent">
                    <Button
                        onClick={() => setReviewOpen(true)}
                        className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02]"
                    >
                        Share Feedback
                    </Button>
                </div>
            </div>
        );
    };

    const handleSaveReview = async () => {
        setReviewLoading(true);

        try {
            const res = await axios.post(`${API_URL}/rating-review/add`, { review: reviewText, rating: rating, courseId: id }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.data.success) {
                toast.success(res.data.message || "Rating and Review created successfully");
                setRating(0);
                setReviewText("");
                setReviewOpen(false);
            }
        } catch (error: any) {
            console.log("Error in saveReview", error);
            toast.error(error.response.data.message || "Failed to add the rating and review");
        } finally {
            setReviewLoading(false);
        }

    };

    if (courseDetailsLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-300">
                Loading course...
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-300">
                No course found
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050816] text-gray-100 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-80 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay Trigger */}
            <div className="md:hidden fixed top-6 left-6 z-50">
                <Button
                    size="icon"
                    onClick={() => setOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white shadow-2xl backdrop-blur-md hover:bg-white/10 transition-all"
                >
                    <Menu size={20} />
                </Button>
            </div>

            {/* Mobile Sidebar Component */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="p-0 border-r border-white/5 w-80 bg-[#050816] text-white">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#080b1a] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -z-10" />

                <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-10">
                        {/* Video Container */}
                        <div className="group relative glass rounded-[2.5rem] border-white/5 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                            <div className="aspect-video">
                                <video
                                    key={currentVideo?._id}
                                    src={currentVideo?.videoUrl}
                                    controls
                                    className="w-full h-full object-cover bg-black"
                                />
                            </div>
                        </div>

                        {/* Video Info Header */}
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                        Module 0{course.courseContent.findIndex(s => s.subSections.some(sub => sub._id === currentVideo?._id)) + 1}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">In Progress</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                                    {currentVideo?.title}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-white/10 rounded-xl">
                                        <AvatarImage src={course.instructor.image} />
                                        <AvatarFallback className="bg-blue-600 text-[10px] font-black">{course.instructor.firstname[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Instructor</span>
                                        <span className="text-sm font-black text-white">{course.instructor.firstname} {course.instructor.lastname}</span>
                                    </div>
                                </div>

                                <div className="h-8 w-px bg-white/5 hidden sm:block" />

                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Clock size={16} className="text-blue-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Duration</span>
                                        <span className="text-sm font-black text-white">{formatDuration(currentVideo?.timeDuration || 0)}</span>
                                    </div>
                                </div>

                                <div className="h-8 w-px bg-white/5 hidden sm:block" />

                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Layers size={16} className="text-purple-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Language</span>
                                        <span className="text-sm font-black text-white">{course.language}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black">Video Description</h3>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
                                    {currentVideo?.description || "No description available for this lesson."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Review Dialog */}
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogContent className="glass-dark text-white max-w-md border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black tracking-tight text-center">Share Your Feedback</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-8">
                        {/* User Info */}
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <Avatar className="h-14 w-14 rounded-xl border border-white/10">
                                <AvatarImage src={user?.image} />
                                <AvatarFallback className="bg-blue-600 font-black text-lg">{user?.firstname[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-black text-lg leading-tight">{user?.firstname} {user?.lastname}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Public review</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Course Rating</Label>
                            <div className="flex justify-center gap-4 py-4 bg-white/2 rounded-2xl border border-white/5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={32}
                                        onClick={() => setRating(star)}
                                        className={`cursor-pointer transition-all duration-300 hover:scale-110 ${star <= rating ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-gray-700 hover:text-gray-500"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Review Input */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Your Experience</Label>
                            <Textarea
                                placeholder="What did you think of the course quality and content?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="min-h-[120px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 transition-all text-base p-4"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-10 grid grid-cols-2 gap-4 sm:flex-none">
                        <Button
                            onClick={() => setReviewOpen(false)}
                            className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveReview}
                            disabled={reviewLoading}
                            className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all"
                        >
                            {reviewLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Post Review"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseView;
