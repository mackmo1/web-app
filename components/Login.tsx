"use client";

import React from 'react';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import Styles from "./auth.module.css";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from "lucide-react";


// ✅ Define a proper type for form inputs
type LoginFormInputs = {
  userType: 'buyer' | 'agent' | ''; // include empty string for default
  userEmail: string;
  userPass: string;
  poliyText: boolean;
};

type LoginProps = { onClose?: () => void; className?: string };

const Login: React.FC<LoginProps> = ({ onClose, className }) => {
  const methods = useForm<LoginFormInputs>({
    mode: "onTouched",
    defaultValues: {
      userType: '',
      userEmail: '',
      userPass: '',
      poliyText: false,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  // ✅ Use typed form data
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.assign('/');
      }
    }
  };


  // ✅ Use typed form data
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.userEmail, password: data.userPass }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || 'Invalid email or password');
        return;
      }

      alert('Login successful');
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className={`${Styles.loginContainer} ${className ?? ''} mx-[2em] sm:mx-0 pt-[4em]`}>

      <div className={`${Styles.loginContainer_in} relative`}>
        <button
          type="button"
          aria-label="Close login form"
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 h-11 w-11 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors z-10"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className={Styles.login_heading}>
          <span>Login</span>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={Styles.wrapper}>

              {/* User Type Radio Group */}
              <div className={Styles.radioGroupWrap}>
                <span className='font-semibold'>Are you</span>
                <MyRadioGroup />
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>
                )}
              </div>

              {/* Email Input */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="userEmail">Email Address</label>
                  <input
                    type="email"
                    id="userEmail"
                    placeholder="Email"
                    className={Styles.inputField}
                    {...register("userEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </div>
                {errors.userEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.userEmail.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="userPass">Password</label>
                  <input
                    type="password"
                    id="userPass"
                    placeholder="Password"
                    className={Styles.inputField}
                    {...register("userPass", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.userPass && (
                  <p className="text-red-500 text-sm mt-1">{errors.userPass.message}</p>
                )}
              </div>

              {/* Policy Checkbox */}
              <div className={Styles.buttonGroup}>
                {/* <div className={Styles.checkBoxGroup}>
                  <input
                    type="checkbox"
                    id="poliyText"
                    className={Styles.poliyText}
                    {...register("poliyText", {
                      required: "You must accept the policies",
                    })}
                  />
                  <label htmlFor="poliyText">
                    I agree to PrimeProperties T&C, Privacy Policy, & Cookie Policy
                  </label>
                </div>
                {errors.poliyText && (
                  <p className="text-red-500 text-sm mt-1">{errors.poliyText.message}</p>
                )} */}

                {/* Submit Button */}
                <div className="mt-[20px]">
                  <button type="submit" className={Styles.submitButton}>Sign In</button>
                </div>

                {/* Register Link */}
                <p className="mt-[20px] text-center">
                  New to PrimeProperties <Link href="/register">Sign Up</Link>
                </p>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;

// ✅ Custom Radio Group Component (with Controller)
const MyRadioGroup = () => {
  const { control } = useFormContext<LoginFormInputs>();

  return (
    <Controller
      name="userType"
      control={control}
      rules={{ required: "Please select a user type" }}
      render={({ field }) => (
        <div className={Styles.radioGroup}>
          <div>
            <input
              type="radio"
              id="buyer"
              value="buyer"
              checked={field.value === "buyer"}
              onChange={field.onChange}
            />
            <label htmlFor="buyer">Buyer/Owner</label>
          </div>
          <div>
            <input
              type="radio"
              id="agent"
              value="agent"
              checked={field.value === "agent"}
              onChange={field.onChange}
            />
            <label htmlFor="agent">Agent/Builder</label>
          </div>
        </div>
      )}
    />
  );
};