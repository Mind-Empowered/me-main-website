import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaUser, FaSeedling, FaInstagram, FaGithub, FaLinkedin, FaTimes } from "react-icons/fa";

const ProfileCard = ({ user, onUserUpdate, onViewMore }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        permanentAddress: user.address?.permanentAddress || {
            building: "",
            street: "",
            area: "",
            city: "",
            state: "",
            pincode: "",
            country: ""
        },
        presentAddress: user.address?.presentAddress || {
            building: "",
            street: "",
            area: "",
            city: "",
            state: "",
            pincode: "",
            country: ""
        },
        status: user.is_working !== undefined ? (user.is_working ? 'working' : 'student') : "",
        workspaceName: user.workspace_name || "",
        bio: user.bio || "",
        instagram: user.socials?.instagram || "",
        github: user.socials?.github || "",
        linkedin: user.socials?.linkedin || "",
        photoFile: null,
        photoPreview: null,
    });
    const [saving, setSaving] = useState(false);
    const [sameAddressChecked, setSameAddressChecked] = useState(false);

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
                    building: "",
                    street: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: ""
                }
            }));
        }
    };

    const handleSave = async () => {
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
                    }
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
                }
            });
            setIsEditOpen(false);
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

    useEffect(() => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            permanentAddress: user.address?.permanentAddress || {
                building: "",
                street: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                country: ""
            },
            presentAddress: user.address?.presentAddress || {
                building: "",
                street: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                country: ""
            },
            status: user.is_working !== undefined ? (user.is_working ? 'working' : 'student') : "",
            workspaceName: user.workspace_name || "",
            bio: user.bio || "",
            instagram: user.socials?.instagram || "",
            github: user.socials?.github || "",
            linkedin: user.socials?.linkedin || "",
            photoFile: null,
            photoPreview: null,
        });
    }, [user]);

    return (
        <>
            <div className="bg-gradient-to-r from-[#7A4310] to-[#E49E5F] text-white rounded-3xl p-12 flex items-start justify-between">
                {/* Left: Avatar + Info */}
                <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white flex-shrink-0 bg-white/20 flex items-center justify-center">
                        {user.photo ? (
                            <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <FaUser className="text-2xl" />
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-white/80">{user.emailID}</p>
                        <div>
                            <span className="inline-block mt-2 px-3 py-1 bg-white text-[#7A3A00] rounded-full text-sm">
                                <FaSeedling className="inline text-green-500" /> {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex flex-col gap-4">
                    {/* View More Button */}
                    <button
                        onClick={onViewMore}
                        className="px-4 py-2 border border-white rounded-full text-sm font-semibold hover:bg-white/20 transition"
                    >
                        View More
                    </button>
                    
                    {/* Edit Profile Button */}
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="px-4 py-2 border border-white rounded-full text-sm font-semibold hover:bg-white/20 transition"
                    >
                        Edit Profile
                    </button>
                    
                    {/* Social Links */}
                    <div className="flex gap-4 mt-2 justify-between">
                        {user.socials?.instagram && (
                            <a
                                href={user.socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition"
                            >
                                <FaInstagram className="text-2xl cursor-pointer" />
                            </a>
                        )}
                        {user.socials?.github && (
                            <a
                                href={user.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition"
                            >
                                <FaGithub className="text-2xl cursor-pointer" />
                            </a>
                        )}
                        {user.socials?.linkedin && (
                            <a
                                href={user.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition"
                            >
                                <FaLinkedin className="text-2xl cursor-pointer" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
                        {/* Photo Upload */}
                        <div className="flex flex-col items-center gap-3 mb-6">
                            <div className="w-20 h-20 rounded-full border-4 border-[#F5EDE0] overflow-hidden bg-gray-100 flex items-center justify-center">
                                {formData.photoPreview || user.photo ? (
                                    <img
                                        src={formData.photoPreview || user.photo}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-2xl text-gray-400" />
                                )}
                            </div>
                            <label className="cursor-pointer text-sm text-[#A64200] font-semibold hover:underline">
                                Change Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#A64200]">Edit Profile</h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-black">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic Info</p>
                                <div className="flex gap-3 mb-3">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>
                            </div>

                            {/* Permanent Address */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Permanent Address</p>
                                
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Building / House Name or Number</label>
                                    <input
                                        type="text"
                                        value={formData.permanentAddress.building}
                                        onChange={(e) => updateAddressField('permanentAddress', 'building', e.target.value)}
                                        placeholder="Building name or number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Street / Road Name</label>
                                    <input
                                        type="text"
                                        value={formData.permanentAddress.street}
                                        onChange={(e) => updateAddressField('permanentAddress', 'street', e.target.value)}
                                        placeholder="Street or road name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Area / Locality</label>
                                    <input
                                        type="text"
                                        value={formData.permanentAddress.area}
                                        onChange={(e) => updateAddressField('permanentAddress', 'area', e.target.value)}
                                        placeholder="Area or locality"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">City</label>
                                        <input
                                            type="text"
                                            value={formData.permanentAddress.city}
                                            onChange={(e) => updateAddressField('permanentAddress', 'city', e.target.value)}
                                            placeholder="City"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">State</label>
                                        <input
                                            type="text"
                                            value={formData.permanentAddress.state}
                                            onChange={(e) => updateAddressField('permanentAddress', 'state', e.target.value)}
                                            placeholder="State"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">PIN Code</label>
                                        <input
                                            type="text"
                                            value={formData.permanentAddress.pincode}
                                            onChange={(e) => updateAddressField('permanentAddress', 'pincode', e.target.value)}
                                            placeholder="PIN code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={formData.permanentAddress.country}
                                            onChange={(e) => updateAddressField('permanentAddress', 'country', e.target.value)}
                                            placeholder="Country"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Present Address */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Present Address</p>
                                
                                <div className="mb-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={sameAddressChecked}
                                            onChange={handleSameAddress}
                                            className="w-4 h-4 rounded cursor-pointer accent-[#A64200]"
                                        />
                                        <span className="text-sm font-semibold text-[#8A7060]">Same as Permanent Address</span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Building / House Name or Number</label>
                                    <input
                                        type="text"
                                        value={formData.presentAddress.building}
                                        onChange={(e) => updateAddressField('presentAddress', 'building', e.target.value)}
                                        placeholder="Building name or number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Street / Road Name</label>
                                    <input
                                        type="text"
                                        value={formData.presentAddress.street}
                                        onChange={(e) => updateAddressField('presentAddress', 'street', e.target.value)}
                                        placeholder="Street or road name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Area / Locality</label>
                                    <input
                                        type="text"
                                        value={formData.presentAddress.area}
                                        onChange={(e) => updateAddressField('presentAddress', 'area', e.target.value)}
                                        placeholder="Area or locality"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">City</label>
                                        <input
                                            type="text"
                                            value={formData.presentAddress.city}
                                            onChange={(e) => updateAddressField('presentAddress', 'city', e.target.value)}
                                            placeholder="City"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">State</label>
                                        <input
                                            type="text"
                                            value={formData.presentAddress.state}
                                            onChange={(e) => updateAddressField('presentAddress', 'state', e.target.value)}
                                            placeholder="State"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">PIN Code</label>
                                        <input
                                            type="text"
                                            value={formData.presentAddress.pincode}
                                            onChange={(e) => updateAddressField('presentAddress', 'pincode', e.target.value)}
                                            placeholder="PIN code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={formData.presentAddress.country}
                                            onChange={(e) => updateAddressField('presentAddress', 'country', e.target.value)}
                                            placeholder="Country"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Work / Education Status */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Work / Education</p>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-2">Current Status</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="working"
                                                checked={formData.status === 'working'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                className="w-4 h-4 cursor-pointer accent-[#A64200]"
                                            />
                                            <span className="text-sm text-[#8A7060]">Working</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="student"
                                                checked={formData.status === 'student'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                className="w-4 h-4 cursor-pointer accent-[#A64200]"
                                            />
                                            <span className="text-sm text-[#8A7060]">Student</span>
                                        </label>
                                    </div>
                                </div>

                                {formData.status && (
                                    <div>
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1">
                                            {formData.status === 'working' ? 'Company Name' : 'College Name'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.workspaceName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, workspaceName: e.target.value }))}
                                            placeholder={formData.status === 'working' ? 'Enter company name' : 'Enter college name'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">About</p>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200] h-28 resize-none"
                                />
                            </div>

                            {/* Socials */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Socials</p>
                                {["github", "linkedin", "instagram"].map((platform) => (
                                    <div key={platform} className="mb-3">
                                        <label className="block text-sm font-semibold text-[#8A7060] mb-1 capitalize">{platform}</label>
                                        <input
                                            type="text"
                                            value={formData[platform]}
                                            onChange={(e) => setFormData(prev => ({ ...prev, [platform]: e.target.value }))}
                                            placeholder={`https://${platform}.com/...`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-[#A64200] text-white rounded-lg hover:bg-[#8B3600] disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileCard;
