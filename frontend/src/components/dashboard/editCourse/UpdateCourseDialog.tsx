import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, X, Loader2, Sparkles, IndianRupee, Globe, Tag, ClipboardList, Image as ImageIcon } from "lucide-react";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import { useCategoryStore } from "@/store/categoryStore";
import type { CourseDetails } from "@/types";
import { useCoursesStore } from "@/store/courseStore";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  course: CourseDetails | null;
  onUpdated: (updated: CourseDetails) => void;
};

export default function UpdateCourseDialog({ open = true, onOpenChange, course, onUpdated }: Props) {
  const { fetchAllCourses } = useCoursesStore();
  const { token } = useAuthStore();
  const { categories } = useCategoryStore();

  const [saving, setSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState<string | number>("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);

  const [instructions, setInstructions] = useState<string[]>([]);
  const [instructionInput, setInstructionInput] = useState("");
  const [whatYouWillLearnInput, setWhatYouWillLearnInput] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [currentThumb, setCurrentThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!course) return;
    setCourseName(course.courseName || "");
    setCourseDescription(course.courseDescription || "");
    setLanguage(String(course.language || ""));
    setPrice(course.price ?? "");
    setCategory((course as any).category?._id || (course as any).category || "");
    setStatus((course.status as "Draft" | "Published") || "Draft");
    setTags(course.tags || []);
    setWhatYouWillLearn(course.whatYouWillLearn || []);
    setInstructions(course.instructions || []);
    setCurrentThumb(course.thumbnail || null);

    setTagInput("");
    setInstructionInput("");
    setThumbnailFile(null);
    setThumbnailPreview(null);
  }, [course, open]);

  const removeItem = (arrSetter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    arrSetter((prev) => prev.filter((x) => x !== value));
  };

  const addItemOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    reset: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      setter((prev) => [...prev, value.trim()]);
      reset("");
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setThumbnailFile(f);
      setThumbnailPreview(URL.createObjectURL(f));
    }
  };

  const handleAIGenerate = async () => {
    if (!courseName.trim()) {
      toast.error("Enter a course title first");
      return;
    }
    setLoadingAI(true);
    try {
      const res = await axios.post(`${API_URL}/ai/generate-course-content`, { courseTitle: courseName });
      setTags(res.data?.tags ?? tags);
      setCourseDescription(res.data?.description ?? courseDescription);
      setWhatYouWillLearn(res.data?.whatYouWillLearn ?? whatYouWillLearn);
      toast.success("Content regenerated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to generate content");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    if (!course) return;
    const form = new FormData();
    form.append("courseName", courseName);
    form.append("courseDescription", courseDescription);
    form.append("language", language);
    form.append("price", String(price));
    form.append("category", category);
    tags.forEach((t) => form.append("tags", t));
    whatYouWillLearn.forEach((p) => form.append("whatYouWillLearn", p));
    instructions.forEach((i) => form.append("instructions", i));
    form.append("status", status);
    if (thumbnailFile) form.append("thumbnailImage", thumbnailFile);

    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/course/${course._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        fetchAllCourses();
        const updated: CourseDetails = res.data.course ?? {
          ...course,
          courseName,
          courseDescription,
          language,
          price: Number(price),
          category: (course as any).category?._id ? { ...(course as any).category, _id: category } : (category as any),
          tags,
          whatYouWillLearn,
          instructions,
          status,
          thumbnail: thumbnailFile ? (res.data?.course?.thumbnail || currentThumb || "") : (currentThumb || course.thumbnail),
        };
        toast.success(res.data.message || "Course updated");
        onUpdated(updated);
        onOpenChange(false);
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err: any) {
      console.error("Update error", err);
      toast.error(err?.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[60vw] p-0 bg-[#050816] text-white border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10" />

            <DialogHeader className="p-8 pb-4 border-b border-white/5">
              <DialogTitle className="text-3xl font-black tracking-tight">
                Update <span className="text-blue-500">Course</span>
              </DialogTitle>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Refine your course details and settings</p>
            </DialogHeader>

            {!course ? (
              <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No course selected</div>
            ) : (
              <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="text-blue-500" size={18} />
                        <h3 className="text-lg font-black text-white">Basic Information</h3>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                        <Input
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                          placeholder="e.g. Master React Native"
                          disabled={saving}
                          className="bg-white/5 border-white/5 h-12 rounded-xl focus:bg-white/[0.08] focus:border-blue-500/50 transition-all font-bold"
                        />
                      </div>

                      <div className="space-y-2 relative group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                        <Textarea
                          value={courseDescription}
                          onChange={(e) => setCourseDescription(e.target.value)}
                          placeholder="What will students learn?"
                          disabled={saving}
                          className="bg-white/5 border-white/5 min-h-[160px] rounded-2xl focus:bg-white/[0.08] focus:border-blue-500/50 transition-all font-bold p-5"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAIGenerate}
                          disabled={loadingAI || saving}
                          className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-50"
                        >
                          {loadingAI ? "..." : <><Sparkles size={12} /> AI</>}
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Language</label>
                        <Select onValueChange={setLanguage} defaultValue={String(language || "").toLowerCase()}>
                          <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-blue-500/50 font-bold">
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-gray-400" />
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                        <Select onValueChange={setCategory} defaultValue={category}>
                          <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-blue-500/50 font-bold">
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
                        <ImageIcon className="text-purple-500" size={18} />
                        <h3 className="text-lg font-black text-white">Course Media</h3>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Thumbnail</label>
                        <div className="relative group overflow-hidden rounded-3xl border-2 border-dashed border-white/5 hover:border-blue-500/50 transition-all aspect-video bg-white/[0.01]">
                          {thumbnailPreview || currentThumb ? (
                            <>
                              <img src={thumbnailPreview || currentThumb || ""} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <label className="cursor-pointer bg-white text-[#050816] px-5 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-transform">
                                  Change
                                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                                </label>
                              </div>
                            </>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-4 text-center">
                              <Upload size={20} className="text-blue-500 mb-2" />
                              <p className="text-white font-black text-xs">Upload Thumbnail</p>
                              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <IndianRupee className="text-emerald-500" size={18} />
                        <h3 className="text-lg font-black text-white">Pricing</h3>
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black">₹</div>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Price"
                          disabled={saving}
                          className="bg-white/5 border-white/5 h-14 rounded-xl pl-8 focus:border-emerald-500/50 font-black text-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags & Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Tag className="text-amber-500" size={18} />
                      <h3 className="text-lg font-black text-white">Tags</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                          {tags.map((t) => (
                            <motion.span
                              key={t}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="pl-3 pr-1 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                            >
                              {t}
                              <button onClick={() => removeItem(setTags, t)} className="hover:text-white p-1">
                                <X size={10} />
                              </button>
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => addItemOnEnter(e, setTags, tagInput, setTagInput)}
                        placeholder="Add tags..."
                        className="bg-white/5 border-white/5 h-10 rounded-lg focus:border-amber-500/50 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="text-blue-500" size={18} />
                      <h3 className="text-lg font-black text-white">Requirements</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                          {instructions.map((i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="pl-3 pr-1 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                            >
                              {i}
                              <button onClick={() => removeItem(setInstructions, i)} className="hover:text-white p-1">
                                <X size={10} />
                              </button>
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                      <Input
                        value={instructionInput}
                        onChange={(e) => setInstructionInput(e.target.value)}
                        onKeyDown={(e) => addItemOnEnter(e, setInstructions, instructionInput, setInstructionInput)}
                        placeholder="Add instructions..."
                        className="bg-white/5 border-white/5 h-10 rounded-lg focus:border-blue-500/50 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-emerald-500" size={18} />
                      <h3 className="text-lg font-black text-white">What You Will Learn</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                          {whatYouWillLearn.map((p) => (
                            <motion.span
                              key={p}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="pl-3 pr-1 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                            >
                              {p}
                              <button onClick={() => removeItem(setWhatYouWillLearn, p)} className="hover:text-white p-1">
                                <X size={10} />
                              </button>
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                      <Input
                        value={whatYouWillLearnInput}
                        onChange={(e) => setWhatYouWillLearnInput(e.target.value)}
                        onKeyDown={(e) => addItemOnEnter(e, setWhatYouWillLearn, whatYouWillLearnInput, setWhatYouWillLearnInput)}
                        placeholder="Add learning points..."
                        className="bg-white/5 border-white/5 h-10 rounded-lg focus:border-emerald-500/50 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-1 rounded-xl bg-white/5 border border-white/5 w-fit mx-auto">
                  {(["Draft", "Published"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg
                         ${status === s ? "bg-white text-[#050816] shadow-lg" : "text-gray-500 hover:text-white"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="p-8 pt-4 border-t border-white/5 flex flex-row gap-3">
              <button
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="flex-1 py-4 text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
              >
                Discard Changes
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : "Update Course"}
              </motion.button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
