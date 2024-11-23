import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/Slices/ToastSlice';
import { DotSquare } from 'lucide-react';
import SmallSpinner from '../common/SmallSpinner';

const Signup = ({ setIsLogin }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        confPassword: '',
    });

  const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState({
        usernameInvalid: false,
        passwordLength: false,
        passwordMatch: false,
        passwordSpecialChar: false,
        passwordUppercase: false,
    });


    const SignUpUser = async () => {
        setLoading(true)
        const { username, email, full_name, password } = formData;  
    
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, full_name, password }),  
        });
    
        const res = await response.json();
        setLoading(false)
        if (response.ok) {
            dispatch(showToast({
                message: 'Signup successful!',
                type: 's',
            }));
            setIsLogin(true);
        } else {
            if (res.username || res.email) {
                dispatch(showToast({
                    message: 'Username or email already exists!',
                    type: 'e',
                }));
            }
        }
    };
    
    const validatePassword = (password) => {
        if (password === '') {

            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordLength: false,
                passwordSpecialChar: false,
                passwordUppercase: false,
            }));
            return;
        }

        const isPasswordLengthValid = password.length >= 8;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const uppercaseRegex = /[A-Z]/;
        const isPasswordSpecialCharValid = specialCharRegex.test(password);
        const isPasswordUppercaseValid = uppercaseRegex.test(password);

        setErrors((prevErrors) => ({
            ...prevErrors,
            passwordLength: !isPasswordLengthValid,
            passwordSpecialChar: !isPasswordSpecialCharValid,
            passwordUppercase: !isPasswordUppercaseValid,
        }));
    };

    const validatePasswordMatch = (confirmPassword) => {
        if (confirmPassword === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordMatch: false,
            }));
            return;
        }

        const isPasswordMatch = formData.password === confirmPassword;
        setErrors((prevErrors) => ({
            ...prevErrors,
            passwordMatch: !isPasswordMatch,
        }));
    };

    const validateUsername = (username) => {
        if (username.trim() === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                usernameInvalid: false,
            }));
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_@]+$/;
        const isUsernameValid = usernameRegex.test(username);
        setErrors((prevErrors) => ({
            ...prevErrors,
            usernameInvalid: !isUsernameValid,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateUsername(formData.username);
        validatePassword(formData.password);
        validatePasswordMatch(formData.confPassword);

        if (
            !errors.usernameInvalid &&
            !errors.passwordLength &&
            !errors.passwordMatch &&
            !errors.passwordSpecialChar &&
            !errors.passwordUppercase
        ) {
            await SignUpUser()
           
            
        } else {
            dispatch(
                showToast({
                    type: 'e',
                    message: 'Please fix the errors before submitting the form.',
                })
            );
        }
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, password: value });
        validatePassword(value);
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, confPassword: value });
        validatePasswordMatch(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'username') {
            validateUsername(value);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Sign up</h1>
            <form onSubmit={handleSubmit}>
                {errors.usernameInvalid && formData.username.trim() !== '' && (
                    <p className="text-red-500 text-sm">Username can only contain alphanumeric characters, underscores (_), and the @ symbol.</p>
                )}
                <Input
                    required={true}
                    onChange={handleChange}
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="my-5 bg-muted rounded-lg focus"
                />
                <Input
                    required={true}
                    onChange={handleChange}
                    type="text"
                    placeholder="Full name"
                    name="full_name"
                    className="my-5 bg-muted rounded-lg focus"
                />
                <Input
                    required={true}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="my-5 bg-muted rounded-lg focus"
                />
                <Input
                    required={true}
                    onChange={handlePasswordChange}
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="my-5 bg-muted rounded-lg"
                />
                {errors.passwordLength && formData.password !== '' && (
                    <p className="text-red-500 text-sm">Password must be at least 8 characters long.</p>
                )}
                {errors.passwordSpecialChar && formData.password !== '' && (
                    <p className="text-red-500 text-sm">Password must contain at least one special character.</p>
                )}
                {errors.passwordUppercase && formData.password !== '' && (
                    <p className="text-red-500 text-sm">Password must contain at least one uppercase letter.</p>
                )}
                <Input
                    required={true}
                    onChange={handleConfirmPasswordChange}
                    type="password"
                    placeholder="Confirm Password"
                    name="confPassword"
                    className="my-5 bg-muted rounded-lg"
                />
                {errors.passwordMatch && formData.confPassword !== '' && (
                    <p className="text-red-500 text-sm">Passwords do not match.</p>
                )}
                <Button type="submit" disabled={loading} variant className="w-full mb-4">
                {
                    loading ? (
                        <SmallSpinner/>
                    ):"Sign up"
                }
                    
                </Button>
            </form>
        </div>
    );
};

export default Signup;
