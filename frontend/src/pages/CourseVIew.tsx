import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
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
import { Play, Clock, Menu, ArrowLeft, CheckCircle2, Star, Loader2 } from "lucide-react";
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
            <div className="h-full flex flex-col bg-[#111827] text-gray-100">
               <div className="w-full hidden sm:flex items-center justify-center mt-5">
                 <Button
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 text-sm rounded-md w-[80%]"
                >
                    <ArrowLeft size={16} /> Go Back
                </Button>
               </div>
                <div className="p-4  overflow-y-auto flex-1 space-y-4">
                    <h2 className="text-lg font-bold">{course.courseName}</h2>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {course.courseContent.map((section: Section) => (
                            <AccordionItem
                                key={section._id}
                                value={section._id}
                                className="border border-gray-800 rounded-lg overflow-hidden"
                            >
                                <AccordionTrigger className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200">
                                    {section.title}
                                </AccordionTrigger>
                                <AccordionContent className="bg-[#1f2937] px-2 py-3">
                                    <ul className="space-y-2">
                                        {section.subSections.map((sub: Subsection) => (
                                            <li
                                                key={sub._id}
                                                onClick={() => handleSelectLesson(sub)}
                                                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition ${currentVideo?._id === sub._id
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-700 text-gray-300"
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2 text-sm">
                                                    {completed.includes(sub._id) ? (
                                                        <CheckCircle2
                                                            size={16}
                                                            className="text-green-400"
                                                        />
                                                    ) : (
                                                        <Play size={14} />
                                                    )}
                                                    {sub.title}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs opacity-80">
                                                    <Clock size={12} />{" "}
                                                    {formatDuration(sub.timeDuration)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Add Review Button */}
                <Button
                    onClick={() => setReviewOpen(true)}
                    className="bg-amber-400 hover:bg-amber-500 rounded-md w-[250px] self-center fixed bottom-10 font-semibold "
                >
                    Add Review
                </Button>
            </div>
        );
    };

    const handleSaveReview = async () => {
        console.log("Review Submitted:", { rating, reviewText });

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
        <div className="flex min-h-screen bg-[#0f172a] text-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-80 border-r border-gray-800 shadow-lg">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="md:hidden fixed top-5 left-5 z-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg p-2"
                    >
                        <Menu size={22} />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 bg-gray-900 text-white">
                    <SheetHeader>
                        <SheetTitle>
                            <Button
                                onClick={() => navigate("/dashboard/enrolled-courses")}
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 text-sm rounded-md w-fit"
                            >
                                <ArrowLeft size={16} /> Go Back
                            </Button>
                        </SheetTitle>
                    </SheetHeader>
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-8 space-y-6">
                <Card className="shadow-lg border border-gray-800 bg-gray-900 rounded-xl overflow-hidden">
                    <video
                        key={currentVideo?._id}
                        src={currentVideo?.videoUrl}
                        controls
                        className="w-full h-[260px] sm:h-[380px] md:h-[460px] bg-black"
                    />
                    <CardContent className="p-5 space-y-3">
                        <h2 className="text-xl md:text-2xl font-semibold text-white">
                            {currentVideo?.title}
                        </h2>
                        <p className="text-gray-400">{currentVideo?.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Clock size={14} />{" "}
                                {formatDuration(currentVideo?.timeDuration || 0)}
                            </span>
                            <span>Instructor: {course.instructor.firstname}</span>
                            <span>Language: {course.language}</span>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Review Dialog */}
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogContent className="bg-[#111827] text-white max-w-md">
                    <DialogHeader >
                        <DialogTitle>Add Review</DialogTitle>
                    </DialogHeader>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mt-2 mx-auto">
                        <Avatar>
                            <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="font-semibold">
                                {user?.firstname} {user?.lastname}
                            </p>
                            <p className="text-sm text-gray-400">Posting Publicly</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-2 mt-4 mx-auto">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={28}
                                onClick={() => setRating(star)}
                                className={`cursor-pointer ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Review Input */}
                    <div>
                        <Label>Add Your Experience<span className="text-red-400">*</span></Label>
                        <Textarea
                            placeholder="Share details of your own experience for this course"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="mt-4 bg-gray-800 text-gray-200 border-gray-700"
                        />
                    </div>

                    {/* Actions */}
                    <DialogFooter className="mt-4 flex justify-end gap-3">
                        <Button

                            onClick={() => setReviewOpen(false)}
                            className="bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveReview}
                            disabled={reviewLoading}
                            className="bg-amber-400 hover:bg-amber-500 text-black font-semibold flex items-center gap-2"
                        >
                            {reviewLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Edits"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseView;
