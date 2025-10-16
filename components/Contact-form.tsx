"use client";

import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import Styles from "./contact.module.css";

// Define form data type
type ContactFormData = {
  userName: string;
  userEmail: string;
  mobileNumber: string;
  city: string;
  zipCode: string;
  wantTo: 'buy' | 'sell' | 'rent' | '';
  bedrooms: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '';
  propertyType: 'house' | 'apartment' | 'commercial' | 'plot' | '';
  budget: string;
  contactDetails: string;
  message: string;
};

// Error message component
const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
  error ? <p className="text-red-500 text-sm mt-1">{error.message}</p> : null;

const ContactForm = () => {
  const methods = useForm<ContactFormData>({
    mode: "onTouched",
    defaultValues: {
      userName: '',
      userEmail: '',
      mobileNumber: '',
      city: '',
      zipCode: '',
      wantTo: '',
      bedrooms: '',
      propertyType: '',
      budget: '',
      contactDetails: '',
      message: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  // Correctly typed submit handler
  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    // Transform UI values to API payload
    const mapPropertyType = (pt: ContactFormData['propertyType']) => {
      if (!pt) return undefined;
      if (pt === 'house') return 'villa';
      return pt;
    };

    const mapBudget = (b: string) => {
      switch (b) {
        case '<100k':
          return '0-100000';
        case '100k-200k':
          return '100000-200000';
        case '200k-300k':
          return '200000-300000';
        case '>300k':
          return '300000-999999999';
        default:
          return b || undefined;
      }
    };

    const payload: any = {
      // Hardcoded per requirement
      who: 'website',
      agent: 'none',
      status: 'new',
      // Mapped fields
      name: data.userName,
      email_id: data.userEmail,
      phone: data.mobileNumber,
      location: data.city,
      pin_no: data.zipCode || undefined,
      message: data.message,
      property_type: mapPropertyType(data.propertyType),
      budget: mapBudget(data.budget),
      bedrooms: data.bedrooms || undefined,
      address: data.contactDetails || undefined,
      intent: data.wantTo,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        console.error('Failed to submit lead:', result.error || res.statusText);
        alert(result?.error || 'Failed to submit. Please try again.');
        return;
      }

      // Success
      console.log('Lead created:', result.data);
      alert('Thank you! Your details have been submitted.');
    } catch (err) {
      console.error('Error submitting lead:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={Styles.contactForm}>
      <div className={Styles.contactFormContent}>
        <div className={Styles.contactHeading}>Get in Touch</div>
        <p>Have queries? Simply fill in the form below and we will get in touch with you.</p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={Styles.wrapper}>

            {/* Location / City */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="city">Location / City</label>
                <input id="city" placeholder="e.g., New York" className={Styles.inputField}
                  {...register("city", { required: "City is required" })} />
              </div>
              <ErrorMessage error={errors.city} />
            </div>

            {/* Zip Code */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="zipCode">Zip Code</label>
                <input id="zipCode" placeholder="e.g., 10001" className={Styles.inputField}
                  {...register("zipCode", { pattern: { value: /^[0-9]{5,6}$/, message: "Enter a valid ZIP/Pin" } })} />
              </div>
              <ErrorMessage error={errors.zipCode} />
            </div>

            {/* I Want To */}
            <div className={Styles.inputGroup}>
              <div className="relative z-1">
                <label>I Want To</label>
                <div className={Styles.radioGroup}>
                  <label><input type="radio" value="buy" {...register("wantTo", { required: "Select one" })} /> Buy</label>
                  <label><input type="radio" value="sell" {...register("wantTo", { required: "Select one" })} /> Sell</label>
                  <label><input type="radio" value="rent" {...register("wantTo", { required: "Select one" })} /> Rent</label>
                </div>
              </div>
              <ErrorMessage error={errors.wantTo as any} />
            </div>

            {/* Bedrooms */}
            <div className={Styles.inputGroup}>
              <div className="relative z-1">
                <label>Bedrooms</label>
                <div className={Styles.radioGroup}>
                  <label><input type="radio" value="1BHK" {...register("bedrooms", { required: "Select bedrooms" })} /> 1BHK</label>
                  <label><input type="radio" value="2BHK" {...register("bedrooms", { required: "Select bedrooms" })} /> 2BHK</label>
                  <label><input type="radio" value="3BHK" {...register("bedrooms", { required: "Select bedrooms" })} /> 3BHK</label>
                  <label><input type="radio" value="4BHK" {...register("bedrooms", { required: "Select bedrooms" })} /> 4BHK</label>
                </div>
              </div>
              <ErrorMessage error={errors.bedrooms as any} />
            </div>

            {/* Property Type */}
            <div className={Styles.inputGroup}>
              <div className="relative z-1">
                <label>Property Type</label>
                <div className={Styles.radioGroup}>
                  <label><input type="radio" value="apartment" {...register("propertyType", { required: "Select type" })} /> Apartment</label>
                  <label><input type="radio" value="house" {...register("propertyType", { required: "Select type" })} /> House</label>
                  <label><input type="radio" value="commercial" {...register("propertyType", { required: "Select type" })} /> Commercial</label>
                  <label><input type="radio" value="plot" {...register("propertyType", { required: "Select type" })} /> Plot</label>
                </div>
              </div>
              <ErrorMessage error={errors.propertyType as any} />
            </div>

            {/* Budget */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="budget">Budget</label>
                <select id="budget" className={Styles.inputField}
                  {...register("budget", { required: "Select budget" })}>
                  <option value="">Select Budget</option>
                  <option value="<100k">Less than $100,000</option>
                  <option value="100k-200k">$100,000 - $200,000</option>
                  <option value="200k-300k">$200,000 - $300,000</option>
                  <option value=">300k">More than $300,000</option>
                </select>
              </div>
              <ErrorMessage error={errors.budget} />
            </div>

            {/* Message */}
            <div className={Styles.inputGroup}>
              <div className="relative z-1">
                <label htmlFor="message">Message</label>
                <textarea id="message" className={Styles.inputField}
                  {...register("message", { required: "Message is required" })}
                  placeholder="I want to buy a house in New York"></textarea>
              </div>
              <ErrorMessage error={errors.message} />
            </div>

            {/* Contact Details */}
            <div className={Styles.inputGroup}>
              <div className="relative z-1">
                <label htmlFor="contactDetails">Address</label>
                <textarea id="contactDetails" className={Styles.inputField}
                  {...register("contactDetails", { maxLength: 250 })}
                  placeholder="Any preferred time to call, alt phone/email, etc."></textarea>
              </div>
            </div>

            {/* Name */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="userName">Name</label>
                <input id="userName" placeholder="John Doe" className={Styles.inputField}
                  {...register("userName", { required: "Name is required" })} />
              </div>
              <ErrorMessage error={errors.userName} />
            </div>

            {/* Email */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="userEmail">Email</label>
                <input id="userEmail" type="email" placeholder="john.doe@gmail.com" className={Styles.inputField}
                  {...register("userEmail", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" } })} />
              </div>
              <ErrorMessage error={errors.userEmail} />
            </div>

            {/* Phone */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="mobileNumber">Phone</label>
                <input id="mobileNumber" placeholder="1234567890" className={Styles.inputField}
                  {...register("mobileNumber", { required: "Mobile number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" } })} />
              </div>
              <ErrorMessage error={errors.mobileNumber} />
            </div>

            {/* Submit Button */}
            <div className={Styles.buttonGroup}>
              <div className="mt-[8px]">
                <button type="submit" className={Styles.submitButton}>Submit</button>
              </div>
            </div>

          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ContactForm;
