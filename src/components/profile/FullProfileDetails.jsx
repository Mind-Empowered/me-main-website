import { FaMapMarkerAlt, FaBriefcase, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const FullProfileDetails = ({ user }) => {
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
            {user.bio && (
                <div className="bg-white rounded-2xl p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-[#1A0D00] mb-4">About Me</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{user.bio}</p>
                </div>
            )}

            {/* Work/Education */}
            {user.workspace_name && (
                <div className="bg-white rounded-2xl p-8 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <FaBriefcase className="text-3xl text-[#7A3A00]" />
                        <h2 className="text-2xl font-bold text-[#1A0D00]">
                            {user.is_working ? 'Work' : 'Education'}
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm uppercase">
                        {user.is_working ? 'Company' : 'College/University'}
                    </p>
                    <p className="text-3xl font-bold text-[#7A3A00]">{user.workspace_name}</p>
                </div>
            )}

            {/* Addresses */}
            {(user.address?.permanentAddress?.building || user.address?.presentAddress?.building) && (
                <div className="bg-white rounded-2xl p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-[#1A0D00] mb-6">Addresses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {user.address?.permanentAddress?.building && (
                            <div className="bg-gradient-to-br from-[#FAF6F1] to-[#F5EDE0] p-6 rounded-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaMapMarkerAlt className="text-2xl text-[#7A3A00]" />
                                    <h3 className="font-bold text-[#1A0D00]">Permanent Address</h3>
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
                                    <h3 className="font-bold text-[#1A0D00]">Present Address</h3>
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
                </div>
            )}

            {/* Social Links */}
            {(user.socials?.github || user.socials?.linkedin || user.socials?.instagram) && (
                <div className="bg-white rounded-2xl p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-[#1A0D00] mb-6">Connect With Me</h2>
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
                </div>
            )}

        </div>
    );
};

export default FullProfileDetails;