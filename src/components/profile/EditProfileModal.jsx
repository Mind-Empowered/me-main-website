import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaUser, FaTimes } from "react-icons/fa";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const SKILLS_OPTIONS = [
    "Flash mob",
    "Streetplay Acting",
    "Designing posters, placards and banners for the event",
    "Advertising of the event (spreading the word)",
    "Content Writing for the event",
    "Video creation and editing for the event",
    "Getting Sponsorship /CSR",
    "Teaching at Child Care Institutions and destitute homes",
    "Making Reels for Social Media",
    "Animation",
    "Research to get CSR/State & Central Grants",
    "Photography",
    "Designing creatives around Local and Global Festivals",
    "Anything related to IT",
    "Other"
];

const EditProfileModal = ({ user, isOpen, onClose, onUserUpdate }) => {
    const { language } = useLanguage();
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        permanentAddress: { building: "", street: "", area: "", city: "", state: "", pincode: "", country: "" },
        presentAddress: { building: "", street: "", area: "", city: "", state: "", pincode: "", country: "" },
        status: "",
        workspaceName: "",
        bio: "",
        instagram: "",
        github: "",
        linkedin: "",
        photoFile: null,
        photoPreview: null,
        preferences: { availability: [], preferredRoles: [], skills: [], gender: "", whatsapp: "" },
        emergencyInfo: { contactName: "", contactPhone: "", bloodGroup: "", tShirtSize: "" },
    });
    const [saving, setSaving] = useState(false);
    const [sameAddressChecked, setSameAddressChecked] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                permanentAddress: user.address?.permanentAddress || {
                    building: "", street: "", area: "", city: "", state: "", pincode: "", country: ""
                },
                presentAddress: user.address?.presentAddress || {
                    building: "", street: "", area: "", city: "", state: "", pincode: "", country: ""
                },
                status: user.is_working !== undefined ? (user.is_working ? 'working' : 'student') : "",
                workspaceName: user.workspace_name || "",
                bio: user.bio || "",
                instagram: user.socials?.instagram || "",
                github: user.socials?.github || "",
                linkedin: user.socials?.linkedin || "",
                photoFile: null,
                photoPreview: null,
                preferences: {
                    availability: user.preferences?.availability || [],
                    preferredRoles: user.preferences?.preferredRoles || [],
                    skills: user.preferences?.skills || [],
                    gender: user.preferences?.gender || "",
                    whatsapp: user.preferences?.whatsapp || "",
                },
                emergencyInfo: user.emergencyInfo || { contactName: "", contactPhone: "", bloodGroup: "", tShirtSize: "" },
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateAddressField = (addressType, field, value) => {
        setFormData(prev => ({
            ...prev,
            [addressType]: {
                ...prev[addressType],
                [field]: value
            }
        }));
    };

    const handleSameAddress = (e) => {
        setSameAddressChecked(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({
                ...prev,
                presentAddress: { ...prev.permanentAddress }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                presentAddress: {
                    building: "", street: "", area: "", city: "", state: "", pincode: "", country: ""
                }
            }));
        }
    };

    const handleSave = async () => {
        const wordCount = formData.bio.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount > 0 && wordCount < 20) {
            alert("About section must be at least 20 words.");
            return;
        }
        if (wordCount > 150) {
            alert("About section cannot exceed 150 words.");
            return;
        }

        setSaving(true);
        try {
            let photoUrl = user.photo;

            if (formData.photoFile) {
                const fileExt = formData.photoFile.name.split('.').pop();
                const fileName = `${user.emailID}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('profile')
                    .upload(fileName, formData.photoFile, { upsert: true });

                if (uploadError) {
                    console.error(uploadError);
                    return;
                }

                const { data: urlData } = supabase.storage
                    .from('profile')
                    .getPublicUrl(fileName);

                photoUrl = urlData.publicUrl;
            }

            const { error } = await supabase
                .schema('me_dataspace')
                .from('users')
                .update({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    address: {
                        permanentAddress: formData.permanentAddress,
                        presentAddress: formData.presentAddress
                    },
                    is_working: formData.status === 'working',
                    workspace_name: formData.workspaceName,
                    bio: formData.bio,
                    photo: photoUrl,
                    socials: {
                        instagram: formData.instagram,
                        github: formData.github,
                        linkedin: formData.linkedin,
                    },
                    preferences: formData.preferences,
                    emergencyInfo: formData.emergencyInfo
                })
                .eq('emailID', user.emailID);

            if (error) {
                console.error(error);
                return;
            }

            onUserUpdate({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: {
                    permanentAddress: formData.permanentAddress,
                    presentAddress: formData.presentAddress
                },
                is_working: formData.status === 'working',
                workspace_name: formData.workspaceName,
                bio: formData.bio,
                photo: photoUrl,
                socials: {
                    instagram: formData.instagram,
                    github: formData.github,
                    linkedin: formData.linkedin,
                },
                preferences: formData.preferences,
                emergencyInfo: formData.emergencyInfo
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            photoFile: file,
            photoPreview: URL.createObjectURL(file)
        }));
    };

    const bioWordCount = formData.bio.trim().split(/\s+/).filter(w => w.length > 0).length;

    return (
        <div className="fixed inset-0 bg-[#FAF7F2] z-50 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 md:p-12 w-full custom-scrollbar relative">
                
                {/* Close Button */}
                <button onClick={onClose} className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-[#A64200] hover:bg-orange-50 transition shadow-md border border-gray-100 z-50">
                    <FaTimes size={18} />
                </button>

                {/* Header Section */}
                <div className="mb-8 pt-2">
                    <div className="mb-6">
                        <h2 className="text-4xl font-extrabold text-[#7A3A00] tracking-tight">{translations.profile.editProfile[language]}</h2>
                        <p className="text-sm text-[#8A7060] mt-1 font-medium">Update your personal information, address, and preferences.</p>
                    </div>
                    
                    {/* Top Row: Photo & Basic Info */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Photo Upload */}
                        <div className="relative group cursor-pointer w-40 h-40 rounded-3xl border-4 border-white shadow-md overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                            {formData.photoPreview || user.photo ? (
                                <img
                                    src={formData.photoPreview || user.photo}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <FaUser className="text-6xl text-gray-300" />
                            )}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-sm">
                                <span className="text-sm font-semibold tracking-wide uppercase mt-1">{translations.profile.changePhoto[language] || 'Change Photo'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 w-full bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                            <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mb-4 pb-2 border-b border-orange-100">
                                {translations.profile.basicInfo[language]}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.firstName[language]}</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.lastName[language]}</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.phone[language]}</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Column */}
                        <div className="space-y-6">

                            {/* Work / Education Status */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                                <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mb-4 pb-2 border-b border-orange-100">
                                    {translations.profile.workEducation[language]}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#8A7060] mb-3 uppercase">{translations.profile.currentStatus[language]}</label>
                                        <div className="flex gap-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="working"
                                                    checked={formData.status === 'working'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                    className="w-4 h-4 text-[#A64200] focus:ring-[#A64200]"
                                                />
                                                <span className="text-sm font-semibold text-gray-700">{translations.profile.working[language]}</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="student"
                                                    checked={formData.status === 'student'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                    className="w-4 h-4 text-[#A64200] focus:ring-[#A64200]"
                                                />
                                                <span className="text-sm font-semibold text-gray-700">{translations.profile.student[language]}</span>
                                            </label>
                                        </div>
                                    </div>
                                    {formData.status && (
                                        <div className="animate-fade-in">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">
                                                {formData.status === 'working' ? translations.profile.companyName[language] : translations.profile.collegeName[language]}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.workspaceName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, workspaceName: e.target.value }))}
                                                placeholder={formData.status === 'working' ? 'Enter company name' : 'Enter college name'}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                                <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mb-4 pb-2 border-b border-orange-100">
                                    {language === 'ml' ? 'മുൻഗണനകൾ' : 'Preferences & Personal details'}
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">Gender</label>
                                            <select
                                                value={formData.preferences.gender || ""}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    preferences: { ...prev.preferences, gender: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                                <option value="Prefer not to say">Prefer not to say</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">WhatsApp Number</label>
                                            <input
                                                type="text"
                                                value={formData.preferences.whatsapp || ""}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    preferences: { ...prev.preferences, whatsapp: e.target.value }
                                                }))}
                                                placeholder="WhatsApp number"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{language === 'ml' ? 'ലഭ്യത (കോമ കൊണ്ട് തിരിക്കുക)' : 'Availability (comma separated)'}</label>
                                        <input
                                            type="text"
                                            value={formData.preferences.availability.join(', ')}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev, 
                                                preferences: { ...prev.preferences, availability: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                                            }))}
                                            placeholder="e.g. Weekends, Evenings"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{language === 'ml' ? 'താൽപ്പര്യമുള്ള റോളുകൾ (കോമ കൊണ്ട് തിരിക്കുക)' : 'Preferred Roles (comma separated)'}</label>
                                        <input
                                            type="text"
                                            value={formData.preferences.preferredRoles.join(', ')}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev, 
                                                preferences: { ...prev.preferences, preferredRoles: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                                            }))}
                                            placeholder="e.g. Marketing, On-ground"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#8A7060] mb-2 uppercase">Areas to Volunteer (Skills Checkboxes)</label>
                                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-xl border border-gray-200 custom-scrollbar">
                                            {SKILLS_OPTIONS.map((skill) => {
                                                const isChecked = formData.preferences.skills?.includes(skill) || false;
                                                return (
                                                    <label key={skill} className="flex items-start gap-2.5 cursor-pointer text-sm text-gray-700 hover:text-[#A64200] transition-colors py-0.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                const currentSkills = formData.preferences.skills || [];
                                                                const updatedSkills = e.target.checked
                                                                    ? [...currentSkills, skill]
                                                                    : currentSkills.filter(s => s !== skill);
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    preferences: { ...prev.preferences, skills: updatedSkills }
                                                                }));
                                                            }}
                                                            className="mt-0.5 w-4 h-4 text-[#A64200] rounded border-gray-300 focus:ring-[#A64200] cursor-pointer"
                                                        />
                                                        <span>{skill}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            
                            {/* Address Sections combined */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                                <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mb-4 pb-2 border-b border-orange-100">
                                    {translations.profile.permanentAddress[language]}
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.building[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.building}
                                                onChange={(e) => updateAddressField('permanentAddress', 'building', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.street[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.street}
                                                onChange={(e) => updateAddressField('permanentAddress', 'street', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.area[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.area}
                                                onChange={(e) => updateAddressField('permanentAddress', 'area', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.city[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.city}
                                                onChange={(e) => updateAddressField('permanentAddress', 'city', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.state[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.state}
                                                onChange={(e) => updateAddressField('permanentAddress', 'state', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.pincode[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.pincode}
                                                onChange={(e) => updateAddressField('permanentAddress', 'pincode', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.country[language]}</label>
                                            <input
                                                type="text"
                                                value={formData.permanentAddress.country}
                                                onChange={(e) => updateAddressField('permanentAddress', 'country', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mt-8 mb-4 pb-2 border-b border-orange-100 flex items-center justify-between">
                                    {translations.profile.presentAddress[language]}
                                    <label className="flex items-center gap-2 cursor-pointer normal-case text-xs font-semibold text-gray-500 bg-orange-50 px-3 py-1 rounded-lg">
                                        <input
                                            type="checkbox"
                                            checked={sameAddressChecked}
                                            onChange={handleSameAddress}
                                            className="w-3.5 h-3.5 text-[#A64200] rounded focus:ring-[#A64200]"
                                        />
                                        {translations.profile.sameAsPermanent[language]}
                                    </label>
                                </h3>
                                {!sameAddressChecked && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.building[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.building}
                                                    onChange={(e) => updateAddressField('presentAddress', 'building', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.street[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.street}
                                                    onChange={(e) => updateAddressField('presentAddress', 'street', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.area[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.area}
                                                    onChange={(e) => updateAddressField('presentAddress', 'area', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.city[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.city}
                                                    onChange={(e) => updateAddressField('presentAddress', 'city', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.state[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.state}
                                                    onChange={(e) => updateAddressField('presentAddress', 'state', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.pincode[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.pincode}
                                                    onChange={(e) => updateAddressField('presentAddress', 'pincode', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{translations.profile.country[language]}</label>
                                                <input
                                                    type="text"
                                                    value={formData.presentAddress.country}
                                                    onChange={(e) => updateAddressField('presentAddress', 'country', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Emergency Info */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                                <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mb-4 pb-2 border-b border-orange-100">
                                    {language === 'ml' ? 'അടിയന്തര വിവരങ്ങൾ' : 'Emergency & Logistics Info'}
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{language === 'ml' ? 'പേര്' : 'Emergency Contact Name'}</label>
                                            <input
                                                type="text"
                                                value={formData.emergencyInfo.contactName}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev, 
                                                    emergencyInfo: { ...prev.emergencyInfo, contactName: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{language === 'ml' ? 'ഫോൺ നമ്പർ' : 'Emergency Contact Phone'}</label>
                                            <input
                                                type="text"
                                                value={formData.emergencyInfo.contactPhone}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev, 
                                                    emergencyInfo: { ...prev.emergencyInfo, contactPhone: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{language === 'ml' ? 'രക്ത ഗ്രൂപ്പ്' : 'Blood Group'}</label>
                                            <input
                                                type="text"
                                                value={formData.emergencyInfo.bloodGroup}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev, 
                                                    emergencyInfo: { ...prev.emergencyInfo, bloodGroup: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{language === 'ml' ? 'ടി-ഷർട്ട് സൈസ്' : 'T-Shirt Size'}</label>
                                            <input
                                                type="text"
                                                value={formData.emergencyInfo.tShirtSize}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev, 
                                                    emergencyInfo: { ...prev.emergencyInfo, tShirtSize: e.target.value }
                                                }))}
                                                placeholder="S, M, L, XL"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bio - Full Width */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-orange-100">
                            <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider">
                                {translations.profile.about[language]}
                            </h3>
                            <span className={`text-xs font-bold ${bioWordCount > 150 || (bioWordCount > 0 && bioWordCount < 20) ? 'text-red-500' : 'text-gray-400'}`}>
                                {bioWordCount} / 150 words (Min: 20)
                            </span>
                        </div>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder={translations.profile.bioPlaceholder[language]}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 transition-colors font-medium text-gray-800 h-32 resize-none ${
                                bioWordCount > 150 || (bioWordCount > 0 && bioWordCount < 20) ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#A64200]'
                            }`}
                        />
                    </div>

                    {/* Socials - Full Width */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0e6d8]">
                        <h3 className="text-sm font-extrabold text-[#A64200] uppercase tracking-wider mb-4 pb-2 border-b border-orange-100">
                            {translations.profile.socials[language]}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {["github", "linkedin", "instagram"].map((platform) => (
                                <div key={platform}>
                                    <label className="block text-xs font-bold text-[#8A7060] mb-1.5 uppercase">{platform}</label>
                                    <input
                                        type="text"
                                        value={formData[platform]}
                                        onChange={(e) => setFormData(prev => ({ ...prev, [platform]: e.target.value }))}
                                        placeholder={`https://${platform}.com/...`}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 focus:border-[#A64200] transition-colors font-medium text-gray-800"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 pb-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            {translations.profile.cancel[language]}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-6 py-3.5 bg-[#A64200] text-white font-bold rounded-xl hover:bg-[#8B3600] disabled:opacity-70 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    {translations.profile.saving[language]}
                                </>
                            ) : (
                                translations.profile.saveChanges[language]
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
