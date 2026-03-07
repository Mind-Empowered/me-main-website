import { useState } from "react";
import { translations } from "../translations";

const Contact = ({ language }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, subject, message } = formData;
        const mailtoLink = `mailto:Mindempowered2020@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="relative isolate px-4 md:px-0">
            <div className="absolute top-0 left-0 -z-10 w-[35%] h-[50%] bg-[#ffdb5b]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 -z-10 w-[25%] h-[40%] bg-[#ff7612]/5 rounded-full blur-2xl" />

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#461711]/5 text-[#461711] text-xs font-bold tracking-widest uppercase mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#461711]"></span>
                    Contact Us
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#461711] mb-4 leading-tight" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    {translations.faq.contactTitle[language]}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-5 rounded-full"></div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    {translations.faq.contactSubtitle[language]}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

                {/* Left: Social + Address */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-[#461711] mb-5" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            Find us on
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/company/mind-empowered/" target="_blank" rel="noopener noreferrer"
                                className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center"
                                aria-label="LinkedIn">
                                <svg className="w-6 h-6 text-[#461711] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://www.instagram.com/mind.empowered/" target="_blank" rel="noopener noreferrer"
                                className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center"
                                aria-label="Instagram">
                                <svg className="w-6 h-6 text-[#461711] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" />
                                </svg>
                            </a>
                            {/* Email */}
                            <a href="mailto:Mindempowered2020@gmail.com"
                                className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center"
                                aria-label="Email">
                                <svg className="w-6 h-6 text-[#461711] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                            {/* Location */}
                            <a href="https://www.google.com/maps/search/?api=1&query=ERRA+34,+Elamana+Road,+Tripunithura,+Ernakulam,+Kerala+682301"
                                target="_blank" rel="noopener noreferrer"
                                className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center"
                                aria-label="Location">
                                <svg className="w-6 h-6 text-[#461711] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Address card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-[#ff7612]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                                <a href="mailto:Mindempowered2020@gmail.com" className="text-sm text-[#461711] font-semibold transition-colors">
                                    Mindempowered2020@gmail.com
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-[#ff7612]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                                <p className="text-sm text-gray-600 leading-snug">ERRA 34, Elamana Road,<br />Tripunithura, Ernakulam,<br />Kerala 682301</p>
                            </div>
                        </div>
                    </div>

                    {/* Google Map Embed */}
                    <div className="w-full h-64 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative group">
                        <iframe
                            title="Mind Empowered Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.941656828594!2d76.3312061!3d9.9387431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08739958997381%3A0x6bba92053f317b6a!2sElamana%20Rd%2C%20Thrippunithura%2C%20Ernakulam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1710150000000!5m2!1sen!2sin"
                            className="w-full h-full border-none grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="absolute inset-x-0 bottom-0 py-2 bg-[#461711]/10 backdrop-blur-sm flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-[10px] font-bold text-[#461711] uppercase tracking-widest">View on Larger Map</span>
                        </div>
                    </div>
                </div>

                {/* Right: Contact form */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff7612]/10 to-transparent rounded-bl-full" />
                        <h3 className="text-2xl font-bold text-[#461711] mb-8" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.faq.formTitle[language]}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formName[language]}</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formEmail[language]}</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formSubject[language]}</label>
                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formMessage[language]}</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all resize-none" />
                            </div>
                            <button type="submit"
                                className="w-full group relative overflow-hidden rounded-xl bg-[#461711] p-4 font-bold text-white transition-all shadow-lg shadow-orange-900/10"
                                style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {translations.faq.formButton[language]}
                                    <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
