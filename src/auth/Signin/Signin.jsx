import SigninDesktop from "./SigninDesktop";
import SigninMobile from "./SigninMobile";
import { useState } from "react";

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
            if (form.password.trim().length < 8) return 'Enter a valid password';
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

