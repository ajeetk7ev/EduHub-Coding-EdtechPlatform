import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, X, Loader2 } from "lucide-react";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import { useCategoryStore } from "@/store/categoryStore";
import type { CourseDetails } from "@/types";
import { useCoursesStore } from "@/store/courseStore";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  course: CourseDetails | null;
  onUpdated: (updated: CourseDetails) => void;
};

export default function UpdateCourseDialog({ open=true, onOpenChange, course, onUpdated }: Props) {
  const { fetchAllCourses } = useCoursesStore();
  const { token } = useAuthStore();
  const { categories } = useCategoryStore();

  const [saving, setSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription]= useState ("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState<string | number>("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [wylInput, setWylInput] = useState("");

  const [instructions, setInstructions] = useState<string[]>([]);
  const [instructionInput, setInstructionInput] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [currentThumb, setCurrentThumb] = useState<string | null>(null);

  // Prefill state when course changes/open
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

    // reset transient inputs
    setTagInput("");
    setWylInput("");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#111827] text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>

        {!course ? (
          <div className="py-10 text-center text-gray-400">No course selected</div>
        ) : (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Title */}
            <div>
              <label className="text-sm mb-1 block">Course Title *</label>
              <Input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter Course Title"
                disabled={saving}
                className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Description + AI */}
            <div>
              <label className="text-sm mb-1 block">Course Description *</label>
              <div className="flex flex-col gap-2">
                <Textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Enter course description"
                  disabled={saving}
                  className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
                />
                <Button
                  onClick={handleAIGenerate}
                  disabled={loadingAI || saving}
                  className="shrink-0 self-start bg-yellow-500 text-black hover:bg-yellow-600"
                >
                  {loadingAI ? "Generating..." : "✨ Generate With AI"}
                </Button>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="text-sm mb-1 block">Language *</label>
              <Select
                onValueChange={setLanguage}
                defaultValue={String(language || "").toLowerCase()}
              >
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
                  <span
                    key={wyl}
                    className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm flex items-center"
                  >
                    {wyl}
                    <X
                      className="ml-2 w-4 h-4 cursor-pointer"
                      onClick={() => removeItem(setWhatYouWillLearn, wyl)}
                    />
                  </span>
                ))}
              </div>
              <Input
                value={wylInput}
                onChange={(e) => setWylInput(e.target.value)}
                onKeyDown={(e) => addItemOnEnter(e, setWhatYouWillLearn, wylInput, setWylInput)}
                placeholder="Type and press Enter"
                disabled={saving}
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
                disabled={saving}
                className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm mb-1 block">Category *</label>
              <Select
                onValueChange={setCategory}
                defaultValue={category}
              >
                <SelectTrigger className="bg-gray-700 border border-gray-800">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 text-white">
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm mb-1 block">Tags *</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeItem(setTags, tag)} />
                  </span>
                ))}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => addItemOnEnter(e, setTags, tagInput, setTagInput)}
                placeholder="Type and press Enter"
                disabled={saving}
                className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="text-sm mb-1 block">Instructions *</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {instructions.map((inst) => (
                  <span
                    key={inst}
                    className="px-3 py-1 bg-neutral-500 text-white rounded-full text-sm flex items-center"
                  >
                    {inst}
                    <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeItem(setInstructions, inst)} />
                  </span>
                ))}
              </div>
              <Input
                value={instructionInput}
                onChange={(e) => setInstructionInput(e.target.value)}
                onKeyDown={(e) => addItemOnEnter(e, setInstructions, instructionInput, setInstructionInput)}
                placeholder="Type and press Enter"
                disabled={saving}
                className="bg-gray-700 border border-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-sm mb-1 block">Course Thumbnail *</label>
              <label className="border-2 border-dashed border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition">
                <Upload className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-sm text-gray-400">Drag & drop or click to upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
              </label>

              {/* Preview */}
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  className="mt-3 rounded-lg w-full h-40 object-cover"
                />
              ) : currentThumb ? (
                <img
                  src={currentThumb}
                  alt="current thumbnail"
                  className="mt-3 rounded-lg w-full h-40 object-cover"
                />
              ) : null}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm mb-1 block">Status</label>
              <Select onValueChange={(v) => setStatus(v as "Draft" | "Published")} defaultValue={status}>
                <SelectTrigger className="bg-gray-700 border border-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 text-white">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-yellow-500 text-black hover:bg-yellow-600">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
