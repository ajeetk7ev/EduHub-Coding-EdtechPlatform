"use client";
import React, { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export interface CourseInfoFormProps{
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setCourseId: React.Dispatch<React.SetStateAction<string>>;
}

export default function CourseInfoForm({setStep, setCourseId}:CourseInfoFormProps) {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
    const [wylInput, setWylInput] = useState("");
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
    const [createCourseLoading, setCreateCourseLoading] = useState(false);
    const { categories } = useCategoryStore();
    const {token} = useAuthStore();

    // AI simulation
    const handleAIGenerate = async () => {
        setLoadingAI(true);
        try {
            const courseTitle = courseName;
            const res = await axios.post(`${API_URL}/ai/generate-course-content`, { courseTitle });
            setTags(res.data.tags);
            setCourseDescription(res.data.description);
            setWhatYouWillLearn(res.data.
                whatYouWillLearn)
        } catch (error:any) {
            console.log("Error in ai generate", error);
            toast.error(error.response.data.message || "Failed to generate content")
        } finally {
            setLoadingAI(false);
        }
    };

    // Thumbnail upload
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // Handle array inputs
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

    const removeItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        value: string
    ) => {
        setter((prev) => prev.filter((item) => item !== value));
    };

    const handleSubmit = async () => {
        const courseFormData = new FormData();
        courseFormData.append("courseName", courseName);
        courseFormData.append("courseDescription", courseDescription);
        courseFormData.append("language", language);
        courseFormData.append("price", price);
        courseFormData.append("category", category);
        tags.forEach(tag => {
            courseFormData.append("tags", tag);
        });

        whatYouWillLearn.forEach(point => {
            courseFormData.append("whatYouWillLearn", point);
        });

        instructions.forEach(instruction => {
            courseFormData.append("instructions", instruction);
        })
        courseFormData.append("status", status);
        if(thumbnail){
             courseFormData.append("thumbnailImage", thumbnail);
        }
        
        setCreateCourseLoading(true);
        try {
            const res = await axios.post(`${API_URL}/course`,courseFormData,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            if(res.data.success){
                const {message, course} = res.data;
                console.log("PRINTING COURSE", course);
                toast.success(message || "Course Created Successfully")
                setCourseId(course._id);
                setStep(2);
            }

        } catch (error:any) {
            console.log("Error in create course",error);
            toast.error(error.response.data.message  || "Failed To Create Course");
        } finally{
            setCreateCourseLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Course Information</h2>

            {/* Course Name */}
            <div>
                <label className="text-sm mb-1 block">Course Title *</label>
                <Input
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Enter Course Title"
                    className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                />
            </div>

            {/* Description with AI */}
            <div>
                <label className="text-sm mb-1 block">Course Description *</label>
                <div className="flex flex-col gap-2">
                    <Textarea
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        placeholder="Enter course description"
                        className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                    />
                    <Button
                        onClick={handleAIGenerate}
                        disabled={loadingAI}
                        className="shrink-0 self-start bg-yellow-500 text-black hover:bg-yellow-600"
                    >
                        {loadingAI ? "Generating..." : "✨ Generate With AI"}
                    </Button>
                </div>
            </div>

            {/* Language */}
            <div>
                <label className="text-sm mb-1 block">Language *</label>
                <Select onValueChange={setLanguage}>
                    <SelectTrigger className="bg-gray-700 border border-gray-800 placeholder:text-gray-400">
                        <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* What You Will Learn */}
            <div>
                <label className="text-sm mb-1 block">What You Will Learn *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {whatYouWillLearn.map((wyl) => (
                        <motion.span
                            key={wyl}
                            className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm flex items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {wyl}
                            <X
                                className="ml-2 w-4 h-4 cursor-pointer"
                                onClick={() => removeItem(setWhatYouWillLearn, wyl)}
                            />
                        </motion.span>
                    ))}
                </div>

                <Input
                    value={wylInput}
                    onChange={(e) => setWylInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, setWhatYouWillLearn, wylInput, setWylInput)}
                    placeholder="Type and press Enter"
                    className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                />


            </div>

            {/* Price */}
            <div>
                <label className="text-sm mb-1 block">Price *</label>
                <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                />
            </div>

            {/* Category */}
            <div>
                <label className="text-sm mb-1 block">Category *</label>
                <Select onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-700 border border-gray-800">
                        <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white">
                        {categories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}

                    </SelectContent>
                </Select>
            </div>

            {/* Tags */}
            <div>
                <label className="text-sm mb-1 block">Tags *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                        <motion.span
                            key={tag}
                            className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm flex items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {tag}
                            <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeItem(setTags, tag)} />
                        </motion.span>
                    ))}
                </div>

                <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, setTags, tagInput, setTagInput)}
                    placeholder="Type and press Enter"
                    className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                />


            </div>

            {/* Instructions */}
            <div>
                <label className="text-sm mb-1 block">Instructions *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {instructions.map((inst) => (
                        <motion.span
                            key={inst}
                            className="px-3 py-1 bg-neutral-500 text-white rounded-full text-sm flex items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {inst}
                            <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeItem(setInstructions, inst)} />
                        </motion.span>
                    ))}
                </div>
                <Input
                    value={instructionInput}
                    onChange={(e) => setInstructionInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, setInstructions, instructionInput, setInstructionInput)}
                    placeholder="Type and press Enter"
                    className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                />
            </div>

            {/* Thumbnail Upload */}
            <div>
                <label className="text-sm mb-1 block">Course Thumbnail *</label>
                <label className="border-2 border-dashed border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition">
                    <Upload className="w-8 h-8 text-yellow-500 mb-2" />
                    <span className="text-sm text-gray-400">Drag & drop or click to upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </label>
                {thumbnailPreview && (
                    <motion.img
                        src={thumbnailPreview}
                        alt="thumbnail preview"
                        className="mt-3 rounded-lg w-full h-40 object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                )}
            </div>

            {/* Status */}
            <div>
                <label className="text-sm mb-1 block">Status</label>
                <Select onValueChange={setStatus} defaultValue="Draft">
                    <SelectTrigger className="bg-gray-700 border border-gray-800">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white">
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Submit */}
            <div>
                <Button 
                disabled={createCourseLoading}
                className="w-full bg-yellow-500 text-black font-semibold hover:bg-yellow-600" onClick={handleSubmit}>
                   {createCourseLoading ? "Creating Course..." : " Create Course"}
                </Button>
            </div>
        </div>
    );
}
