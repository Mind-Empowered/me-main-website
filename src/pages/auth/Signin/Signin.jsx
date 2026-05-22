import SigninDesktop from "./SigninDesktop";
import SigninMobile from "./SigninMobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabase-client";
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
    
        const loginBackend = async () => {
            const {error} = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password
            });

            if (error){
                console.log("An error has occured: ", error);
                return;
            }
            else {
                console.log("Logged in successfully!");
                navigate("/mentor-dashboard");
            }
        }

        // Handle form submission
        const handleSubmit = (e) => {
            e?.preventDefault();
            const validationError = validate();
            if (validationError) {
                setError(validationError);
                return;
            }
            loginBackend();
            setError(null);
        };
    

    return (
        <>
            <div className="hidden md:block">
                <SigninDesktop form={form} setForm={setForm} error={error} handleSubmit={handleSubmit}  />
            </div>
            <div className="block md:hidden">
                <SigninMobile form={form} setForm={setForm} error={error} handleSubmit={handleSubmit}/>
            </div>
        </>
    );
};

export default Signin;

