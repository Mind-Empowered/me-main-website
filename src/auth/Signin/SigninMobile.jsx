import { Link } from "react-router-dom";
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";


const SigninMobile = ({ form, setForm, error, handleSubmit }) => {
    const [step, setStep] = useState(1);//track current step
    return (
        <>
            {step === 1 && (
                <div className="relative bg-[url('/mobile.png')] bg-cover bg-center min-h-screen w-full flex flex-col items-center justify-between py-20 ">
                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <h1 className="relative z-10 text-5xl font-bold text-center bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight pt-28">MIND EMPOWERED</h1>
                    <button
                        onClick={() => setStep(2)}
                        className="relative z-10 w-2/3 rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white font-medium">Sign In</button>
                </div>
            )}
            {step === 2 && (
                <div className="h-screen flex flex-col">
                    {/* top panel */}
                    <div className="relative w-full h-1/4 overflow-hidden">
                        <img src="/mobile.png" alt="" className="w-full h-full object-cover " />
                        {/* curve */}
                        <div className="absolute -bottom-12 left-0 w-full h-24 bg-white rounded-l-[100%]" />
                    </div>
                    {/* signin form */}
                    <div className="bg-white  w-full h-3/4 px-10 py-5 flex flex-col gap-2 text-[#A64200]">
                        {/* heading */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight">Sign In</h1>
                        {/* email field */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                placeholder="Your email address"
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
                        {/* remember me checkbox and forgot password */}
                        <div>
                            {/* remember me */}
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={form.rememberMe}
                                    onChange={(e) => setForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                    className="inline-block rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            {/* forgot password */}
                            <div>
                                <p><Link to="/forgot-password" className="inline-block rounded px-2 py-1  hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400">
                                    Forgot your password?
                                </Link></p>
                            </div>
                        </div>
                        {/* error message */}
                        {error && (
                            <div className="text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        {/* signin button */}
                        <div>
                            <button
                                className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                                onClick={handleSubmit}
                            >
                                Sign In
                            </button>
                        </div>
                        {/* or separator with lines */}
                        <div className="flex items-center gap-4">
                            <hr className="flex-1 border-t border-black" />
                            <span className="">or</span>
                            <hr className="flex-1 border-t border-black" />
                        </div>
                        {/* google signin field */}
                        <div>
                            <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/20 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">
                                <FaGoogle /> Sign in with Google
                            </button>
                        </div>
                        {/* redirect to register page field */}
                        <div className="text-center flex flex-col gap-2">
                            <p><Link to="/register" className="inline-block rounded px-2 py-1  hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 ">
                                Don't have an account ? <span className="text-[#F0B04C]">Sign Up</span>
                            </Link></p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SigninMobile;



