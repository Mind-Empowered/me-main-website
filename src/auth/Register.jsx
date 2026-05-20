const Register = () => {
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
			<div className="relative z-10 w-2/5 p-6 pt-20">
				<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
			</div>
			{/* right panel */}
			<div className="relative z-10 flex w-3/5 flex-col items-start justify-center gap-6 p-20  bg-white/20 text-white">

				{/* heading */}
				<h1 className="text-6xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent">Registration</h1>

				{/* name container */}
				<div className="flex gap-4 w-full">
					<div className="flex flex-col gap-2 w-full">
						<label htmlFor="">First Name</label>
						<input type="text" placeholder="Your first name" className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
					</div>
					<div className="flex flex-col gap-2 w-full">
						<label htmlFor="">Last Name</label>
						<input type="text" placeholder="Your last name" className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
					</div>
				</div>

				{/* email address container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="">Email address</label>
					<input type="email" placeholder="Your email" className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* phone number container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="">Phone Number</label>
					<input type="text" placeholder="Your phone number" className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* password container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="">Password</label>
					<input type="password" placeholder="Create a password" className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* confirm password container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="">Confirm Password</label>
					<input type="password" placeholder="Confirm your password" className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* register button */}
				<button className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">Register</button>
			</div>
		</div>
	);

}

export default Register;