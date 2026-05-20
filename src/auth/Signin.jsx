import { useState } from "react";
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Signin = () => {

    // form state
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    //validate form data
    const validate = () => {
        // format email validation properly
        if (!form.email.includes("@")) return 'Enter a valid email address';
        if (!form.password.trim()) return 'Password is required';
        return null; // No errors
    };

    const [error, setError] = useState(null); // State to hold validation error messages

    // Handle form submission
    const handleSubmit = (e) => {
        e?.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        console.log("Form is valid:", form);
    };

    return (
        <div className="relative flex h-screen overflow-hidden">
            {/* background gif */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landing-bg.gif')" }}
            ></div>
            {/* overlay */}
            <div className="absolute inset-0 bg-black/80"></div>
            {/* left panel */}
            <div className="relative z-10 w-1/2 p-6 pt-20">
                <img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
            </div>
            {/* right panel */}
            <div className="relative z-10 w-1/2 text-white flex items-center justify-center">
            
                {/* signin card */}
                <div className="bg-white/20 text-white p-10 rounded-xl w-full max-w-md flex flex-col gap-6">
                {/* back button */}
                            <button 
                                onClick={() => window.history.back()}
                                className="top-10 left-10 flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white transition"
                            >
                                <FaArrowLeft />
                                Back
                            </button>
                    {/* email field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            placeholder="Email"
                            className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* password field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            placeholder="Password"
                            className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* remember me checkbox and forgot password */}
                    <div className="flex items-center justify-between">
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
                            <p><Link to="/forgot-password" className="inline-block rounded px-2 py-1 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400">
                                Forgot your password?
                            </Link></p>
                        </div>
                    </div>
                    {/* error message */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {/* signin button */}
                    <div>
                        <button 
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">
                            Sign In
                        </button>
                    </div>
                    {/* or separator with lines */}
                    <div className="flex items-center gap-4">
                        <hr className="flex-1 border-t border-white/30" />
                        <span className="text-white/70">or</span>
                        <hr className="flex-1 border-t border-white/30" />
                    </div>
                    {/* google signin field */}
                    <div>
                        <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/20 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">
                            <FaGoogle /> Sign in with Google
                        </button>
                    </div>
                    {/* redirect to register page field */}
                    <div className="text-center flex flex-col gap-2">
                        <p>Don't have an account ?</p>
                        <p><Link to="/register" className="inline-block rounded px-2 py-1 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 ">
                            Create an account
                        </Link></p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signin;
