"use client";
import React, { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    X,
    Sparkles,
    IndianRupee,
    Globe,
    Tag,
    ClipboardList,
    Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export interface CourseInfoFormProps {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setCourseId: React.Dispatch<React.SetStateAction<string>>;
}

export default function CourseInfoForm({ setStep, setCourseId }: CourseInfoFormProps) {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [instructions, setInstructions] = useState<string[]>([]);
    const [instructionInput, setInstructionInput] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [status, setStatus] = useState("Draft");
    const [loadingAI, setLoadingAI] = useState(false);
    const [whatYouWillLearnInput, setWhatYouWillLearnInput] = useState("");
    const [createCourseLoading, setCreateCourseLoading] = useState(false);
    const { categories } = useCategoryStore();
    const { token } = useAuthStore();

    const handleAIGenerate = async () => {
        if (!courseName) {
            toast.error("Please enter a course title first");
            return;
        }
        setLoadingAI(true);
        try {
            const res = await axios.post(`${API_URL}/ai/generate-course-content`, { courseTitle: courseName });
            setTags(res.data.tags);
            setCourseDescription(res.data.description);
            setWhatYouWillLearn(res.data.whatYouWillLearn);
            toast.success("Content generated successfully!");
        } catch (error: any) {
            console.log("Error in ai generate", error);
            toast.error(error.response?.data?.message || "Failed to generate content");
        } finally {
            setLoadingAI(false);
        }
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        input: string,
        reset: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault();
            setter((prev) => [...prev, input.trim()]);
            reset("");
        }
    };

    const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter((prev) => prev.filter((item) => item !== value));
    };

    const handleSubmit = async () => {
        if (!courseName || !courseDescription || !language || !price || !category || !thumbnail) {
            toast.error("Please fill all required fields");
            return;
        }

        const courseFormData = new FormData();
        courseFormData.append("courseName", courseName);
        courseFormData.append("courseDescription", courseDescription);
        courseFormData.append("language", language);
        courseFormData.append("price", price);
        courseFormData.append("category", category);
        tags.forEach(tag => courseFormData.append("tags", tag));
        whatYouWillLearn.forEach(point => courseFormData.append("whatYouWillLearn", point));
        instructions.forEach(instruction => courseFormData.append("instructions", instruction));
        courseFormData.append("status", status);
        if (thumbnail) courseFormData.append("thumbnailImage", thumbnail);

        setCreateCourseLoading(true);
        try {
            const res = await axios.post(`${API_URL}/course`, courseFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success("Course initiated successfully!");
                setCourseId(res.data.course._id);
                setStep(2);
            }
        } catch (error: any) {
            console.log("Error in create course", error);
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setCreateCourseLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Column: Basic Info */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ClipboardList className="text-blue-500" size={20} />
                            <h3 className="text-xl font-black text-white">Basic Information</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Course Title *</label>
                            <Input
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                placeholder="e.g. Master Modern React"
                                className="bg-white/5 border-white/5 h-14 rounded-2xl focus:bg-white/[0.08] focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 font-bold"
                            />
                        </div>

                        <div className="space-y-2 relative group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description *</label>
                            <Textarea
                                value={courseDescription}
                                onChange={(e) => setCourseDescription(e.target.value)}
                                placeholder="What is this course about?"
                                className="bg-white/5 border-white/5 min-h-[200px] rounded-3xl focus:bg-white/[0.08] focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 font-bold p-6"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAIGenerate}
                                disabled={loadingAI}
                                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {loadingAI ? "Thinking..." : <><Sparkles size={14} /> AI Assist</>}
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Language *</label>
                            <Select onValueChange={setLanguage} value={language}>
                                <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-blue-500/50 text-white font-bold">
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-gray-400" />
                                        <SelectValue placeholder="Language" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="hindi">Hindi</SelectItem>
                                    <SelectItem value="spanish">Spanish</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category *</label>
                            <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-blue-500/50 text-white font-bold">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Pricing */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="text-purple-500" size={20} />
                            <h3 className="text-xl font-black text-white">Course Media</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Thumbnail *</label>
                            <div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-blue-500/50 transition-all aspect-video bg-white/[0.02]">
                                {thumbnailPreview ? (
                                    <>
                                        <img src={thumbnailPreview} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label className="cursor-pointer bg-white text-[#050816] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
                                                Replace
                                                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-6 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-white font-black text-sm">Upload High-Res Thumbnail</p>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">16:9 Aspect Ratio recommended</p>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <IndianRupee className="text-emerald-500" size={20} />
                            <h3 className="text-xl font-black text-white">Pricing</h3>
                        </div>
                        <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black">₹</div>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="2999"
                                className="bg-white/5 border-white/5 h-16 rounded-2xl pl-10 focus:border-emerald-500/50 text-white font-black text-xl placeholder:text-gray-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Tags Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Tag className="text-amber-500" size={20} />
                        <h3 className="text-xl font-black text-white">Tags & Meta</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {tags.map((tag) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="pl-4 pr-2 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                    >
                                        {tag}
                                        <button onClick={() => removeItem(setTags, tag)} className="hover:text-white p-1">
                                            <X size={12} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setTags, tagInput, setTagInput)}
                            placeholder="React, Frontend, Advanced..."
                            className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-amber-500/50 text-white font-bold"
                        />
                    </div>
                </div>

                {/* Requirements Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="text-blue-500" size={20} />
                        <h3 className="text-xl font-black text-white">Requirements</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {instructions.map((inst) => (
                                    <motion.span
                                        key={inst}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="pl-4 pr-2 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                    >
                                        {inst}
                                        <button onClick={() => removeItem(setInstructions, inst)} className="hover:text-white p-1">
                                            <X size={12} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                        <Input
                            value={instructionInput}
                            onChange={(e) => setInstructionInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setInstructions, instructionInput, setInstructionInput)}
                            placeholder="Basic JavaScript knowledge..."
                            className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-blue-500/50 text-white font-bold"
                        />
                    </div>
                </div>

                {/* What You Will Learn Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-emerald-500" size={20} />
                        <h3 className="text-xl font-black text-white">What You Will Learn</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {whatYouWillLearn.map((point) => (
                                    <motion.span
                                        key={point}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="pl-4 pr-2 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                    >
                                        {point}
                                        <button onClick={() => removeItem(setWhatYouWillLearn, point)} className="hover:text-white p-1">
                                            <X size={12} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                        <Input
                            value={whatYouWillLearnInput}
                            onChange={(e) => setWhatYouWillLearnInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setWhatYouWillLearn, whatYouWillLearnInput, setWhatYouWillLearnInput)}
                            placeholder="e.g. Build real-world projects..."
                            className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-emerald-500/50 text-white font-bold"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4 p-1.5 rounded-2xl bg-white/5 border border-white/5">
                    {(["Draft", "Published"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl
                  ${status === s ? "bg-white text-[#050816] shadow-xl" : "text-gray-500 hover:text-white"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={createCourseLoading}
                    onClick={handleSubmit}
                    className="w-full max-w-md bg-blue-600 text-white font-black py-5 rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 border border-white/10 disabled:opacity-50"
                >
                    {createCourseLoading ? "Initiating Universe..." : "Go to Curriculum Builder"}
                </motion.button>
            </div>
        </div>
    );
}
