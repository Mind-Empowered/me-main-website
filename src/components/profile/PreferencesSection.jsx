import { FaClock, FaTags, FaUser, FaWhatsapp, FaCheckSquare } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";

const PreferencesSection = ({ user }) => {
    const { language } = useLanguage();

    const preferences = user?.preferences || {};

    return (
        <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
                {language === 'ml' ? 'മുൻഗണനകൾ' : 'Preferences'}
            </h2>
            <div className="space-y-4 flex-1">
                {preferences.gender && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                            <FaUser className="text-[#E49E5F]" /> {language === 'ml' ? 'ലിംഗഭേദം' : 'Gender'}
                        </h3>
                        <span className="text-gray-700 font-medium text-sm pl-6">
                            {preferences.gender}
                        </span>
                    </div>
                )}
                {preferences.whatsapp && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                            <FaWhatsapp className="text-[#E49E5F]" /> {language === 'ml' ? 'വാട്ട്‌സ്ആപ്പ് നമ്പർ' : 'WhatsApp Number'}
                        </h3>
                        <span className="text-gray-700 font-medium text-sm pl-6">
                            {preferences.whatsapp}
                        </span>
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                        <FaClock className="text-[#E49E5F]" /> {language === 'ml' ? 'ലഭ്യത' : 'Availability'}
                    </h3>
                    <div className="flex flex-wrap gap-2 pl-6">
                        {preferences.availability?.length > 0 ? (
                            preferences.availability.map((item, idx) => (
                                <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-100">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic text-sm">{language === 'ml' ? 'ലഭ്യത ചേർത്തിട്ടില്ല' : 'No availability added'}</span>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                        <FaTags className="text-[#E49E5F]" /> {language === 'ml' ? 'താൽപ്പര്യമുള്ള റോളുകൾ' : 'Preferred Roles'}
                    </h3>
                    <div className="flex flex-wrap gap-2 pl-6">
                        {preferences.preferredRoles?.length > 0 ? (
                            preferences.preferredRoles.map((role, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
                                    {role}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic text-sm">{language === 'ml' ? 'റോളുകൾ ചേർത്തിട്ടില്ല' : 'No roles added'}</span>
                        )}
                    </div>
                </div>
                {preferences.skills?.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <FaCheckSquare className="text-[#E49E5F]" /> {language === 'ml' ? 'മേഖലകൾ' : 'Areas of Interest'}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 pl-6">
                            {preferences.skills.map((skill, idx) => (
                                <span key={idx} className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md text-xs border border-emerald-100 font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreferencesSection;
