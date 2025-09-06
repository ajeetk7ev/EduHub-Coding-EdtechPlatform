import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Upload,
    PlusCircle,
    Video,
    FileText,
    Heading,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";

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
}

export default function CourseBuilder({ courseId }: CourseBuilderProps) {
    const { token } = useAuthStore();
    const [sections, setSections] = useState<Section[]>([]);
    const [sectionTitle, setSectionTitle] = useState("");
    const [addSectionLoading, setAddSectionLoading] = useState(false);

    // ✅ Add Section API
    const addSection = async () => {
        if (!sectionTitle.trim()) {
            toast.error("Section Title is required");
            return;
        }
        setAddSectionLoading(true);
        try {
            const res = await axios.post(`${API_URL}/section`, {
                title: sectionTitle,
                courseId: "68b1c84dad4ceb4cff8ce7c9",
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.data.success) {
                const { section, message } = res.data;
                setSections([
                    ...sections,
                    { id: section.id, title: section.title, subsections: [] },
                ]);
                setSectionTitle("");
                toast.success(message || `Section ${sectionTitle} created`);
            }
        } catch (error: any) {
            console.error("Error in Add Section", error);
            toast.error(error.response?.data?.message || "Failed to add section");
        } finally {
            setAddSectionLoading(false);
        }
    };

    // ✅ Add Subsection API
    const addSubsection = async (
        sectionId: string,
        title: string,
        description: string,
        video?: File | null
    ) => {
        if (!title.trim() || !description.trim() || !video) {
            toast.error("All fields are required for a subsection");
            return;
        }

        console.log("PRINTING DATA ", sectionId, title, description, video);

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

                // Append new subsection locally (optimistic update)
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
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">📚 Course Builder</h1>

            {/* Add Section */}
            <div className="flex gap-2">
                <Input
                    placeholder="Enter section title"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="bg-gray-700 border border-gray-800 text-white placeholder:text-gray-400"
                />
                <Button
                    onClick={addSection}
                    disabled={addSectionLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                >
                    {addSectionLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Section
                        </>
                    )}
                </Button>
            </div>

            {/* Render Sections */}
            <div className="space-y-4">
                {sections.map((sec) => (
                    <Card
                        key={sec.id}
                        className="p-4 bg-gray-900 border border-gray-700"
                    >
                        <h2 className="text-lg font-semibold text-yellow-400">
                            {sec.title}
                        </h2>

                        {/* Subsection List */}
                        <div className="ml-4 space-y-3 mt-3">
                            {sec.subsections.map((sub) => (
                                <CardContent
                                    key={sub.id}
                                    className="border border-gray-700 rounded-lg p-3 bg-gray-800 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <Heading className="w-4 h-4 text-yellow-400" />
                                        <h3 className="font-medium text-white">{sub.title}</h3>
                                    </div>
                                    {sub.description && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <FileText className="w-4 h-4 text-blue-400" />
                                            <p>{sub.description}</p>
                                        </div>
                                    )}
                                    {sub.videoUrl && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-full">
                                                <video
                                                    src={sub.videoUrl}
                                                    controls
                                                    preload="metadata"
                                                    className="w-full max-h-60 rounded-lg border border-gray-700 shadow-md"
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                                <p className="text-xs text-gray-400 mt-1">🎬 {sub.title} Preview</p>
                                            </div>
                                        </div>
                                    )}

                                </CardContent>
                            ))}
                        </div>

                        {/* Add Subsection Form */}
                        <SubsectionForm
                            onAdd={(t, d, v) => addSubsection(sec.id, t, d, v)}
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}

function SubsectionForm({
    onAdd,
}: {
    onAdd: (title: string, desc: string, video?: File | null) => void;
}) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !desc.trim() || !video) {
            toast.error("All fields are required");
            return;
        }
        setLoading(true);
        await onAdd(title, desc, video);
        setLoading(false);
        setTitle("");
        setDesc("");
        setVideo(null);
    };

    return (
        <div className="mt-4 space-y-3">
            <div className="flex gap-2">
                <Input
                    placeholder="Subsection title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-700 border border-gray-800 text-white placeholder:text-gray-400"
                />
                <Input
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="bg-gray-700 border border-gray-800 text-white placeholder:text-gray-400"
                />
            </div>

            {/* Video Upload */}
            <label className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition">
                <Upload className="w-6 h-6 text-yellow-500 mb-2" />
                <span className="text-sm text-gray-400">
                    {video ? video.name : "Upload a video file"}
                </span>
                <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                />
            </label>

            <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-medium w-full"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                ) : (
                    "+ Add Subsection"
                )}
            </Button>
        </div>
    );
}
