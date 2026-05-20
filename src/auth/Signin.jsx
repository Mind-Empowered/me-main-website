import { FaGoogle } from "react-icons/fa";


const Signin = () => {
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
                    {/* email field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Email address</label>
                        <input type="email" placeholder="Email"
                        className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* password field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Password</label>
                        <input type="password" placeholder="Password"
                        className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* remember me checkbox and forgot password */}
                    <div className="flex items-center justify-between">
                        {/* remember me */}
                        <div>
                            <input type="checkbox" id="remember" 
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        {/* forgot password */}
                        <div>
                            <p><a href="/forgot-password" className="text-white hover:underline">
                                Forgot your password?
                            </a></p>
                        </div>
                    </div>
                    {/* signin button */}
                    <div>
                        <button className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">
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
                            <FaGoogle/> Sign in with Google
                        </button>
                    </div>
                    {/* redirect to register page field */}
                    <div className="text-center flex flex-col gap-2">
                        <p>Don't have an account ?</p>
                        <p><a href="/register" className="text-white hover:underline">
                            Create an account
                        </a></p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signin;
