import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  PlusCircle,
  Loader2,
  FileText,
  Heading,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import type { CourseDetails, Section } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesStore } from "@/store/courseStore";

export default function UpdateCourseContentDialog({
  course,
  open,
  onOpenChange,
}: {
  course: CourseDetails | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const {fetchAllCourses} = useCoursesStore();
  console.log("PRINTNIG COURSE IN UPDATECOURSE CONTENT", course);
  const { token } = useAuthStore();
  const [sections, setSections] = useState<Section[]>(
    course?.courseContent || []
  );
  const [newSection, setNewSection] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // state for subsection editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null);
  const [subSectionDeleteLoading, setSubSectionDeleteLoading] = useState<string | null>(null);

  // ✅ Add Section
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

  // ✅ Delete Section
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

  // ✅ Add Subsection
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

  // ✅ Edit Subsection
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

  // ✅ Delete Subsection
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
      },
      );

      if (res.data.success) {
        // Remove subsection from state
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
      console.log("Error in deleting Subsection", error);
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
      <DialogContent className="max-w-4xl bg-gradient-to-r from-[#1f2937] to-[#111827] h-[90vh] flex flex-col">
        {/* Sticky header */}
        <DialogHeader className="shrink-0 border-b text-white border-gray-200 pb-2">
          <DialogTitle>Edit Course Content</DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Add Section */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Enter section title"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={addSection}
              disabled={addLoading}
              className="bg-yellow-500 text-black"
            >
              {addLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </>
              )}
            </Button>
          </div>

          {/* Render Sections */}
          <div className="space-y-4">
            {sections.map((sec) => (
              <Card
                key={sec._id}
                className="p-4 bg-gray-900 border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-yellow-400">
                    {sec.title}
                  </h2>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSection(sec._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Subsections */}
                <div className="ml-4 space-y-3 mt-3">
                  {sec.subSections.map((sub) => (
                    <CardContent
                      key={sub._id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Heading className="w-4 h-4 text-yellow-400" />
                          <h3 className="text-white font-medium">
                            {sub.title}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDeleteSubsection(sub._id, sec._id)}
                            disabled={subSectionDeleteLoading === sub._id}
                            variant="destructive"
                            size="sm"
                          >
                            {subSectionDeleteLoading === sub._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSubsection({
                                ...sub,
                                sectionId: sec._id,
                              });
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4 text-blue-400" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FileText className="w-4 h-4" /> {sub.description}
                      </div>
                      {sub.videoUrl && (
                        <video
                          src={sub.videoUrl}
                          controls
                          preload="metadata"
                          className="w-full max-h-60 rounded-lg border border-gray-700"
                        />
                      )}
                    </CardContent>
                  ))}
                </div>

                {/* Add Subsection Form */}
                <SubsectionForm
                  onAdd={(t, d, v) => addSubsection(sec._id, t, d, v)}
                />
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>

      {/* Edit Subsection Dialog */}
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

// ------------------------
// Add Subsection Form
// ------------------------
function SubsectionForm({
  onAdd,
}: {
  onAdd: (title: string, desc: string, video?: File | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create & cleanup preview URL
  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [video]);

  const handleSubmit = async () => {
    if (!title || !desc || !video) {
      toast.error("All fields required");
      return;
    }
    setLoading(true);
    await onAdd(title, desc, video);
    setTitle("");
    setDesc("");
    setVideo(null);
    setLoading(false);
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Title + Desc */}
      <div className="flex gap-2">
        <Input
          placeholder="Subsection title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-700 text-white"
        />
        <Input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-gray-700 text-white"
        />
      </div>

      {/* Upload Box */}
      <label
        htmlFor="video-upload-add"
        className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-800 hover:border-green-500 transition"
      >
        <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
        <span className="text-gray-300">
          {video ? video.name : "Click to upload or drag & drop video"}
        </span>
        <input
          id="video-upload-add"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files && setVideo(e.target.files[0])}
        />
      </label>

      {/* Video Preview */}
      {previewUrl && (
        <div className="mt-2">
          <video
            src={previewUrl}
            controls
            className="w-full rounded-lg border border-gray-600"
          />
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 w-full"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "+ Add Subsection"
        )}
      </Button>
    </div>
  );
}


// ------------------------
// Edit Subsection Dialog
// ------------------------
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

  console.log("PRINTING SUBSECTION", subsection);
  const [title, setTitle] = useState(subsection?.title || "");
  const [description, setDescription] = useState(subsection?.description || "");
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      video, // ✅ send video to parent
    });
    setLoading(false);
    onClose();
  };

  // Create & cleanup preview URL
  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [video]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-r from-[#1f2937] to-[#111827] text-white rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Subsection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter subsection title"
              className="mt-1 bg-gray-700 border border-gray-800 placeholder:text-gray-400 "
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter subsection description"
              className="mt-1 bg-gray-700 border border-gray-800 placeholder:text-gray-400 "
            />
          </div>

          {/* Video Upload */}
          <div>
            <label
              htmlFor="video-upload-edit"
              className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-800 hover:border-green-500 transition"
            >
              <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
              <span className="text-gray-300">
                {video ? video.name : "Click to upload or drag & drop video"}
              </span>
              <input
                id="video-upload-edit"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files && setVideo(e.target.files[0])}
              />
            </label>

            {/* Video Preview */}
            {previewUrl && (
              <div className="mt-2">
                <video
                  src={previewUrl}
                  controls
                  className="w-full rounded-lg border border-gray-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
            className="rounded-xl bg-white cursor-pointer text-black hover:bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
