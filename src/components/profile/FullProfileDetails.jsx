import { FaMapMarkerAlt, FaBriefcase, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const FullProfileDetails = ({ user, onEditClick }) => {
    const { language } = useLanguage();
    return (
        <div className="space-y-8 pb-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7A4310] to-[#E49E5F] text-white rounded-3xl p-8">
                <div className="flex gap-6 items-start">
                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
                        {user.photo ? (
                            <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-6xl">👤</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
                        <p className="text-white/90 mb-1">{user.emailID}</p>
                        <p className="text-white/90 mb-4">📞 {user.phone}</p>
                        <span className="inline-block px-4 py-2 bg-white text-[#7A3A00] rounded-full font-semibold">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-[#1A0D00] mb-4">{translations.profile.about[language]}</h2>
                {user.bio ? (
                    <p className="text-gray-700 leading-relaxed text-lg">{user.bio}</p>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider">Not provided yet</p>
                        <button onClick={onEditClick} className="px-6 py-2 bg-[#FAF6F1] text-[#7A3A00] rounded-full font-semibold hover:bg-[#E0D4C4] transition border border-[#E0D4C4]">
                            Add Bio
                        </button>
                    </div>
                )}
            </div>

            {/* Work/Education */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <FaBriefcase className="text-3xl text-[#7A3A00]" />
                    <h2 className="text-2xl font-bold text-[#1A0D00]">
                        {translations.profile.workEducation?.[language] || "Work / Education"}
                    </h2>
                </div>
                {user.workspace_name ? (
                    <>
                        <p className="text-gray-600 mb-2 text-sm uppercase">
                            {user.is_working ? translations.profile.companyName[language] : translations.profile.collegeName[language]}
                        </p>
                        <p className="text-3xl font-bold text-[#7A3A00]">{user.workspace_name}</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider">Not provided yet</p>
                        <button onClick={onEditClick} className="px-6 py-2 bg-[#FAF6F1] text-[#7A3A00] rounded-full font-semibold hover:bg-[#E0D4C4] transition border border-[#E0D4C4]">
                            Add Work / Education
                        </button>
                    </div>
                )}
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-[#1A0D00] mb-6">Addresses</h2>
                {(user.address?.permanentAddress?.building || user.address?.presentAddress?.building) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {user.address?.permanentAddress?.building && (
                            <div className="bg-gradient-to-br from-[#FAF6F1] to-[#F5EDE0] p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaMapMarkerAlt className="text-2xl text-[#7A3A00]" />
                                    <h3 className="font-bold text-[#1A0D00]">{translations.profile.permanentAddress[language]}</h3>
                                </div>
                                <div className="text-gray-700 space-y-1">
                                    <p className="font-semibold">{user.address.permanentAddress.building}</p>
                                    <p>{user.address.permanentAddress.street}</p>
                                    <p>{user.address.permanentAddress.area}</p>
                                    <p className="font-semibold">
                                        {user.address.permanentAddress.city}, {user.address.permanentAddress.state}
                                    </p>
                                    <p>
                                        {user.address.permanentAddress.pincode}
                                    </p>
                                    <p>{user.address.permanentAddress.country}</p>
                                </div>
                            </div>
                        )}

                        {user.address?.presentAddress?.building && (
                            <div className="bg-gradient-to-br from-[#FAF6F1] to-[#F5EDE0] p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaMapMarkerAlt className="text-2xl text-[#7A3A00]" />
                                    <h3 className="font-bold text-[#1A0D00]">{translations.profile.presentAddress[language]}</h3>
                                </div>
                                <div className="text-gray-700 space-y-1">
                                    <p className="font-semibold">{user.address.presentAddress.building}</p>
                                    <p>{user.address.presentAddress.street}</p>
                                    <p>{user.address.presentAddress.area}</p>
                                    <p className="font-semibold">
                                        {user.address.presentAddress.city}, {user.address.presentAddress.state}
                                    </p>
                                    <p>
                                        {user.address.presentAddress.pincode}
                                    </p>
                                    <p>{user.address.presentAddress.country}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider">Not provided yet</p>
                        <button onClick={onEditClick} className="px-6 py-2 bg-[#FAF6F1] text-[#7A3A00] rounded-full font-semibold hover:bg-[#E0D4C4] transition border border-[#E0D4C4]">
                            Add Addresses
                        </button>
                    </div>
                )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-[#1A0D00] mb-6">{translations.profile.socials[language]}</h2>
                {(user.socials?.github || user.socials?.linkedin || user.socials?.instagram) ? (
                    <div className="flex gap-4 flex-wrap">
                        {user.socials?.github && (
                            <a
                                href={user.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-[#333] text-white rounded-lg hover:bg-[#555] transition font-semibold"
                            >
                                <FaGithub className="text-2xl" />
                                GitHub
                            </a>
                        )}
                        {user.socials?.linkedin && (
                            <a
                                href={user.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition font-semibold"
                            >
                                <FaLinkedin className="text-2xl" />
                                LinkedIn
                            </a>
                        )}
                        {user.socials?.instagram && (
                            <a
                                href={user.socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#F58529] to-[#DD2A7B] text-white rounded-lg hover:opacity-90 transition font-semibold"
                            >
                                <FaInstagram className="text-2xl" />
                                Instagram
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider">Not provided yet</p>
                        <button onClick={onEditClick} className="px-6 py-2 bg-[#FAF6F1] text-[#7A3A00] rounded-full font-semibold hover:bg-[#E0D4C4] transition border border-[#E0D4C4]">
                            Add Social Links
                        </button>
                    </div>
                )}
            </div>

            {/* Preferences & Interests */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
                <h2 className="text-2xl font-bold text-[#1A0D00] mb-6">Preferences & Volunteer Interests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preferences Details */}
                    <div className="space-y-4">
                        {user.preferences?.gender && (
                            <p className="text-gray-700">
                                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider block mb-1">Gender</span> 
                                <span className="text-lg font-medium">{user.preferences.gender}</span>
                            </p>
                        )}
                        {user.preferences?.whatsapp && (
                            <p className="text-gray-700">
                                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider block mb-1">WhatsApp Number</span> 
                                <span className="text-lg font-medium">📞 {user.preferences.whatsapp}</span>
                            </p>
                        )}
                        <div>
                            <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider block mb-1">Availability</span>
                            {user.preferences?.availability?.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user.preferences.availability.map((item, idx) => (
                                        <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-100">{item}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400 italic text-sm">No availability specified</span>
                            )}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider block mb-1">Preferred Roles</span>
                            {user.preferences?.preferredRoles?.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user.preferences.preferredRoles.map((role, idx) => (
                                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">{role}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400 italic text-sm">No preferred roles specified</span>
                            )}
                        </div>
                    </div>

                    {/* Predefined Skills Checkboxes */}
                    <div>
                        <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider block mb-2">Volunteer Skills & Interests</span>
                        {user.preferences?.skills?.length > 0 ? (
                            <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-60 overflow-y-auto">
                                {user.preferences.skills.map((skill, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                                        <span className="text-emerald-500 font-bold">✓</span>
                                        <span className="font-medium">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-400 italic text-sm">No areas selected</span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FullProfileDetails;