import React from 'react';
import { translations } from "../translations";

const DonateModal = ({ isOpen, onClose, language }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-[#fdfbf5]">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#461711]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                        {translations.nav.donate[language]}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-[#461711]"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Iframe Container */}
                <div className="flex-1 overflow-y-auto bg-gray-50 relative">
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSfvZLRWbgQ4MChhlrEGEf3hAX57QfNEt6nl-6xX8zyOrVdRvg/viewform?embedded=true"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        className="w-full min-h-[500px]"
                        title="Donate for ME Form"
                    >
                        Loading…
                    </iframe>
                </div>

                {/* Footer / Instructions */}
                <div className="p-4 bg-white border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                        {language === 'ml' ? 'ഫോം സമർപ്പിച്ച ശേഷം, ഈ വിൻഡോ ക്ലോസ് ചെയ്യുക.' : 'After submitting the form, please close this window.'}
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#461711] text-white rounded-lg hover:bg-[#ff7612] transition-colors font-semibold shadow-md"
                    >
                        {language === 'ml' ? 'പൂർത്തിയായി / ക്ലോസ് ചെയ്യുക' : 'Done / Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonateModal;
