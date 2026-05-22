import { Link } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";


const RegistrationMobile = ({ form, setForm, error, handleSubmit }) => {

    const [step, setStep] = useState(1);//track current step of registration

    const [localError, setLocalError] = useState(null);

    const validateStep1 = () => {
        if (!form.email.includes('@')) return 'Enter a valid email';
        if (form.password.length < 8) return 'Password must be at least 8 characters';
        if (form.password !== form.confirmPassword) return 'Passwords do not match';
        return null;
    };

    const handleNext = () => {
        const validationError = validateStep1();
        if (validationError) {
            setLocalError(validationError);
            return;
        }
        setLocalError(null);
        setStep(2);
    };


    return (
        <>
            <div className="h-screen flex flex-col">
                {/* top panel */}
                <div className="relative w-full h-1/2 overflow-hidden">
                    <img src="/mobile.png" alt="" className="w-full h-full object-cover " />
                    <div className="absolute -bottom-12 left-0 w-full h-24 bg-white rounded-l-[100%]" />
                </div>
                {/* first form */}
                {step === 1 && (
                    <div className="bg-white w-full h-2/3 px-10 py-5 flex flex-col gap-4 text-[#A64200]">
                        {/* heading */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight">Registration</h1>
                        {/* email field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))} placeholder="Your email address"
                                className="w-full rounded-xl bg-[#F5EFE6] px-4 py-2 placeholder-black/20 outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>
                        {/* password field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                placeholder="Your password"
                                className="w-full rounded-xl bg-[#F5EFE6] px-4 py-2 placeholder-black/20 outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>
                        {/* confirm password field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                placeholder="Confirm your password"
                                className="w-full rounded-xl bg-[#F5EFE6] px-4 py-2 placeholder-black/20 outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>

                        {/* form error message */}
                        {localError && <p className="text-red-400 text-sm">{localError}</p>}

                        {/* next button */}
                        <div>
                            <button
                                onClick={() => handleNext()}
                                className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white font-medium">
                                Next
                            </button>
                        </div>
                        {/* redirect to signin page */}
                        <div>
                            <p className="text-center">Already have an account? <Link to="/signin">Login</Link></p>
                        </div>
                    </div>
                )}
                {/* second form */}
                {step === 2 && (
                    <div className="bg-white w-full h-3/4 px-10 py-5 flex flex-col gap-4 text-[#A64200]">
                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-[#A64200]">
                            <FaArrowLeft /> Back
                        </button>
                        {/* heading */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight">Registration</h1>
                        {/* first name field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                placeholder="Your first name"
                                className="w-full rounded-xl bg-[#F5EFE6] px-4 py-2 placeholder-black/20 outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>
                        {/* last name field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={form.lastName}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                placeholder="Your last name"
                                className="w-full rounded-xl bg-[#F5EFE6] px-4 py-2 placeholder-black/20 outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>
                        {/* phone number field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={form.phone}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                placeholder="Your phone number"
                                className="w-full rounded-xl bg-[#F5EFE6] px-4 py-2 placeholder-black/20 outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>

                        {/* form error message */}
                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        {/* register button */}
                        <div>
                            <button
                                onClick={handleSubmit}
                                className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white font-medium">
                                Register
                            </button>
                        </div>
                        {/* redirect to signin page */}
                        <div>
                            <p className="text-center">Already have an account? <Link to="/signin">Login</Link></p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RegistrationMobile;