import { useRef, useState, type ChangeEvent } from "react";
import { Eye, EyeOff, Loader, Trash2, Upload, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardCollapsedStore } from "@/store/dashboardCollapsedStore";
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
  const { collapsed } = useDashboardCollapsedStore();
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
          headers: {Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        if(res.data.success){
          const {user, message} = res.data;
          setToLocalStorage("user", user);
          loadUser();
          toast.success(message || "Profile Updated Successfully")
          setShowConfirmPasswordModal(false)
          navigate('/dashboard/my-profile');
          
        }
      } catch (error:any) {
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
    <div className="flex flex-col items-center p-6 sm:p-10 min-h-screen text-gray-200 w-full transition-all duration-300">

      {/* Delete Account Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-[#2a131b] border border-[#4d282e] rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">Delete Account</DialogTitle>
            <DialogDescription className="text-red-200 mt-1">
              Deleting your account will remove all content associated with it, including Paid Courses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { console.log("Account deleted"); setShowModal(false); }}>Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Password Modal for Save Changes */}
      <Dialog open={showConfirmPasswordModal} onOpenChange={setShowConfirmPasswordModal}>
        <DialogContent className="bg-[#1f2937] border border-zinc-700 rounded-xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-400">Confirm Password</DialogTitle>
            <DialogDescription className="text-gray-300 mt-1">
              Please enter your current password to save changes.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4">
            <Label htmlFor="confirmPassword">Current Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-zinc-800 mt-2 border-zinc-600 text-white shadow-inner"
            />
          </div>

          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button variant="outline" className="text-black" onClick={() => setShowConfirmPasswordModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
              onClick={handleSaveProfile}
              disabled={!confirmPassword || profileSaving}
            >
             {profileSaving && <Loader className="animate-spin h-5 w-5 text-white" />}
            {profileSaving ? 'Saving...' : 'Confirm & Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className={`space-y-10 w-full ${collapsed ? "max-w-6xl" : "max-w-4xl"}`}>

        {/* Profile Information */}
        <div className="flex flex-col gap-8 p-8 rounded-xl border border-zinc-700 bg-gradient-to-r from-[#1f2937] to-[#111827] shadow-lg hover:shadow-2xl transition-shadow">
          <p className="text-xl font-bold text-white text-center">Profile Information</p>

          <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <Avatar className="w-24 h-24 ring-2 ring-purple-600">
              <AvatarImage src={previewImage} alt={`${user?.firstname} ${user?.lastname}`} />
              <AvatarFallback>
                {`${user?.firstname?.[0]}${user?.lastname?.[0]}`}
              </AvatarFallback>
            </Avatar>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} />
                Change Profile
              </Button>
              {previewImage !== "https://github.com/shadcn.png" && (
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleRemoveImage}
                >
                  <X size={18} />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* First & Last Name Row */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <Label>First Name</Label>
              <Input
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-600 text-white shadow-inner"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Label>Last Name</Label>
              <Input
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-600 text-white shadow-inner"
              />
            </div>
          </div>

          {/* Profession & DOB Row */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="profession">Profession</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white shadow-inner">
                  <SelectValue placeholder="Select a profession" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-white">
                  {["student", "instructor"].map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-600 text-white shadow-inner"
              />
            </div>
          </div>

          {/* Phone & Gender Row */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="contactNo">Phone Number</Label>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm border border-zinc-700 bg-zinc-800 p-3 rounded-md shadow-inner">
                  +91
                </span>
                <Input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="bg-zinc-800 border-zinc-600 text-white shadow-inner"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Label>Gender</Label>
              <div className="flex items-center gap-6 pt-1 flex-wrap">
                {["male", "female", "other"].map((g) => (
                  <div key={g} className="flex items-center gap-2 text-white text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInputChange}
                      className="accent-purple-500 w-4 h-4"
                    />
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
              placeholder="Enter Bio Details"
              className="h-28 bg-zinc-800 border-zinc-600 text-white shadow-inner resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <Button
              variant="outline"
              className="shadow-md hover:shadow-lg text-gray-400"
              onClick={() => console.log("Cancel clicked")}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
              onClick={() => setShowConfirmPasswordModal(true)}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Password Section */}
        <div className="flex flex-col gap-6 p-8 rounded-xl border border-zinc-700 bg-gradient-to-r from-[#1f2937] to-[#111827] shadow-lg hover:shadow-2xl transition-shadow">
          <p className="text-xl font-bold text-white">Change Password</p>

          <div className="flex flex-col gap-4">

            {/* Current Password */}
            <div className="relative sm:w-[50%] w-full">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter Current Password"
                className="bg-zinc-800 mt-2 border-zinc-600 text-white shadow-inner pr-10"
              />
              <span
                className="absolute right-2 top-10 -translate-y-1/2 p-1 cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* New Password */}
            <div className="relative sm:w-[50%] w-full">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter New Password"
                className="bg-zinc-800 mt-2 border-zinc-600 text-white shadow-inner pr-10"
              />
              <span
                className="absolute right-2 top-10 -translate-y-1/2 p-1 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Change Password Button */}
            <Button
              className="self-start bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all mt-2"
              onClick={handleChangePassword}
              disabled={changePasswordLoading}
            >
               {changePasswordLoading && <Loader className="animate-spin h-5 w-5 text-white" />}
             {changePasswordLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col gap-5 p-6 sm:p-8 rounded-xl border border-red-800 bg-red-950 shadow-lg hover:shadow-2xl transition-shadow">
          <div className="flex flex-col sm:flex-row items-center gap-3 ">
            <div className="w-[60px] h-[60px] bg-red-700 rounded-full flex items-center justify-center">
              <Trash2 className="text-red-200 mt-1 " />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-red-300">Delete Account</p>
              <p className="text-sm text-red-200">
                This account contains Paid Courses. Deleting your account will remove all associated content.
              </p>
            </div>
          </div>
          <Button
            className="text-red-100 self-start bg-red-700 px-3 py-1 hover:bg-red-800 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Delete Now
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
