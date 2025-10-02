"use client";

import React from 'react';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import Styles from "./posting.module.css";

// Property model mapping according to prisma.schema property table
// id: BigInt (server-side)
// created_at: DateTime (server-side default)
// listing: String
// type: String?
// city: String
// project: String?
// address: String
// pin_code: String?
// rooms: String
// parking: Boolean?
// price: Decimal
// facing: String?
// starting_dt: DateTime?
// user_id: BigInt?
// area: BigInt?
// status: String?
// message: String?
// external_id: String?

export type PostingFormInputs = {
  listing: string; // e.g., 'rent' | 'sale'
  type?: string; // property subtype (apartment, villa, etc.)
  city: string;
  project?: string;
  address: string;
  pin_code?: string;
  rooms: string; // e.g., '2bhk'
  parking?: 'yes' | 'no';
  price: string; // keep as string from input; server will coerce to Decimal
  facing?: string;
  starting_dt?: string; // YYYY-MM-DD
  user_id?: string; // optional, if you attach user later
  area?: string; // numeric string
  status?: string;
  message?: string;
  external_id?: string;
};

const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
  error ? <p className="text-red-500 text-sm mt-1">{error.message}</p> : null;

const PostingForm = () => {
  const methods = useForm<PostingFormInputs>({
    mode: "onTouched",
    defaultValues: {
      listing: 'rent',
      type: '',
      city: '',
      project: '',
      address: '',
      pin_code: '',
      rooms: '',
      parking: 'no',
      price: '',
      facing: '',
      starting_dt: '',
      user_id: '',
      area: '',
      status: '',
      message: '',
      external_id: '',
    },
  });

  const { handleSubmit, formState: { errors }, register } = methods;

  const onSubmit = async (data: PostingFormInputs) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing: data.listing,
          type: data.type || null,
          city: data.city,
          project: data.project || null,
          address: data.address,
          pin_code: data.pin_code || null,
          rooms: data.rooms,
          parking: data.parking === 'yes' ? true : data.parking === 'no' ? false : null,
          price: data.price,
          facing: data.facing || null,
          starting_dt: data.starting_dt || null,
          user_id: data.user_id ? Number(data.user_id) : null,
          area: data.area ? Number(data.area) : null,
          status: data.status || null,
          message: data.message || null,
          external_id: data.external_id || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || 'Failed to post property');
        return;
      }
      alert('Property posted successfully');
    } catch (e) {
      console.error('Posting error', e);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className={Styles.loginContainer}>
      <div className={Styles.loginContainer_in}>
        <div className={Styles.login_heading}>
          <span>Post Property</span>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={Styles.wrapper}>
              {/* Listing */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="listing">Listing</label>
                  <ListingSelect />
                </div>
                <ErrorMessage error={errors.listing} />
              </div>

              {/* Type */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="type">Property Type</label>
                  <input id="type" placeholder="Type" className={Styles.inputField}
                    {...register('type')} />
                </div>
              </div>

              {/* Rooms */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="rooms">Rooms</label>
                  <RoomsSelect />
                </div>
                <ErrorMessage error={errors.rooms} />
              </div>

              {/* Price */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" placeholder="Price" className={Styles.inputField}
                    {...register('price', { required: 'Price is required' })} />
                </div>
                <ErrorMessage error={errors.price} />
              </div>

              {/* City */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="city">City</label>
                  <input id="city" placeholder="City" className={Styles.inputField}
                    {...register('city', { required: 'City is required' })} />
                </div>
                <ErrorMessage error={errors.city} />
              </div>

              {/* Address */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="address">Address</label>
                  <textarea id="address" className={Styles.inputField}
                    {...register('address', { required: 'Address is required' })}
                    placeholder="Address" />
                </div>
                <ErrorMessage error={errors.address} />
              </div>

              {/* Project */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="project">Project</label>
                  <input id="project" placeholder="Project" className={Styles.inputField}
                    {...register('project')} />
                </div>
              </div>

              {/* Pin Code */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="pin_code">Pin Code</label>
                  <input type="number" id="pin_code" placeholder="Pin Code" className={Styles.inputField}
                    {...register('pin_code')} />
                </div>
              </div>

              {/* Parking */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="parking">Parking</label>
                  <ParkingSelect />
                </div>
              </div>

              {/* Facing */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="facing">Facing</label>
                  <input id="facing" placeholder="Facing" className={Styles.inputField}
                    {...register('facing')} />
                </div>
              </div>

              {/* Start Date */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="starting_dt">Start Date</label>
                  <input type="date" id="starting_dt" className={Styles.inputField}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('starting_dt')} />
                </div>
              </div>

              {/* Area */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="area">Area (sqft)</label>
                  <input type="number" id="area" placeholder="Area" className={Styles.inputField}
                    {...register('area')} />
                </div>
              </div>

              {/* Status */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="status">Status</label>
                  <input id="status" placeholder="Status" className={Styles.inputField}
                    {...register('status')} />
                </div>
              </div>

              {/* Message */}
              <div className={Styles.inputGroup}>
                <div className="relative z-1">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" className={Styles.inputField}
                    {...register('message')}
                    placeholder="Message" />
                </div>
                <ErrorMessage error={errors.message} />
              </div>

              {/* External ID */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className="relative z-1">
                  <label htmlFor="external_id">External ID</label>
                  <input id="external_id" placeholder="External ID" className={Styles.inputField}
                    {...register('external_id')} />
                </div>
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
    </div>
  );
};

export default PostingForm;

const ListingSelect = () => {
  const { control } = useFormContext<PostingFormInputs>();

  return (
    <Controller
      name="listing"
      control={control}
      rules={{ required: 'Please select listing type' }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>
      )}
    />
  );
};

const RoomsSelect = () => {
  const { control } = useFormContext<PostingFormInputs>();

  return (
    <Controller
      name="rooms"
      control={control}
      rules={{ required: 'Please select rooms' }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value="">Select Rooms</option>
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

const ParkingSelect = () => {
  const { control } = useFormContext<PostingFormInputs>();

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
