import React, { useState } from 'react';

const socialLinks = [
    {
      href: "https://www.instagram.com/mind.empowered/",
      label: "Instagram",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" /></svg>
    },
    {
      href: "https://www.linkedin.com/company/mind-empowered/",
      label: "LinkedIn",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
    },
    {
      href: "mailto:Mindempowered2020@gmail.com",
      label: "Email",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75C0 3.784.784 3 1.75 3zM2.5 4.5v.815l9.5 6.333 9.5-6.333V4.5a.25.25 0 00-.25-.25H2.75a.25.25 0 00-.25.25zM2.5 19.5h19v-12.03l-9.532 6.355a.75.75 0 01-.936 0L2.5 7.47V19.5z" /></svg>
    }
];

const ContactUs = () => {
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
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
                        Get In Touch
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    We'd love to hear from you. Whether you have a question, feedback, or need support, feel free to reach out.
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#461711] mb-6 text-center">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full p-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-colors" />
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full p-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-colors" />
                        </div>
                        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required className="w-full p-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-colors" />
                        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows="5" className="w-full p-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-colors"></textarea>
                        <button type="submit" className="w-full rounded-lg text-white font-bold bg-[#461711] px-6 py-3 hover:bg-[#ff7612] transition-all duration-300 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            Send Message
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-base text-gray-600 mb-4">Or connect with us on social media:</p>
                        <div className="flex justify-center gap-6">
                            {socialLinks.map((link) => (
                                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ff7612] transition-all duration-300 transform hover:scale-110" aria-label={link.label}>
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;