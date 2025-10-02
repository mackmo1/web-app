"use client";

import React from 'react';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import Styles from "./enquery.module.css";

type EnquiryFormInputs = {
  userName: string;
  userEmail: string;
  mobileNumber: string;
  faceing: string;
  propertyType: string;
  roomType: string;
  startDate: string;
  city: string;
  address: string;
  price: string;
  pin_code: string;
  project: string;
  parking: string;
  message: string;
};

const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
  error ? <p className="text-red-500 text-sm mt-1">{error.message}</p> : null;

const EnqueryForm = () => {
  const methods = useForm<EnquiryFormInputs>({
    mode: "onTouched",
    defaultValues: {
      userName: '',
      userEmail: '',
      mobileNumber: '',
      faceing: '',
      propertyType: '',
      roomType: '',
      startDate: '',
      city: '',
      address: '',
      price: '',
      pin_code: '',
      project: '',
      parking: 'no',
      message: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit = (data: EnquiryFormInputs) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className={Styles.loginContainer}>
      <div className={Styles.loginContainer_in}>
        <div className={Styles.login_heading}>
          <span>List Property Free</span>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={Styles.wrapper}>

              {/* Full Name */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="userName">Full Name</label>
                  <input
                    type="text"
                    id="userName"
                    placeholder="Name"
                    className={Styles.inputField}
                    {...register("userName", { required: "Name is required" })}
                  />
                </div>
                <ErrorMessage error={errors.userName} />
              </div>

              {/* Email */}
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
                <ErrorMessage error={errors.userEmail} />
              </div>

              {/* Phone Number */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="mobileNumber">Phone Number</label>
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
                <ErrorMessage error={errors.mobileNumber} />
              </div>

              {/* Project */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="project">Project</label>
                  <input
                    type="text"
                    id="project"
                    placeholder="Project"
                    className={Styles.inputField}
                    {...register("project", { required: "Project is required" })}
                  />
                </div>
                <ErrorMessage error={errors.project} />
              </div>

              {/* Faceing */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="faceing">Faceing</label>
                  <input
                    type="text"
                    id="faceing"
                    placeholder="Faceing"
                    className={Styles.inputField}
                    {...register("faceing", { required: "Faceing is required" })}
                  />
                </div>
                <ErrorMessage error={errors.faceing} />
              </div>

              {/* Price */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Price"
                    className={Styles.inputField}
                    {...register("price", {
                      required: "Price is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Enter a valid Price",
                      },
                    })}
                  />
                </div>
                <ErrorMessage error={errors.price} />
              </div>

              {/* Property Type */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="propertyType">Property Type</label>
                  <PropertyType />
                </div>
                <ErrorMessage error={errors.propertyType} />
              </div>

              {/* Rooms */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="roomType">Rooms</label>
                  <RoomType />
                </div>
                <ErrorMessage error={errors.roomType} />
              </div>

              {/* Parking */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="parking">Parking</label>
                  <Parking />
                </div>
              </div>

              {/* Start Date */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    placeholder="Date"
                    className={Styles.inputField}
                    min={new Date().toISOString().split("T")[0]}
                    {...register("startDate", { required: "Date is required" })}
                  />
                </div>
                <ErrorMessage error={errors.startDate} />
              </div>

              {/* Address */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    className={Styles.inputField}
                    {...register("address", { required: "Address is required" })}
                    placeholder="Address"
                  />
                </div>
                <ErrorMessage error={errors.address} />
              </div>

              {/* City */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    placeholder="City"
                    className={Styles.inputField}
                    {...register("city", { required: "City is required" })}
                  />
                </div>
                <ErrorMessage error={errors.city} />
              </div>

              {/* Pin Code */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="pin_code">Pin Code</label>
                  <input
                    type="number"
                    id="pin_code"
                    placeholder="Pin Code"
                    className={Styles.inputField}
                    {...register("pin_code", {
                      required: "Pin Code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Enter a valid 6-digit Pin Code",
                      },
                    })}
                  />
                </div>
                <ErrorMessage error={errors.pin_code} />
              </div>

              {/* Message */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    className={Styles.inputField}
                    {...register("message", { required: "Message is required" })}
                    placeholder="Message"
                  />
                </div>
                <ErrorMessage error={errors.message} />
              </div>

              {/* Submit Button */}
              <div className={Styles.buttonGroup}>
                <div className="mt-[8px]">
                  <button type="submit" className={Styles.submitButton}>
                    Submit
                  </button>
                </div>
              </div>

            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EnqueryForm;

const PropertyType = () => {
  const { control } = useFormContext<EnquiryFormInputs>();

  return (
    <Controller
      name="propertyType"
      control={control}
      rules={{ required: "Please select a Property type" }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value="">Select Property type</option>
            <option value="buyer">Buyer/Owner/Tenant</option>
            <option value="agent">Agent</option>
            <option value="builder">Builder</option>
          </select>
        </div>
      )}
    />
  );
};

const RoomType = () => {
  const { control } = useFormContext<EnquiryFormInputs>();

  return (
    <Controller
      name="roomType"
      control={control}
      rules={{ required: "Please select a Room type" }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value="" disabled>Select Rooms</option>
            <option value="1rk">1RK</option>
            <option value="1bhk">1BHK</option>
            <option value="2bhk">2BHK</option>
            <option value="3bhk">3BHK</option>
            <option value="4bhk">4BHK</option>
          </select>
        </div>
      )}
    />
  );
};

const Parking = () => {
  const { control } = useFormContext<EnquiryFormInputs>();

  return (
    <Controller
      name="parking"
      control={control}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      )}
    />
  );
};
