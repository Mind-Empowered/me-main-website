import { FaAddressBook, FaHeartbeat, FaTshirt } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";

const EmergencyInfoSection = ({ user }) => {
    const { language } = useLanguage();

    const emergencyInfo = user?.emergencyInfo || {};

    return (
        <div className="bg-white rounded-2xl p-5 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-3 text-[#8A7060] line-clamp-1">
                {language === 'ml' ? 'പ്രധാന വിവരങ്ങൾ' : 'Vital Information'}
            </h2>
            <div className="space-y-4 flex-1">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                        <FaAddressBook className="text-[#E49E5F]" /> {language === 'ml' ? 'അടിയന്തര ബന്ധപ്പെടേണ്ട വ്യക്തി' : 'Emergency Contact'}
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {emergencyInfo.contactName ? (
                            <>
                                <p className="font-medium text-gray-800">{emergencyInfo.contactName}</p>
                                <p className="text-gray-600 text-sm mt-1">{emergencyInfo.contactPhone}</p>
                            </>
                        ) : (
                            <span className="text-gray-400 italic text-sm">{language === 'ml' ? 'വിവരങ്ങൾ ചേർത്തിട്ടില്ല' : 'Not provided'}</span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <FaHeartbeat className="text-[#E49E5F]" /> {language === 'ml' ? 'രക്ത ഗ്രൂപ്പ്' : 'Blood Group'}
                        </h3>
                        <p className="font-medium text-gray-800">
                            {emergencyInfo.bloodGroup || <span className="text-gray-400 italic font-normal text-sm">N/A</span>}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <FaTshirt className="text-[#E49E5F]" /> {language === 'ml' ? 'ടി-ഷർട്ട് സൈസ്' : 'T-Shirt Size'}
                        </h3>
                        <p className="font-medium text-gray-800">
                            {emergencyInfo.tShirtSize || <span className="text-gray-400 italic font-normal text-sm">N/A</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyInfoSection;
