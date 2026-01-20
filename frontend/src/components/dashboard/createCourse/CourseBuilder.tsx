import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Upload,
    PlusCircle,
    Heading,
    Loader2,
    Play,
    Trash2,
    ChevronDown,
    Layout,
    Video
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

type Subsection = {
    id: string;
    title: string;
    description: string;
    videoUrl?: string;
};

type Section = {
    id: string;
    title: string;
    subsections: Subsection[];
};

interface CourseBuilderProps {
    courseId: string;
    onClose?: () => void;
}

export default function CourseBuilder({ courseId, onClose }: CourseBuilderProps) {
    const { token } = useAuthStore();
    const [sections, setSections] = useState<Section[]>([]);
    const [sectionTitle, setSectionTitle] = useState("");
    const [addSectionLoading, setAddSectionLoading] = useState(false);

    const addSection = async () => {
        if (!sectionTitle.trim()) {
            toast.error("Section Title is required");
            return;
        }
        setAddSectionLoading(true);
        try {
            const res = await axios.post(`${API_URL}/section`, {
                title: sectionTitle,
                courseId: courseId,
            }, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.data.success) {
                const { section, message } = res.data;
                setSections([
                    ...sections,
                    { id: section.id, title: section.title, subsections: [] },
                ]);
                setSectionTitle("");
                toast.success(message || `Section "${sectionTitle}" created`);
            }
        } catch (error: any) {
            console.error("Error in Add Section", error);
            toast.error(error.response?.data?.message || "Failed to add section");
        } finally {
            setAddSectionLoading(false);
        }
    };

    const addSubsection = async (
        sectionId: string,
        title: string,
        description: string,
        video?: File | null
    ) => {
        if (!title.trim() || !description.trim() || !video) {
            toast.error("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("sectionId", sectionId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", video);

        try {
            const res = await axios.post(`${API_URL}/sub-section`, formData, {
                headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
            });

            if (res.data.success) {
                const { subSection, message } = res.data;
                toast.success(message);
                setSections(
                    sections.map((sec) =>
                        sec.id === sectionId
                            ? {
                                ...sec,
                                subsections: [
                                    ...sec.subsections,
                                    {
                                        id: subSection?.id,
                                        title,
                                        description,
                                        videoUrl: subSection?.videoUrl,
                                    },
                                ],
                            }
                            : sec
                    )
                );
            }
        } catch (error: any) {
            console.error("Error in Add Subsection", error);
            toast.error(error.response?.data?.message || "Failed to add subsection");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <Layout size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">Curriculum Builder</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Step 2: Define your course structure</p>
                </div>
            </div>

            {/* Add Section */}
            <div className="flex gap-4 p-2 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
                <Input
                    placeholder="e.g. Introduction to React Fundamentals"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="bg-transparent border-none h-14 focus-visible:ring-0 text-white font-bold placeholder:text-gray-600"
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addSection}
                    disabled={addSectionLoading}
                    className="px-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
                >
                    {addSectionLoading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                    Add Section
                </motion.button>
            </div>

            {/* Render Sections */}
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {sections.map((sec, index) => (
                        <motion.div
                            key={sec.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass rounded-[2.5rem] border border-white/5 overflow-hidden group"
                        >
                            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-black text-xs">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-lg font-black text-white tracking-tight">{sec.title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                    <ChevronDown size={20} className="text-gray-600" />
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Subsection List */}
                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {sec.subsections.map((sub) => (
                                            <motion.div
                                                key={sub.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-all group/sub"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400">
                                                        <Play size={16} fill="currentColor" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white text-sm">{sub.title}</h4>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-xs">{sub.description}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {sub.videoUrl && (
                                                        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                                            <Video size={12} /> Video Attached
                                                        </span>
                                                    )}
                                                    <button className="text-gray-600 hover:text-white transition-all opacity-0 group-hover/sub:opacity-100">
                                                        <Heading size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Add Subsection Form */}
                                <SubsectionForm
                                    onAdd={(t, d, v) => addSubsection(sec.id, t, d, v)}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {sections.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-600">
                            <Layout size={40} />
                        </div>
                        <p className="text-gray-400 font-bold">Your curriculum is looking a bit empty.</p>
                        <p className="text-gray-600 text-xs mt-2 uppercase tracking-widest">Start by adding your first section above</p>
                    </div>
                )}
            </div>

            <div className="pt-10 flex justify-end">
                <motion.button
                    onClick={() => {
                        toast.success("Course published successfully!");
                        if (onClose) onClose();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-600/20 border border-white/10 uppercase tracking-widest text-xs"
                >
                    Finalize & Publish Course
                </motion.button>
            </div>
        </div>
    );
}

function SubsectionForm({ onAdd }: { onAdd: (title: string, desc: string, video?: File | null) => void }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !desc.trim() || !video) {
            toast.error("Please fill all subsection fields");
            return;
        }
        setLoading(true);
        await onAdd(title, desc, video);
        setLoading(false);
        setTitle("");
        setDesc("");
        setVideo(null);
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-widest hover:border-blue-500/50 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2"
            >
                <PlusCircle size={14} /> Add Lesson / Subsection
            </button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white/[0.03] border border-blue-500/20 rounded-3xl space-y-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Lesson Title</label>
                    <Input
                        placeholder="e.g. Setting up the environment"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-blue-500/50 text-white font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                    <Input
                        placeholder="Brief overview of the lesson"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-blue-500/50 text-white font-bold"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Lesson Video</label>
                <label className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group">
                    <Upload className={`w-6 h-6 mb-2 transition-all ${video ? "text-emerald-500" : "text-gray-500 group-hover:text-blue-500"}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {video ? video.name : "Select Video File"}
                    </span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <PlusCircle size={14} />}
                    Save Lesson
                </button>
                <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-white/5 text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                    Cancel
                </button>
            </div>
        </motion.div>
    );
}
