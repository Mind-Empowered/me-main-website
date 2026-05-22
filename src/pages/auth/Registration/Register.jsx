import  RegistrationDesktop  from './RegistrationDesktop';
import  RegistrationMobile from './RegistrationMobile';
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
		confirmPassword: ""
	});

	const registerForm = async (e) => {

		const {error: SignUpError} = await supabase.auth.signUp({
			email: form.email,
			password: form.password,
			options: {
				data: {
					firstName: form.firstName,
					lastName: form.lastName,
					phone: form.phone,
					role: "MENTOR"
				}
			}
		});

		if (SignUpError){
			console.log("Error registering user: ", SignUpError);
		}
		else console.log("User registered successfully");
	}

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
	const handleSubmit = async (e) => {
		e?.preventDefault();
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}
		await registerForm(e);
		setError(null);
	};


	return (
		<>
			<div className="hidden md:block">
				<RegistrationDesktop form={form} setForm={setForm} error={error} handleSubmit={handleSubmit}/>
			</div>
			<div className="block md:hidden">
				<RegistrationMobile form={form} setForm={setForm} error={error} handleSubmit={handleSubmit} />
			</div>
		</>
	);
};

export default Register;