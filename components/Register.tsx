"use client";

import React from 'react';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import Styles from "./auth.module.css";
import Link from 'next/link';
import { X } from "lucide-react";

type RegisterFormValues = {
  userType: string;
  userName: string;
  userEmail: string;
  userPass: string;
  mobileNumber: string;
  registerCity: string;
  profession: string;
  poliyText: boolean;
};
type RegisterProps = { onClose?: () => void; className?: string };

const Register: React.FC<RegisterProps> = ({ onClose, className }) => {
  const methods = useForm<RegisterFormValues>({
    mode: "onTouched",
    defaultValues: {
      userType: '',
      userName: '',
      userEmail: '',
      userPass: '',
      mobileNumber: '',
      registerCity: '',
      profession: '',
      poliyText: false,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;


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

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.userType,
          name: data.userName,
          email_id: data.userEmail,
          password: data.userPass,
          mobile: data.mobileNumber,
          city: data.registerCity,
          profession: data.profession,
          role: 'user',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || 'Registration failed');
        return;
      }

      alert('Registered successfully');
      // Optionally redirect to login:
      // router.push('/login')
    } catch (err) {
      console.error('Registration error:', err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className={`${Styles.loginContainer} ${className ?? ''} mx-[2em] sm:mx-0 pt-[4em]`}>

      <div className={`${Styles.loginContainer_in} relative`}>
        <button
          type="button"
          aria-label="Close register form"
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 h-11 w-11 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors z-10"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className={Styles.login_heading}>
          <span>Sign Up</span>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={Styles.wrapper}>
              {/* <div className={Styles.radioGroupWrap}>
                <span className='font-semibold'>I am</span>
                <MyRadioGroup />
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>
                )}
              </div> */}

              <div className={Styles.inputGroup}>
                <MyRadioGroup />
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>
                )}
              </div>

              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="userName">Name</label>
                  <input
                    type="text"
                    id="userName"
                    placeholder="Name"
                    className={Styles.inputField}
                    {...register("userName", { required: "Name is required" })}
                  />
                </div>
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
                )}
              </div>

              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="userEmail">Email</label>
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

              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="mobileNumber">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    placeholder="Mobile Number"
                    className={Styles.inputField}
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    })}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
                )}
              </div>

              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="registerCity">City</label>
                  <input
                    type="text"
                    id="registerCity"
                    placeholder="City"
                    className={Styles.inputField}
                    {...register("registerCity", { required: "City is required" })}
                  />
                </div>
                {errors.registerCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.registerCity.message}</p>
                )}
              </div>

              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="profession">Profession</label>
                  <input
                    type="text"
                    id="profession"
                    placeholder="Profession"
                    className={Styles.inputField}
                    {...register("profession", { required: "Profession is required" })}
                  />
                </div>
                {errors.profession && (
                  <p className="text-red-500 text-sm mt-1">{errors.profession.message}</p>
                )}
              </div>

              <div className={Styles.buttonGroup}>
                <div className={Styles.checkBoxGroup}>
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
                )}
                <div className="mt-[20px]">
                  <button type="submit" className={Styles.submitButton}>Sign Up</button>
                </div>
                <p className="mt-[20px] text-center">
                  Already registered? <Link href="/login">Login Now</Link>
                </p>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Register;

const MyRadioGroup = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="userType"
      control={control}
      rules={{ required: "Please select a Property type" }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value="" disabled>Select Property type</option>
            <option value="buyer">Buyer/Owner/Tenant</option>
            <option value="agent">Agent</option>
            <option value="builder">Builder</option>
          </select>
        </div>
      )}
    />
  );
};

// const MyRadioGroup = () => {
//   const { control } = useFormContext();

//   return (
//     <Controller
//       name="userType"
//       control={control}
//       rules={{ required: "Please select a user type" }}
//       render={({ field }) => (
//         <div className={Styles.radioGroup}>
//           <div>
//             <input
//               type="radio"
//               id="buyer"
//               value="buyer"
//               checked={field.value === "buyer"}
//               onChange={field.onChange}
//             />
//             <label htmlFor="buyer">Buyer/Owner/Tenant</label>
//           </div>
//           <div>
//             <input
//               type="radio"
//               id="agent"
//               value="agent"
//               checked={field.value === "agent"}
//               onChange={field.onChange}
//             />
//             <label htmlFor="agent">Agent</label>
//           </div>
//           <div>
//             <input
//               type="radio"
//               id="builder"
//               value="builder"
//               checked={field.value === "builder"}
//               onChange={field.onChange}
//             />
//             <label htmlFor="builder">Builder</label>
//           </div>
//         </div>
//       )}
//     />
//   );
// };
