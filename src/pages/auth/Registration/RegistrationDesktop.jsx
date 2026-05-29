import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RegistrationDesktop = ({ form, setForm, error, handleSubmit, onRegisterStep5 }) => {

	const [step, setStep] = useState(1);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [photoFile, setPhotoFile] = useState(null);
	const [localError, setLocalError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const snackbarTimeoutRef = useRef(null);

	const showSnackbar = (message) => {
		setSnackbarMessage(message);

		if (snackbarTimeoutRef.current) {
			clearTimeout(snackbarTimeoutRef.current);
		}

		snackbarTimeoutRef.current = window.setTimeout(() => {
			setSnackbarMessage(null);
		}, 4000);
	};

	useEffect(() => {
		return () => {
			if (snackbarTimeoutRef.current) {
				clearTimeout(snackbarTimeoutRef.current);
			}
		};
	}, []);

	// Step 1 Validation
	const validateStep1 = () => {
		if (!form.firstName.trim()) return 'First name is required';
		if (!form.lastName.trim()) return 'Last name is required';
		if (!form.email.includes("@")) return 'Enter a valid email address';
		if (!form.phone.trim()) return 'Phone number is required';

		const phoneDigitsOnly = form.phone.replace(/\D/g, '');
		if (phoneDigitsOnly.length < 10) return 'Phone number must have at least 10 digits';
		if (phoneDigitsOnly.length > 10) return 'Phone number must not exceed 10 digits';

		const password = form.password.trim();
		const confirmPassword = form.confirmPassword.trim();

		if (password.length < 8) return 'Password must be at least 8 characters long';
		if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
		if (!/[0-9]/.test(password)) return 'Password must contain at least one digit';
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';

		if (password !== confirmPassword) return 'Passwords do not match';
		return null;
	};

	// Step 2 Validation - Permanent Address
	const validateStep2 = () => {
		if (!form.permanentAddress.building?.trim()) return 'Building name or number is required';
		if (!form.permanentAddress.street?.trim()) return 'Street name is required';
		if (!form.permanentAddress.area?.trim()) return 'Area or locality is required';
		if (!form.permanentAddress.city?.trim()) return 'City is required';
		if (!form.permanentAddress.state?.trim()) return 'State is required';
		if (!form.permanentAddress.pincode?.trim()) return 'PIN code is required';
		if (!form.permanentAddress.country?.trim()) return 'Country is required';
		return null;
	};

	// Step 3 Validation - Present Address
	const validateStep3 = () => {
		if (!form.presentAddress.building?.trim()) return 'Building name or number is required';
		if (!form.presentAddress.street?.trim()) return 'Street name is required';
		if (!form.presentAddress.area?.trim()) return 'Area or locality is required';
		if (!form.presentAddress.city?.trim()) return 'City is required';
		if (!form.presentAddress.state?.trim()) return 'State is required';
		if (!form.presentAddress.pincode?.trim()) return 'PIN code is required';
		if (!form.presentAddress.country?.trim()) return 'Country is required';
		return null;
	};

	// Step 4 Validation - Work/Education Status
	const validateStep4 = () => {
		if (!form.status) return 'Please select if you are working or a student';
		if (form.status === 'working' && !form.workspaceName?.trim()) return 'Company name is required';
		if (form.status === 'student' && !form.workspaceName?.trim()) return 'College name is required';
		return null;
	};

	// Step 5 Validation - Profile Completion
	const validateStep5 = () => {
		if (!photoFile) return 'Please upload a profile photo';

		if (form.github?.trim()) {
			if (!form.github.includes('github.com')) return 'Please enter a valid GitHub profile URL (must include github.com)';
			try {
				new URL(form.github);
			} catch (e) {
				return 'Please enter a valid GitHub profile URL';
			}
		}

		if (form.linkedin?.trim()) {
			if (!form.linkedin.includes('linkedin.com')) return 'Please enter a valid LinkedIn profile URL (must include linkedin.com)';
			try {
				new URL(form.linkedin);
			} catch (e) {
				return 'Please enter a valid LinkedIn profile URL';
			}
		}

		return null;
	};

	const handleNext = () => {
		let validationError;

		switch (step) {
			case 1:
				validationError = validateStep1();
				break;
			case 2:
				validationError = validateStep2();
				break;
			case 3:
				validationError = validateStep3();
				break;
			case 4:
				validationError = validateStep4();
				break;
			default:
				validationError = null;
		}

		if (validationError) {
			setLocalError(validationError);
			showSnackbar(validationError);
			return;
		}

		setLocalError(null);
		setStep(step + 1);
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPhotoFile(file);
			const reader = new FileReader();
			reader.onload = (event) => {
				setPhotoPreview(event.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerPhotoUpload = () => {
		document.getElementById("photoInput").click();
	};

	const handleSameAddress = (e) => {
		if (e.target.checked) {
			setForm(prev => ({
				...prev,
				presentAddress: { ...prev.permanentAddress }
			}));
		} else {
			setForm(prev => ({
				...prev,
				presentAddress: {
					building: '',
					street: '',
					area: '',
					city: '',
					state: '',
					pincode: '',
					country: ''
				}
			}));
		}
	};

	const updateAddressField = (addressType, field, value) => {
		setForm(prev => ({
			...prev,
			[addressType]: {
				...prev[addressType],
				[field]: value
			}
		}));
	};

	const navigate = useNavigate();

	// Step 1
	if (step === 1) {
		return (
			<>
				{snackbarMessage && (
					<div role="alert" aria-live="assertive" className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl">
						{snackbarMessage}
					</div>
				)}
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					

					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-bg.gif')" }}></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>

					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-center gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:h-full lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20">
						<div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-evenly">
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:h-[98px] lg:w-[565px] lg:text-[48px]">
								Register as a Volunteer
							</h1>
							<button
								onClick={() => navigate(-1)}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-orange-400 self-start lg:absolute lg:right-10 lg:top-14"
							>
								<FaArrowLeft /> Back
							</button>
						</div>

						{/* Step indicator */}
						<div className="w-full text-sm text-[#7A6A5A] font-semibold">Step 1 of 5</div>

						<div className="flex w-full flex-col gap-4 sm:flex-row">
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="firstName" className="text-[#7A6A5A]">First Name</label>
								<input
									type="text"
									name="firstName"
									id="firstName"
									value={form.firstName}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Your first name"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="lastName" className="text-[#7A6A5A]">Last Name</label>
								<input
									type="text"
									name="lastName"
									id="lastName"
									value={form.lastName}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Your last name"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>
						</div>

						<div className="flex w-full flex-col gap-2">
							<label htmlFor="email" className="text-[#7A6A5A]">Email address</label>
							<input
								type="email"
								name="email"
								id="email"
								value={form.email}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Your email"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>

						<div className="flex w-full flex-col gap-2">
							<label htmlFor="phone" className="text-[#7A6A5A]">Phone Number</label>
							<input
								type="text"
								name="phone"
								id="phone"
								value={form.phone}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Your phone number"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>

						<div className="flex w-full flex-col gap-2">
							<label htmlFor="password" className="text-[#7A6A5A]">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									id="password"
									value={form.password}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Create a password"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 pr-12 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(prev => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A3A00] hover:text-[#A64200] outline-none"
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						<div className="flex w-full flex-col gap-2">
							<label htmlFor="confirmPassword" className="text-[#7A6A5A]">Confirm Password</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									id="confirmPassword"
									value={form.confirmPassword}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Confirm your password"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 pr-12 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(prev => !prev)}
									aria-label={showConfirmPassword ? "Hide password" : "Show password"}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A3A00] hover:text-[#A64200] outline-none"
								>
									{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						{localError && <p className="text-red-400 text-sm font-semibold">{localError}</p>}

						<button
							onClick={handleNext}
							className="w-full rounded-xl bg-[#7A3A00] px-4 py-2 hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg hover:scale-105 outline-none"
						>
							Next
						</button>
					</div>
				</div>
			</>
		);
	}

	// Step 2 - Permanent Address
	if (step === 2) {
		return (
			<>
				{snackbarMessage && (
					<div role="alert" aria-live="assertive" className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl">
						{snackbarMessage}
					</div>
				)}
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					

					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-bg.gif')" }}></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>

					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-center gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:h-full lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20">
						<div className="w-full flex items-center justify-between">
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:text-[48px]">
								Permanent Address
							</h1>
							<button
								onClick={() => setStep(step - 1)}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-orange-400"
							>
								<FaArrowLeft /> Back
							</button>
						</div>

						<div className="w-full text-sm text-[#7A6A5A] font-semibold">Step 2 of 5</div>

						<div className="flex w-full flex-col gap-4">
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="building" className="text-[#7A6A5A]">House / Building Name or Number</label>
								<input
									type="text"
									id="building"
									value={form.permanentAddress.building}
									onChange={(e) => updateAddressField('permanentAddress', 'building', e.target.value)}
									placeholder="Building name or number"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>

							<div className="flex w-full flex-col gap-2">
								<label htmlFor="street" className="text-[#7A6A5A]">Street / Road Name</label>
								<input
									type="text"
									id="street"
									value={form.permanentAddress.street}
									onChange={(e) => updateAddressField('permanentAddress', 'street', e.target.value)}
									placeholder="Street or road name"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>

							<div className="flex w-full flex-col gap-2">
								<label htmlFor="area" className="text-[#7A6A5A]">Area / Locality</label>
								<input
									type="text"
									id="area"
									value={form.permanentAddress.area}
									onChange={(e) => updateAddressField('permanentAddress', 'area', e.target.value)}
									placeholder="Area or locality"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>

							<div className="flex w-full gap-4 sm:flex-row">
								<div className="flex w-full flex-col gap-2">
									<label htmlFor="city" className="text-[#7A6A5A]">City</label>
									<input
										type="text"
										id="city"
										value={form.permanentAddress.city}
										onChange={(e) => updateAddressField('permanentAddress', 'city', e.target.value)}
										placeholder="City"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>

								<div className="flex w-full flex-col gap-2">
									<label htmlFor="state" className="text-[#7A6A5A]">State</label>
									<input
										type="text"
										id="state"
										value={form.permanentAddress.state}
										onChange={(e) => updateAddressField('permanentAddress', 'state', e.target.value)}
										placeholder="State"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>
							</div>

							<div className="flex w-full gap-4 sm:flex-row">
								<div className="flex w-full flex-col gap-2">
									<label htmlFor="pincode" className="text-[#7A6A5A]">PIN Code</label>
									<input
										type="text"
										id="pincode"
										value={form.permanentAddress.pincode}
										onChange={(e) => updateAddressField('permanentAddress', 'pincode', e.target.value)}
										placeholder="PIN code"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>

								<div className="flex w-full flex-col gap-2">
									<label htmlFor="country" className="text-[#7A6A5A]">Country</label>
									<input
										type="text"
										id="country"
										value={form.permanentAddress.country}
										onChange={(e) => updateAddressField('permanentAddress', 'country', e.target.value)}
										placeholder="Country"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>
							</div>
						</div>

						{localError && <p className="text-red-400 text-sm font-semibold">{localError}</p>}

						<button
							onClick={handleNext}
							className="w-full rounded-xl bg-[#7A3A00] px-4 py-2 hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg hover:scale-105 outline-none"
						>
							Next
						</button>
					</div>
				</div>
			</>
		);
	}

	// Step 3 - Present Address
	if (step === 3) {
		return (
			<>
				{snackbarMessage && (
					<div role="alert" aria-live="assertive" className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl">
						{snackbarMessage}
					</div>
				)}
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					

					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-bg.gif')" }}></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>

					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-center gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:h-full lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20">
						<div className="w-full flex items-center justify-between">
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:text-[48px]">
								Present Address
							</h1>
							<button
								onClick={() => setStep(step - 1)}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-orange-400"
							>
								<FaArrowLeft /> Back
							</button>
						</div>

						<div className="w-full text-sm text-[#7A6A5A] font-semibold">Step 3 of 5</div>

						{/* Same as Permanent Address Checkbox */}
						<div className="w-full flex items-center gap-3">
							<input
								type="checkbox"
								id="sameAddress"
								onChange={handleSameAddress}
								className="w-4 h-4 rounded cursor-pointer accent-[#7A3A00]"
							/>
							<label htmlFor="sameAddress" className="text-[#7A6A5A] cursor-pointer font-semibold">
								Same as Permanent Address
							</label>
						</div>

						<div className="flex w-full flex-col gap-4">
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="presentBuilding" className="text-[#7A6A5A]">House / Building Name or Number</label>
								<input
									type="text"
									id="presentBuilding"
									value={form.presentAddress.building}
									onChange={(e) => updateAddressField('presentAddress', 'building', e.target.value)}
									placeholder="Building name or number"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>

							<div className="flex w-full flex-col gap-2">
								<label htmlFor="presentStreet" className="text-[#7A6A5A]">Street / Road Name</label>
								<input
									type="text"
									id="presentStreet"
									value={form.presentAddress.street}
									onChange={(e) => updateAddressField('presentAddress', 'street', e.target.value)}
									placeholder="Street or road name"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>

							<div className="flex w-full flex-col gap-2">
								<label htmlFor="presentArea" className="text-[#7A6A5A]">Area / Locality</label>
								<input
									type="text"
									id="presentArea"
									value={form.presentAddress.area}
									onChange={(e) => updateAddressField('presentAddress', 'area', e.target.value)}
									placeholder="Area or locality"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>

							<div className="flex w-full gap-4 sm:flex-row">
								<div className="flex w-full flex-col gap-2">
									<label htmlFor="presentCity" className="text-[#7A6A5A]">City</label>
									<input
										type="text"
										id="presentCity"
										value={form.presentAddress.city}
										onChange={(e) => updateAddressField('presentAddress', 'city', e.target.value)}
										placeholder="City"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>

								<div className="flex w-full flex-col gap-2">
									<label htmlFor="presentState" className="text-[#7A6A5A]">State</label>
									<input
										type="text"
										id="presentState"
										value={form.presentAddress.state}
										onChange={(e) => updateAddressField('presentAddress', 'state', e.target.value)}
										placeholder="State"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>
							</div>

							<div className="flex w-full gap-4 sm:flex-row">
								<div className="flex w-full flex-col gap-2">
									<label htmlFor="presentPincode" className="text-[#7A6A5A]">PIN Code</label>
									<input
										type="text"
										id="presentPincode"
										value={form.presentAddress.pincode}
										onChange={(e) => updateAddressField('presentAddress', 'pincode', e.target.value)}
										placeholder="PIN code"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>

								<div className="flex w-full flex-col gap-2">
									<label htmlFor="presentCountry" className="text-[#7A6A5A]">Country</label>
									<input
										type="text"
										id="presentCountry"
										value={form.presentAddress.country}
										onChange={(e) => updateAddressField('presentAddress', 'country', e.target.value)}
										placeholder="Country"
										className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
									/>
								</div>
							</div>
						</div>

						{localError && <p className="text-red-400 text-sm font-semibold">{localError}</p>}

						<button
							onClick={handleNext}
							className="w-full rounded-xl bg-[#7A3A00] px-4 py-2 hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg hover:scale-105 outline-none"
						>
							Next
						</button>
					</div>
				</div>
			</>
		);
	}

	// Step 4 - Work/Education Status
	if (step === 4) {
		return (
			<>
				{snackbarMessage && (
					<div role="alert" aria-live="assertive" className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl">
						{snackbarMessage}
					</div>
				)}
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					

					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-bg.gif')" }}></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>

					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-center gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:h-full lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20">
						<div className="w-full flex items-center justify-between">
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:text-[48px]">
								Work / Education
							</h1>
							<button
								onClick={() => setStep(step - 1)}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-orange-400"
							>
								<FaArrowLeft /> Back
							</button>
						</div>

						<div className="w-full text-sm text-[#7A6A5A] font-semibold">Step 4 of 5</div>

						{/* Status Selection */}
						<div className="w-full flex flex-col gap-4">
							<label className="text-[#7A6A5A] font-semibold">What is your current status?</label>
							<div className="flex gap-6">
								<div className="flex items-center gap-2">
									<input
										type="radio"
										id="working"
										name="status"
										value="working"
										checked={form.status === 'working'}
										onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
										className="w-4 h-4 cursor-pointer accent-[#7A3A00]"
									/>
									<label htmlFor="working" className="text-[#7A6A5A] cursor-pointer">Working</label>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="radio"
										id="student"
										name="status"
										value="student"
										checked={form.status === 'student'}
										onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
										className="w-4 h-4 cursor-pointer accent-[#7A3A00]"
									/>
									<label htmlFor="student" className="text-[#7A6A5A] cursor-pointer">Student</label>
								</div>
							</div>
						</div>

						{/* Conditional Input */}
						{form.status && (
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="workspaceName" className="text-[#7A6A5A] font-semibold">
									{form.status === 'working' ? 'Company Name' : 'College Name'}
								</label>
								<input
									type="text"
									id="workspaceName"
									value={form.workspaceName}
									onChange={(e) => setForm(prev => ({ ...prev, workspaceName: e.target.value }))}
									placeholder={form.status === 'working' ? 'Enter company name' : 'Enter college name'}
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400"
								/>
							</div>
						)}

						{localError && <p className="text-red-400 text-sm font-semibold">{localError}</p>}

						<button
							onClick={handleNext}
							className="w-full rounded-xl bg-[#7A3A00] px-4 py-2 hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg hover:scale-105 outline-none"
						>
							Next
						</button>
					</div>
				</div>
			</>
		);
	}

		// Step 5 - Profile Completion
	if (step === 5) {
		return (
			<>
				{snackbarMessage && (
					<div role="alert" aria-live="assertive" className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl">
						{snackbarMessage}
					</div>
				)}
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-bg.gif')" }}></div>
					<div className="absolute inset-0 bg-black/80"></div>

					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-bg.gif')" }}></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>

					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-start gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20 lg:h-full">
						<div className="w-full flex items-center justify-between flex-shrink-0">
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:text-[40px]">
								Complete Your Profile
							</h1>
							<button
								onClick={() => setStep(step - 1)}
								className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-orange-400 sm:px-4 sm:py-2 flex-shrink-0"
							>
								<FaArrowLeft /> Back
							</button>
						</div>

						<div className="w-full text-sm text-[#7A6A5A] font-semibold flex-shrink-0">Step 5 of 5</div>

						<div className="w-full flex flex-col gap-6 overflow-y-auto flex-1 pr-2">
							{/* Upload Section */}
							<div className="w-full">
								<label className="text-[#7A6A5A] font-semibold mb-3 block">Upload Your Photo</label>
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
									{photoPreview && (
										<div className="flex-shrink-0">
											<img
												src={photoPreview}
												alt="Preview"
												className="w-24 h-24 rounded-xl object-cover border-2 border-[#E0D4C4]"
											/>
										</div>
									)}
									
									<div className="flex-shrink-0">
										<input
											id="photoInput"
											type="file"
											accept="image/*"
											onChange={handlePhotoUpload}
											className="hidden"
										/>
										<button
											onClick={triggerPhotoUpload}
											type="button"
											className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap"
										>
											{photoPreview ? 'Change Photo' : 'Upload Photo'}
										</button>
									</div>
								</div>
							</div>

							{/* Github */}
							<div className="w-full">
								<div className="flex items-center gap-2 mb-2">
									<label className="text-[#7A6A5A] font-semibold">Github Profile</label>
									<span className="text-[#BBA898] text-xs sm:text-sm">Optional</span>
								</div>
								<input
									type="text"
									value={form.github || ''}
									onChange={(e) => setForm(prev => ({ ...prev, github: e.target.value }))}
									placeholder="https://github.com/username"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none focus:ring-2 focus:ring-orange-400 text-sm"
								/>
							</div>

							{/* Linkedin */}
							<div className="w-full">
								<div className="flex items-center gap-2 mb-2">
									<label className="text-[#7A6A5A] font-semibold">LinkedIn Profile</label>
									<span className="text-[#BBA898] text-xs sm:text-sm">Optional</span>
								</div>
								<input
									type="text"
									value={form.linkedin || ''}
									onChange={(e) => setForm(prev => ({ ...prev, linkedin: e.target.value }))}
									placeholder="https://linkedin.com/in/username"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none focus:ring-2 focus:ring-orange-400 text-sm"
								/>
							</div>

							{/* Instagram */}
							<div className="w-full">
								<div className="flex items-center gap-2 mb-2">
									<label className="text-[#7A6A5A] font-semibold">Instagram</label>
									<span className="text-[#BBA898] text-xs sm:text-sm">Optional</span>
								</div>
								<input
									type="text"
									value={form.instagram || ''}
									onChange={(e) => setForm(prev => ({ ...prev, instagram: e.target.value }))}
									placeholder="https://instagram.com/username"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none focus:ring-2 focus:ring-orange-400 text-sm"
								/>
							</div>

							{/* Bio */}
							<div className="w-full">
								<div className="flex items-center gap-2 mb-2">
									<label className="text-[#7A6A5A] font-semibold">Profile Bio</label>
									<span className="text-[#BBA898] text-xs sm:text-sm">Optional</span>
								</div>
								<textarea
									rows="4"
									value={form.bio || ''}
									onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
									placeholder="Tell more about yourself"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none resize-none focus:ring-2 focus:ring-orange-400 text-sm"
								/>
							</div>

							{localError && <p className="text-red-400 text-xs sm:text-sm font-semibold">{localError}</p>}
						</div>

						{/* Register Button */}
						<button
							onClick={() => {
								const validationError = validateStep5();
								if (validationError) {
									setLocalError(validationError);
									showSnackbar(validationError);
									return;
								}
								setLocalError(null);
								onRegisterStep5(photoFile);
							}}
							className="w-auto self-center lg:self-end mt-2 rounded-xl bg-[#7A3A00] px-10 py-3 hover:bg-[#8B3D00] text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg hover:scale-105 outline-none flex-shrink-0"
						>
							Register
						</button>
					</div>
				</div>
			</>
		);
	}
};

export default RegistrationDesktop;