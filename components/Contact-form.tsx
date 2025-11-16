'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import Styles from './contact.module.css'
import { X } from 'lucide-react'
import { Button } from './ui/button'

// Define form data type
type ContactFormData = {
  userName: string
  userEmail: string
  mobileNumber: string
  city: string
  zipCode: string
  wantTo: 'buy' | 'sell' | 'rent' | ''
  bedrooms: '1BHK' | '2BHK' | '3BHK' | '4BHK' | ''
  propertyType: 'house' | 'apartment' | 'commercial' | 'plot' | ''
  budget: string
  contactDetails: string
  message: string
}

// Lead API payload type
type LeadPayload = {
  who: string
  agent: string
  status: string
  name: string
  phone: string
  email_id: string
  location: string
  pin_no: string
  intent: string
  bedrooms: string
  property_type: string
  budget: string
  address: string
  message: string
}

// Error message component
const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
  error ? <p className='text-red-500 text-sm mt-1'>{error.message}</p> : null

type ContactFormProps = { onClose?: () => void; className?: string }

const ContactFormInner: React.FC<ContactFormProps> = ({ onClose, className }) => {
  const methods = useForm<ContactFormData>({
    mode: 'onTouched',
    defaultValues: {
      userName: '',
      userEmail: '',
      mobileNumber: '',
      city: 'Bangalore',
      zipCode: '',
      wantTo: '',
      bedrooms: '',
      propertyType: '',
      budget: '',
      contactDetails: '',
      message: '',
    },
  })

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = methods

  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (!searchParams) return

    const listingType = searchParams.get('listingType')
    const location = searchParams.get('location')
    const title = searchParams.get('title')
    const propertyId = searchParams.get('propertyId')
    const inquiryType = searchParams.get('inquiryType')
    const price = searchParams.get('price')
    const propertyType = searchParams.get('propertyType')

    if (listingType === 'buy' || listingType === 'rent') {
      setValue('wantTo', listingType, { shouldValidate: true })
    }

    if (location) {
      setValue('city', location, { shouldValidate: true })
    }

    const details: string[] = []
    if (title) details.push(`Property: ${title}`)
    if (location) details.push(`Location: ${location}`)
    if (price) details.push(`Price: ${price}`)
    if (propertyType) details.push(`Type: ${propertyType}`)
    if (propertyId) details.push(`ID: ${propertyId}`)

    const intro =
      inquiryType === 'favorite_property'
        ? "I'm interested in this property I favorited."
        : "I'm interested in this property."

    if (details.length > 0) {
      const message = `${intro}\n\n${details.join(' | ')}`
      setValue('message', message, { shouldValidate: true })
    }
  }, [searchParams, setValue])

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.assign('/')
      }
    }
  }

  const [budgetDisplay, setBudgetDisplay] = React.useState('')

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '')
    if (rawValue) {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(Number(rawValue))
      setBudgetDisplay(formatted)
      setValue('budget', rawValue, { shouldValidate: true })
    } else {
      setBudgetDisplay('')
      setValue('budget', '', { shouldValidate: true })
    }
  }



  // Correctly typed submit handler
  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    // Transform UI values to API payload
    const mapPropertyType = (pt: ContactFormData['propertyType']) => {
      if (!pt) return undefined
      if (pt === 'house') return 'villa'
      return pt
    }

    const payload: LeadPayload = {
      // Hardcoded per requirement
      who: 'website',
      agent: 'none',
      status: 'new',
      // Mapped fields
      name: data.userName,
      email_id: data.userEmail,
      phone: data.mobileNumber,
      location: data.city,
      pin_no: data.zipCode || '',
      message: data.message,
      property_type: mapPropertyType(data.propertyType) || '',
      budget: data.budget || '',
      bedrooms: data.bedrooms || '',
      address: data.contactDetails || '',
      intent: data.wantTo,
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok || !result.success) {
        console.error('Failed to submit lead:', result.error, result.message);
        alert(result?.message || result?.error || 'Failed to submit. Please try again.');
        return;
      }

      // Success
      console.log('Lead created:', result.data)
      alert('Thank you! Your details have been submitted.')
    } catch (err) {
      console.error('Error submitting lead:', err)
      alert('Something went wrong. Please try again.')
    }

    reset()
    setBudgetDisplay('')
  }

  return (
    <div className={`${Styles.contactForm} relative ${className ?? ''}`}>
      <button
        type='button'
        aria-label='Close contact form'
        onClick={handleClose}
        className='absolute top-2 right-2 md:top-3 md:right-3 h-11 w-11 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors z-10'
      >
        <X className='h-5 w-5' aria-hidden='true' />
      </button>

      <div className={Styles.contactFormContent}>
        <div className={Styles.contactHeading}>Get in Touch</div>
        <p>Have queries? Simply fill in the form below and we will get in touch with you.</p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={Styles.wrapper}>
            {/* Location / City */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className='relative z-1'>
                <label htmlFor='city'>Location / City</label>
                <input
                  id='city'
                  placeholder='e.g., New York'
                  className={Styles.inputField}
                  {...register('city', { required: 'City is required' })}
                />
              </div>
              <ErrorMessage error={errors.city} />
            </div>

            {/* Zip Code */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className="relative z-1">
                <label htmlFor="zipCode">Zip Code</label>
                <input id="zipCode" placeholder="e.g., 10001" className={Styles.inputField}
                  {...register("zipCode", { pattern: { value: /^[0-9]{6}$/, message: "Enter a 6-digit PIN" } })} />
              </div>
              <ErrorMessage error={errors.zipCode} />
            </div>

            {/* I Want To */}
            <div className={Styles.inputGroup}>
              <div className='relative z-1'>
                <label>I Want To</label>
                <div className={Styles.radioGroup}>
                  <label>
                    <input type='radio' value='buy' {...register('wantTo', { required: 'Select one' })} /> Buy
                  </label>
                  <label>
                    <input type='radio' value='sell' {...register('wantTo', { required: 'Select one' })} /> Sell
                  </label>
                  <label>
                    <input type='radio' value='rent' {...register('wantTo', { required: 'Select one' })} /> Rent
                  </label>
                </div>
              </div>
              <ErrorMessage error={errors.wantTo} />
            </div>

            {/* Bedrooms */}
            <div className={Styles.inputGroup}>
              <div className='relative z-1'>
                <label>Bedrooms</label>
                <div className={Styles.radioGroup}>
                  <label>
                    <input type='radio' value='1BHK' {...register('bedrooms', { required: 'Select bedrooms' })} /> 1BHK
                  </label>
                  <label>
                    <input type='radio' value='2BHK' {...register('bedrooms', { required: 'Select bedrooms' })} /> 2BHK
                  </label>
                  <label>
                    <input type='radio' value='3BHK' {...register('bedrooms', { required: 'Select bedrooms' })} /> 3BHK
                  </label>
                  <label>
                    <input type='radio' value='4BHK' {...register('bedrooms', { required: 'Select bedrooms' })} /> 4BHK
                  </label>
                </div>
              </div>
              <ErrorMessage error={errors.bedrooms} />
            </div>

            {/* Property Type */}
            <div className={Styles.inputGroup}>
              <div className='relative z-1'>
                <label>Property Type</label>
                <div className={Styles.radioGroup}>
                  <label>
                    <input type='radio' value='apartment' {...register('propertyType', { required: 'Select type' })} />{' '}
                    Apartment
                  </label>
                  <label>
                    <input type='radio' value='house' {...register('propertyType', { required: 'Select type' })} />{' '}
                    House
                  </label>
                  <label>
                    <input type='radio' value='commercial' {...register('propertyType', { required: 'Select type' })} />{' '}
                    Commercial
                  </label>
                  <label>
                    <input type='radio' value='plot' {...register('propertyType', { required: 'Select type' })} /> Plot
                  </label>
                </div>
              </div>
              <ErrorMessage error={errors.propertyType} />
            </div>

            {/* Budget */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className='relative z-1'>
                <label htmlFor='budget'>Budget</label>
                <input
                  id='budget'
                  className={Styles.inputField}
                  value={budgetDisplay}
                  onChange={handleBudgetChange}
                />
                <input type='hidden' {...register('budget', { required: 'Budget is required' })} />
              </div>
              <ErrorMessage error={errors.budget} />
            </div>

            {/* Message */}
            <div className={Styles.inputGroup}>
              <div className='relative z-1'>
                <label htmlFor='message'>Message</label>
                <textarea
                  id='message'
                  className={Styles.inputField}
                  {...register('message', { required: 'Message is required' })}
                  placeholder='I want to buy a house in New York'
                ></textarea>
              </div>
              <ErrorMessage error={errors.message} />
            </div>

            {/* Contact Details */}
            <div className={Styles.inputGroup}>
              <div className='relative z-1'>
                <label htmlFor='contactDetails'>Address</label>
                <textarea
                  id='contactDetails'
                  className={Styles.inputField}
                  {...register('contactDetails', { maxLength: 250 })}
                  placeholder='Any preferred time to call, alt phone/email, etc.'
                ></textarea>
              </div>
            </div>

            {/* Name */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className='relative z-1'>
                <label htmlFor='userName'>Name</label>
                <input
                  id='userName'
                  placeholder='John Doe'
                  className={Styles.inputField}
                  {...register('userName', { required: 'Name is required' })}
                />
              </div>
              <ErrorMessage error={errors.userName} />
            </div>

            {/* Email */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className='relative z-1'>
                <label htmlFor='userEmail'>Email</label>
                <input
                  id='userEmail'
                  type='email'
                  placeholder='john.doe@gmail.com'
                  className={Styles.inputField}
                  {...register('userEmail', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
                  })}
                />
              </div>
              <ErrorMessage error={errors.userEmail} />
            </div>

            {/* Phone */}
            <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
              <div className='relative z-1'>
                <label htmlFor='mobileNumber'>Phone</label>
                <input
                  type='number'
                  id='mobileNumber'
                  placeholder='1234567890'
                  className={Styles.inputField}
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
                  })}
                />
              </div>
              <ErrorMessage error={errors.mobileNumber} />
            </div>
          </div>

          {/* Submit Button */}
          <div className={`${Styles.buttonGroup} mt-7`}>
            <div className='mt-[8px] w-full'>
              <Button variant='default' type='submit' className={Styles.submitButton}>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

const ContactForm: React.FC<ContactFormProps> = (props) => (
  <Suspense fallback={null}>
    <ContactFormInner {...props} />
  </Suspense>
)


export default ContactForm
