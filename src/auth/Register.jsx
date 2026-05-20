import { useState } from "react";

const Register = () => {

	// form state
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: ""
	});

	// Function to validate the form data before submission
	const validate = () => {
		// format email validation properly
		if (!form.firstName.trim()) return 'First name is required';
		if (!form.lastName.trim()) return 'Last name is required';
		if (!form.email.includes("@")) return 'Enter a valid email address';
		if (!form.phone.trim()) return 'Phone number is required';
		const password = form.password.trim();
		const confirmPassword = form.confirmPassword.trim();
		if (password.length < 8) return 'Password must be at least 8 characters long';
		if (password !== confirmPassword) return 'Passwords do not match';
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
			<div className="relative z-10 w-2/5 p-6 pt-20">
				<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
			</div>
			{/* right panel */}
			<div className="relative z-10 flex w-3/5 flex-col items-start justify-center gap-6 p-20  bg-white/20 text-white overflow-visible">

				{/* heading */}
				<h1 className="text-6xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight">Registration</h1>

				{/* add back button */}

				{/* name container */}
				<div className="flex gap-4 w-full">
					{/* first name */}
					<div className="flex flex-col gap-2 w-full">
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							name="firstName"
							id="firstName"
							value={form.firstName}
							onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
							placeholder="Your first name"
							className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
					</div>
					{/* last name */}
					<div className="flex flex-col gap-2 w-full">
						<label htmlFor="lastName">Last Name</label>
						<input
							id="lastName"
							type="text"
							name="lastName"
							value={form.lastName}
							onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
							placeholder="Your last name"
							className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
					</div>
				</div>

				{/* email address container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="email">Email address</label>
					<input
						type="email"
						name="email"
						id="email"
						value={form.email}
						onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
						placeholder="Your email"
						className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* phone number container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="phone">Phone Number</label>
					<input
						type="text"
						name="phone"
						id="phone"
						value={form.phone}
						onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
						placeholder="Your phone number"
						className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* password container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						value={form.password}
						onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
						placeholder="Create a password"
						className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* confirm password container */}
				<div className="w-full flex flex-col gap-2">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						value={form.confirmPassword}
						onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
						placeholder="Confirm your password"
						className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
				</div>

				{/* form error message */}
				{error && <p className="text-red-400 text-sm">{error}</p>}

				{/* register button */}
				<button
					onClick={handleSubmit}
					className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">Register</button>
			</div>
		</div>
	);

};

export default Register;