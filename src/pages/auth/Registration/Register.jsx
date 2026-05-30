import RegistrationDesktop from './RegistrationDesktop';
import { useEffect, useRef, useState } from 'react';
import { supabase } from "../../../services/supabase-client";

const Register = () => {

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		gender: "",
		bloodGroup: "",
		password: "",
		confirmPassword: "",
		permanentAddress: {
			building: "",
			street: "",
			area: "",
			city: "",
			state: "",
			pincode: "",
			country: ""
		},
		presentAddress: {
			building: "",
			street: "",
			area: "",
			city: "",
			state: "",
			pincode: "",
			country: ""
		},
		status: "", 
		workspaceName: "", 
		github: "",
		linkedin: "",
		instagram: "",
		bio: "",
		emergencyInfo: {
			bloodGroup: "",
			tShirtSize: "",
			contactName: "",
			contactPhone: ""
		}
	});

	const [error, setError] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarVariant, setSnackbarVariant] = useState("error");
	const snackbarTimeoutRef = useRef(null);

	const showSnackbar = (message) => {
		showSnackbarWithVariant(message, "error");
	};

	const showSnackbarWithVariant = (message, variant = "error") => {
		setSnackbarMessage(message);
		setSnackbarVariant(variant);

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
                    const message = "Failed to upload photo. Please try again.";
                    setError(message);
                    showSnackbar(message);
                    return error;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('profile')
                    .getPublicUrl(`users/${fileName}`);

                photoUrl = publicUrl;
                console.log("Photo uploaded successfully:", photoUrl);
            }

            // Prepare user data
            const userData = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phone: form.phone.trim(),
				dateOfBirth: form.dateOfBirth || null,
				gender: form.gender || null,
				bloodGroup: form.bloodGroup || null,
                address: {
                    permanentAddress: {
                        building: form.permanentAddress.building.trim(),
                        street: form.permanentAddress.street.trim(),
                        area: form.permanentAddress.area.trim(),
                        city: form.permanentAddress.city.trim(),
                        state: form.permanentAddress.state.trim(),
                        pincode: form.permanentAddress.pincode.trim(),
                        country: form.permanentAddress.country.trim()
                    },
                    presentAddress: {
                        building: form.presentAddress.building.trim(),
                        street: form.presentAddress.street.trim(),
                        area: form.presentAddress.area.trim(),
                        city: form.presentAddress.city.trim(),
                        state: form.presentAddress.state.trim(),
                        pincode: form.presentAddress.pincode.trim(),
                        country: form.presentAddress.country.trim()
                    }
                },
                is_working: form.status === 'working',
                workspace_name: form.workspaceName.trim(),
				emergencyInfo: {
					bloodGroup: form.emergencyInfo.bloodGroup || form.bloodGroup || null,
					tShirtSize: form.emergencyInfo.tShirtSize?.trim() || null,
					contactName: form.emergencyInfo.contactName?.trim() || null,
					contactPhone: form.emergencyInfo.contactPhone?.trim() || null
				},
                socials: {
                    github: form.github?.trim() || null,
                    linkedin: form.linkedin?.trim() || null,
					instagram: form.instagram?.trim() || null
                },
                photo: photoUrl,
                bio: form.bio?.trim() || null,
                role: "VOLUNTEER"
            };

            const { data, error } = await supabase.auth.signUp({
                email: form.email.trim(),
                password: form.password,
                options: {
                    data: userData
                }
            });

            if (error) {
                if (
                    error.message.includes("User already registered") ||
                    error.message.includes("already exists")
                ) {
                    const message = "User already exists with this email address.";
                    setError(message);
                    showSnackbarWithVariant(message, "error");
                    window.setTimeout(() => {
                        window.location.href = "/signin";
                    }, 1800);
                    return error;
                }

                const message = `Registration failed: ${error.message}`;
                setError(message);
                showSnackbar(message);
                return error;
            }

            setError(null);
            showSnackbarWithVariant("Registration successful! Redirecting to sign in...", "success");
            window.setTimeout(() => {
                window.location.href = "/signin";
            }, 1800);

            return null;
        } catch (err) {
            const message = "An unexpected error occurred. Please try again.";
            setError(message);
            showSnackbar(message);
            return err;
        }
    }

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

	const handleSubmit = async (e) => {
		e?.preventDefault();
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			showSnackbar(validationError);
			return;
		}
		setError(null);
	};

	const handleRegisterStep5 = async (photoFileData) => {
		const result = await registerForm(photoFileData);
		if (result) {
			const message = result?.message || "Registration failed. Please try again.";
			showSnackbar(message);
		}
	};

	return (
		<>
			{snackbarMessage && (
				<div
					role="alert"
					aria-live="assertive"
					className={`fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl ${snackbarVariant === "success" ? "bg-emerald-600" : "bg-red-600"}`}
				>
					{snackbarMessage}
				</div>
			)}
			<div className="block">
				<RegistrationDesktop form={form} setForm={setForm} error={error} handleSubmit={handleSubmit} onRegisterStep5={handleRegisterStep5} />
			</div>
		</>
	);
};

export default Register;