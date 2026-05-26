import SigninDesktop from "./SigninDesktop";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../services/supabase-client";
import { useNavigate } from "react-router-dom";
const Signin = () => {

    const navigate = useNavigate();

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
            if (form.password.trim().length < 8) return 'Enter a valid password';
            return null; // No errors
        };
    
        const [error, setError] = useState(null); // State to hold validation error messages
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
    
        const loginBackend = async () => {
                const { error } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password
                });

                if (error) {
                    const message = error.message || "Sign in failed. Please try again.";
                    setError(message);
                    showSnackbar(message);
                    return;
            }
            navigate("/volunteer-profile");
        }

        // Handle form submission
        const handleSubmit = (e) => {
            e?.preventDefault();
            const validationError = validate();
            if (validationError) {
                setError(validationError);
                showSnackbar(validationError);
                return;
            }
            setError(null);
            loginBackend();
        };
    

    return (
        <>
            {snackbarMessage && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl"
                >
                    {snackbarMessage}
                </div>
            )}
            <div>
                <SigninDesktop form={form} setForm={setForm} error={error} handleSubmit={handleSubmit}  />
            </div>
            
        </>
    );
};

export default Signin;

