import RegistrationDesktop from './RegistrationDesktop';
import { useState } from 'react';
import { supabase } from "../../../services/supabase-client";

const Register = () => {

	// form state
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		github: "",
		linkedin: "",
		bio: ""
	});

	const [error, setError] = useState(null);

	const registerForm = async (photoFile) => {
		try {
			let photoUrl = null;

			// Upload photo to Supabase Storage if provided
			if (photoFile) {
				const cleanFileName = photoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");

				const fileName = `${Date.now()}_${cleanFileName}`;
				const { data, error } = await supabase.storage
					.from('profile')
					.upload(`users/${fileName}`, photoFile);

				if (error) {
					console.error("Error uploading photo: ", error);
					setError("Failed to upload photo. Please try again.");
					return error;
				}
				else console.log("Photo uploaded to Supabase Storage:", data);

				// Get public URL of uploaded photo
				const { data: { publicUrl } } = supabase.storage
					.from('profile')
					.getPublicUrl(`users/${fileName}`);

				photoUrl = publicUrl;
				console.log("Photo uploaded successfully:", photoUrl);
			}

			// Prepare user data - trim all strings
			const userData = {
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
				phone: form.phone.trim(),
				socials: {
					github: form.github?.trim() || null,
					linkedin: form.linkedin?.trim() || null
				},
				photo: photoUrl,
				bio: form.bio?.trim() || null,
				role: "VOLUNTEER"
			};

			console.log("=== SENDING TO SUPABASE ===");
			console.log("Email:", form.email.trim());
			console.log("User Data:", userData);

			const { data, error } = await supabase.auth.signUp({
				email: form.email.trim(),
				password: form.password,
				options: {
					data: userData
				}
			});

			if (error) {

				console.error("Error registering user: ", error);

				// Duplicate email check
				if (
					error.message.includes("User already registered") ||
					error.message.includes("already exists")
				) {
					setError("User already exists with this email address.");

					const goToLogin = window.confirm(
						"User already exists with this email address."
					);

					if (goToLogin) {
						window.location.href = "/signin";
					}

					return error;
				}

				setError(`Registration failed: ${error.message}`);
				return error;
			}

			console.log("User registered successfully:", data);
			setError(null);

			const goToSignIn = window.confirm(
				"Registration successful!!"
			);

			if (goToSignIn) {
				window.location.href = "/signin";
			}

			return null;
		} catch (err) {
			console.error("Unexpected error during registration:", err);
			setError("An unexpected error occurred. Please try again.");
			return err;
		}
	}

	// Function to validate the form data before submission
	const validate = () => {
		if (!form.firstName.trim()) return 'First name is required';
		if (!form.lastName.trim()) return 'Last name is required';
		if (!form.email.includes("@")) return 'Enter a valid email address';
		if (!form.phone.trim()) return 'Phone number is required';
		const password = form.password.trim();
		const confirmPassword = form.confirmPassword.trim();
		if (password.length < 8) return 'Password must be at least 8 characters long';
		if (password !== confirmPassword) return 'Passwords do not match';
		return null;
	};

	// Handle form submission - Step 1 (validation only)
	const handleSubmit = async (e) => {
		e?.preventDefault();
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}
		setError(null);
	};

	// Handle form submission - Step 2 (with photo)
	const handleRegisterStep2 = async (photoFileData) => {
		
		const result = await registerForm(photoFileData);
		if (result) {
			console.error("Registration failed:", result);
		}
	};

	return (
		<>
			<div className="block">
				<RegistrationDesktop form={form} setForm={setForm} error={error} handleSubmit={handleSubmit} onRegisterStep2={handleRegisterStep2} />
			</div>
		</>
	);
};

export default Register;