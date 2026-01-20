import { useRef, useState, type ChangeEvent } from "react";
import { Eye, EyeOff, Loader, Trash2, Upload } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ShadCN UI Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { setToLocalStorage } from "@/utlils/localstorage";

const Settings = () => {
  const { user, token, loadUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    role: user?.role || "",
    dob: user?.dob ? user.dob.split("T")[0] : "",
    gender: user?.gender || "",
    contactNo: user?.contactNo || "",
    about: user?.about || "",
    currentPassword: "",
    newPassword: "",
  });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete account modal
  const [showModal, setShowModal] = useState(false);

  // Confirm password modal before saving profile
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  //Saving Loading
  const [profileSaving, setProfileSaving] = useState(false);

  const [previewImage, setPreviewImage] = useState<string>(
    user?.image || "https://github.com/shadcn.png"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload + preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // Reset to default
  const handleRemoveImage = () => {
    setPreviewImage("https://github.com/shadcn.png");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSaveProfile = async () => {
    const formDataToUpdate = new FormData();
    formDataToUpdate.append("firstname", formData.firstName);
    formDataToUpdate.append("lastname", formData.lastName);
    formDataToUpdate.append("about", formData.about);
    formDataToUpdate.append("contactNo", formData.contactNo);
    formDataToUpdate.append("gender", formData.gender);
    formDataToUpdate.append("password", confirmPassword);
    formDataToUpdate.append("dob", formData.dob);

    if (imageFile) {
      formDataToUpdate.append("image", imageFile);
    }

    setProfileSaving(true);
    try {
      const res = await axios.put(`${API_URL}/user/update`, formDataToUpdate, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        const { user, message } = res.data;
        setToLocalStorage("user", user);
        loadUser();
        toast.success(message || "Profile Updated Successfully")
        setShowConfirmPasswordModal(false)
        navigate('/dashboard/my-profile');

      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.message || error.message || "Failed to update profile")
    } finally {
      setConfirmPassword('');
      setProfileSaving(false);
    }
  };


  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Please fill both current and new password");
      return;
    }

    const changePasswordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    setChangePasswordLoading(true);

    try {
      const res = await axios.put(`${API_URL}/user/change-password`, changePasswordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password changed successfully");
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      } else {
        toast.error(res.data.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setChangePasswordLoading(false);
    }
  };


  return (
    <div className="p-4 sm:p-8 min-h-screen transition-all duration-300 w-full animate-in fade-in duration-700">
      <div className="space-y-8 w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Customize your account and security preferences
          </p>
        </div>

        {/* Delete Account Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-[#050816] border border-red-500/20 rounded-[2.5rem] shadow-2xl p-10 max-w-md">
            <DialogHeader>
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="text-red-500 w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-white text-center">Are you absolutely sure?</DialogTitle>
              <DialogDescription className="text-gray-400 text-center mt-3 text-base leading-relaxed">
                Deleting your account will remove all content associated with it, including your certificates and paid courses. <span className="text-red-500 font-bold">This action is permanent.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-col gap-3 mt-8">
              <Button
                className="w-full h-12 rounded-xl bg-red-600 text-white font-black hover:bg-red-500 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
                onClick={() => { setShowModal(false); }}
              >
                Delete Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="w-full h-12 rounded-xl border-white/5 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-all"
              >
                Keep Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Password Save Modal */}
        <Dialog open={showConfirmPasswordModal} onOpenChange={setShowConfirmPasswordModal}>
          <DialogContent className="bg-[#050816] border border-white/5 rounded-[2.5rem] shadow-2xl p-10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white">Confirm Updates</DialogTitle>
              <DialogDescription className="text-gray-400 mt-2 text-base">
                Please enter your current password to authorize these changes to your profile.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-6">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Current Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-white/2 border-white/10 rounded-2xl text-white placeholder:text-gray-700 focus:ring-purple-500"
              />
            </div>

            <DialogFooter className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowConfirmPasswordModal(false)}
                className="w-full h-12 rounded-xl border-white/5 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                className="w-full h-12 rounded-xl bg-purple-600 text-white font-black hover:bg-purple-500 transition-all shadow-[0_10px_20px_rgba(147,51,234,0.2)]"
                onClick={handleSaveProfile}
                disabled={!confirmPassword || profileSaving}
              >
                {profileSaving ? <Loader className="animate-spin h-5 w-5 mr-2" /> : null}
                {profileSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- Profile Information --- */}
        <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-10 group">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <h2 className="text-xl font-black text-white">Profile Information</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group/avatar">
              <Avatar className="w-32 h-32 rounded-[2.5rem] border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                <AvatarImage src={previewImage} />
                <AvatarFallback className="bg-blue-600 text-3xl font-black text-white">
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-2xl flex items-center justify-center text-[#050816] hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Change Avatar
                </Button>
                {previewImage !== "https://github.com/shadcn.png" && (
                  <Button
                    onClick={handleRemoveImage}
                    variant="ghost"
                    className="h-12 px-6 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-500/5"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-gray-500 text-xs font-medium">JPG, PNG or GIF. Max 800KB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-14 bg-white/2 border-white/10 rounded-2xl text-white focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-14 bg-white/2 border-white/10 rounded-2xl text-white focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Profession</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger className="h-14 bg-white/2 border-white/10 rounded-2xl text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#050816] border-white/10 text-white rounded-xl">
                  {["student", "instructor"].map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="h-14 bg-white/2 border-white/10 rounded-2xl text-white focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</Label>
              <div className="flex gap-2">
                <div className="h-14 px-4 bg-white/2 border border-white/10 rounded-2xl flex items-center text-gray-500 font-bold">+91</div>
                <Input
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  className="flex-1 h-14 bg-white/2 border-white/10 rounded-2xl text-white focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Gender</Label>
              <div className="h-14 flex items-center gap-6 px-6 bg-white/2 border border-white/10 rounded-2xl">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer group/radio">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInputChange}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span className="text-sm font-bold text-gray-400 group-hover/radio:text-white transition-colors capitalize">{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Bio / About</Label>
            <Textarea
              name="about"
              value={formData.about}
              onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
              placeholder="Tell others about yourself..."
              className="min-h-[120px] bg-white/2 border-white/10 rounded-2xl text-white placeholder:text-gray-700 focus:ring-purple-500 p-6"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button

              className="h-14 px-8 bg-gray-700 hover:bg-gray-600 rounded-2xl text-gray-200 font-bold hover:text-white"
              onClick={() => navigate('/dashboard/my-profile')}
            >
              Cancel
            </Button>
            <Button
              className="h-14 px-10 rounded-2xl bg-purple-600 text-white font-black hover:bg-purple-500 transition-all shadow-[0_10px_20px_rgba(147,51,234,0.2)]"
              onClick={() => setShowConfirmPasswordModal(true)}
            >
              Update Profile
            </Button>
          </div>
        </div>

        {/* --- Change Password --- */}
        <div className="glass p-10 rounded-[2.5rem] border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            <h2 className="text-xl font-black text-white">Change Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-2 relative">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-14 bg-white/2 border-white/10 rounded-2xl text-white pr-12 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2 relative">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-14 bg-white/2 border-white/10 rounded-2xl text-white pr-12 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            className="h-14 px-10 rounded-2xl bg-white text-[#050816] font-black hover:bg-purple-600 hover:text-white transition-all shadow-xl"
            onClick={handleChangePassword}
            disabled={changePasswordLoading}
          >
            {changePasswordLoading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : null}
            {changePasswordLoading ? 'Applying...' : 'Apply New Password'}
          </Button>
        </div>

        {/* --- DANGER ZONE --- */}
        <div className="p-10 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-red-500">Delete Account</h2>
              <p className="text-red-900/60 font-medium text-sm">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="h-12 px-6 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            Permanently Delete My Account
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
