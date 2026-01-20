import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Trash2,
  PlusCircle,
  Loader2,
  Upload,
  Play,
  Layout,
  Video,
  ChevronDown,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import type { CourseDetails, Section } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesStore } from "@/store/courseStore";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdateCourseContentDialog({
  course,
  open,
  onOpenChange,
}: {
  course: CourseDetails | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { fetchAllCourses } = useCoursesStore();
  const { token } = useAuthStore();
  const [sections, setSections] = useState<Section[]>(
    course?.courseContent || []
  );
  const [newSection, setNewSection] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null);
  const [subSectionDeleteLoading, setSubSectionDeleteLoading] = useState<string | null>(null);

  const addSection = async () => {
    if (!newSection.trim()) {
      toast.error("Section title required");
      return;
    }
    setAddLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/section`,
        { title: newSection, courseId: course?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSections([...sections, res.data.section]);
        setNewSection("");
        toast.success("Section added");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add section");
    } finally {
      setAddLoading(false);
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      const res = await axios.delete(
        `${API_URL}/course/${course?._id}/sections/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSections(sections.filter((s) => s._id !== sectionId));
        toast.success("Section deleted");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete section");
    }
  };

  const addSubsection = async (
    sectionId: string,
    title: string,
    description: string,
    video?: File | null
  ) => {
    if (!title.trim() || !description.trim() || !video) {
      toast.error("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("sectionId", sectionId);

    try {
      const res = await axios.post(
        `${API_URL}/sub-section`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const { subSection } = res.data;
        setSections(
          sections.map((sec) =>
            sec._id === sectionId
              ? { ...sec, subSections: [...sec.subSections, subSection] }
              : sec
          )
        );
        toast.success("Subsection added");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add subsection");
    }
  };

  const handleSaveSubsection = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("sectionId", data.sectionId);
    if (data.video) {
      formData.append("video", data.video);
    }
    try {
      const res = await axios.put(
        `${API_URL}/sub-section/${data.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSections(
          sections.map((sec) =>
            sec._id === data.sectionId
              ? {
                ...sec,
                subSections: sec.subSections.map((s) =>
                  s._id === data.id ? { ...s, ...data } : s
                ),
              }
              : sec
          )
        );
        toast.success("Subsection updated");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update subsection");
    }
  };

  const handleDeleteSubsection = async (subSectionId: string, sectionId: string) => {
    setSubSectionDeleteLoading(subSectionId);
    try {
      const res = await axios.delete(`${API_URL}/sub-section/${subSectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          sectionId,
        },
      });

      if (res.data.success) {
        setSections(
          sections.map((sec) =>
            sec._id === sectionId
              ? {
                ...sec,
                subSections: sec.subSections.filter(
                  (sub) => sub._id !== subSectionId
                ),
              }
              : sec
          )
        );
        fetchAllCourses();
        toast.success("Subsection deleted");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete subsection");
    } finally {
      setSubSectionDeleteLoading(null);
    }
  };

  useEffect(() => {
    if (course?.courseContent) {
      setSections(course.courseContent);
    }
  }, [course]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[50vw] p-0 bg-[#050816] text-white border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-[85vh] shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10" />

        <DialogHeader className="p-8 pb-4 border-b border-white/5 shrink-0">
          <DialogTitle className="text-3xl font-black tracking-tight">
            Edit <span className="text-blue-500">Curriculum</span>
          </DialogTitle>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Manage sections and lessons for your course</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10 custom-scrollbar">
          {/* Add Section */}
          <div className="flex gap-4 p-2 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
            <Input
              placeholder="e.g. Advanced State Management"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              className="bg-transparent border-none h-14 focus-visible:ring-0 text-white font-bold placeholder:text-gray-600"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addSection}
              disabled={addLoading}
              className="px-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap"
            >
              {addLoading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
              Add Section
            </motion.button>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {sections.map((sec, index) => (
                <motion.div
                  key={sec._id}
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
                      <button
                        onClick={() => deleteSection(sec._id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <ChevronDown size={20} className="text-gray-600" />
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {sec.subSections.map((sub) => (
                          <motion.div
                            key={sub._id}
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

                            <div className="flex items-center gap-2">
                              {sub.videoUrl && (
                                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest mr-2">
                                  <Video size={12} /> Video
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedSubsection({ ...sub, sectionId: sec._id });
                                  setEditDialogOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-blue-400 transition-all opacity-0 group-hover/sub:opacity-100"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubsection(sub._id, sec._id)}
                                disabled={subSectionDeleteLoading === sub._id}
                                className="p-2 text-gray-500 hover:text-red-400 transition-all opacity-0 group-hover/sub:opacity-100 disabled:opacity-50"
                              >
                                {subSectionDeleteLoading === sub._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <SubsectionForm
                      onAdd={(t, d, v) => addSubsection(sec._id, t, d, v)}
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
        </div>

        <DialogFooter className="p-8 pt-4 border-t border-white/5 shrink-0 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-10 py-4 bg-white/5 text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
          >
            Done Editing
          </button>
        </DialogFooter>
      </DialogContent>

      {selectedSubsection && (
        <EditSubsectionDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          subsection={selectedSubsection}
          onSave={handleSaveSubsection}
        />
      )}
    </Dialog>
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
            placeholder="Brief overview"
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

function EditSubsectionDialog({
  open,
  onClose,
  subsection,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  subsection: any;
  onSave: (data: any) => Promise<void>;
}) {
  const [title, setTitle] = useState(subsection?.title || "");
  const [description, setDescription] = useState(subsection?.description || "");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error("Title and description required");
      return;
    }

    setLoading(true);
    await onSave({
      id: subsection._id,
      sectionId: subsection.sectionId,
      title,
      description,
      video,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 bg-[#0a0f1e] text-white border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black tracking-tight">Edit <span className="text-blue-500">Lesson</span></DialogTitle>
            <button onClick={onClose} className="p-2 text-gray-600 hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Lesson Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-blue-500/50 text-white font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/5 min-h-[100px] rounded-xl focus:border-blue-500/50 text-white font-bold p-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Replace Video (Optional)</label>
            <label className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group">
              <Upload className={`w-6 h-6 mb-2 transition-all ${video ? "text-emerald-500" : "text-gray-500 group-hover:text-blue-500"}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {video ? video.name : "Select New Video File"}
              </span>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && setVideo(e.target.files[0])} />
            </label>
          </div>
        </div>

        <DialogFooter className="p-8 pt-4 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : "Save Changes"}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
