'use client'

import React, { useEffect } from 'react'
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form'
import Styles from './posting.module.css'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

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
  listing: string // e.g., 'rent' | 'sale'
  type?: string // property subtype (apartment, villa, etc.)
  city: string
  project?: string
  address: string
  pin_code?: string
  rooms: string // e.g., '2bhk'
  parking?: 'yes' | 'no'
  price: string // keep as string from input; server will coerce to Decimal
  facing?: string
  starting_dt?: string // YYYY-MM-DD
  user_id?: string // optional, if you attach user later
  area?: string // numeric string
  status?: string
  message?: string
  external_id?: string
}

const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
  error ? <p className='text-red-500 text-sm mt-1'>{error.message}</p> : null

type PostingFormProps = { className?: string }

const PostingForm: React.FC<PostingFormProps> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingType = searchParams.get('listing') || 'rent'

  const methods = useForm<PostingFormInputs>({
    mode: 'onTouched',
    defaultValues: {
      listing: listingType,
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
  })

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods

  type LocalFile = { file: File; url?: string; isPdf: boolean }
  const [activeTab, setActiveTab] = React.useState<'Inside View' | 'Floor Plan' | 'Outside View' | 'Brochure'>(
    'Inside View'
  )
  const [insideFiles, setInsideFiles] = React.useState<LocalFile[]>([])
  const [floorFiles, setFloorFiles] = React.useState<LocalFile[]>([])
  const [outsideFiles, setOutsideFiles] = React.useState<LocalFile[]>([])
  const [brochureFiles, setBrochureFiles] = React.useState<LocalFile[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const createdUrlsRef = React.useRef<Set<string>>(new Set())

  const handleClose = () => {
    if (router) {
      router.back()
    } else if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.assign('/')
      }
    }
  }

  function toLocalFiles(list: FileList, allowPdf: boolean): LocalFile[] {
    const arr = Array.from(list)
    return arr
      .filter((f) => {
        const isImg = f.type.startsWith('image/')
        const isPdf = f.type === 'application/pdf'
        return allowPdf ? isImg || isPdf : isImg
      })
      .map((f) => {
        const isImg = f.type.startsWith('image/')
        const url = isImg ? URL.createObjectURL(f) : undefined
        if (url) createdUrlsRef.current.add(url)
        return { file: f, url, isPdf: f.type === 'application/pdf' }
      })
  }

  function handleAddFiles(tab: 'Inside View' | 'Floor Plan' | 'Outside View' | 'Brochure', list: FileList) {
    const allowPdf = tab === 'Brochure'
    const newOnes = toLocalFiles(list, allowPdf)
    if (tab === 'Inside View') setInsideFiles((prev) => [...prev, ...newOnes])
    if (tab === 'Floor Plan') setFloorFiles((prev) => [...prev, ...newOnes])
    if (tab === 'Outside View') setOutsideFiles((prev) => [...prev, ...newOnes])
    if (tab === 'Brochure') setBrochureFiles((prev) => [...prev, ...newOnes])
  }

  function removeFile(tab: 'Inside View' | 'Floor Plan' | 'Outside View' | 'Brochure', idx: number) {
    const updater = (arr: LocalFile[]) => {
      const copy = [...arr]
      const [removed] = copy.splice(idx, 1)
      if (removed?.url) {
        URL.revokeObjectURL(removed.url)
        createdUrlsRef.current.delete(removed.url)
      }
      return copy
    }
    if (tab === 'Inside View') setInsideFiles(updater)
    if (tab === 'Floor Plan') setFloorFiles(updater)
    if (tab === 'Outside View') setOutsideFiles(updater)
    if (tab === 'Brochure') setBrochureFiles(updater)
  }

  React.useEffect(() => {
    const created = createdUrlsRef.current
    return () => {
      // cleanup object URLs on unmount
      created.forEach((u) => URL.revokeObjectURL(u))
      created.clear()
    }
  }, [])

  function buildBatch() {
    // Flatten order: Inside → Floor → Outside → Brochure
    const files: File[] = []
    const categories: string[] = []
    insideFiles.forEach((f) => {
      files.push(f.file)
      categories.push('Inside View')
    })
    floorFiles.forEach((f) => {
      files.push(f.file)
      categories.push('Floor Plan')
    })
    outsideFiles.forEach((f) => {
      files.push(f.file)
      categories.push('Outside View')
    })
    brochureFiles.forEach((f) => {
      files.push(f.file)
      categories.push('Brochure')
    })
    return { files, categories }
  }

  const onSubmit = async (data: PostingFormInputs) => {
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('listing', data.listing)
      formData.append('city', data.city)
      formData.append('address', data.address)
      formData.append('rooms', data.rooms)
      formData.append('price', data.price)

      if (data.type) formData.append('type', data.type)
      if (data.project) formData.append('project', data.project)
      if (data.pin_code) formData.append('pin_code', data.pin_code)
      if (data.parking) formData.append('parking', data.parking)
      if (data.facing) formData.append('facing', data.facing)
      if (data.starting_dt) formData.append('starting_dt', data.starting_dt)
      if (data.user_id) formData.append('user_id', data.user_id)
      if (data.area) formData.append('area', data.area)
      if (data.status) formData.append('status', data.status)
      if (data.message) formData.append('message', data.message)
      if (data.external_id) formData.append('external_id', data.external_id)

      const { files, categories } = buildBatch()
      files.forEach((file) => formData.append('files', file))
      categories.forEach((cat) => formData.append('categories', cat))

      const res = await fetch('/api/properties/post-with-media', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok || json?.success === false) {
        const code = json?.code as string | undefined
        const serverMessage: string | undefined =
          typeof json?.message === 'string' ? json.message : json?.error

        let friendly = serverMessage

        switch (code) {
          case 'FILE_TOO_LARGE':
            friendly =
              friendly ||
              'Image upload failed: File size exceeds the allowed limit. Please choose a smaller image.'
            break
          case 'INVALID_FILE_TYPE':
            friendly =
              friendly ||
              'Image upload failed: Unsupported file format. Please upload JPG, PNG, WebP, or PDF for brochures.'
            break
          case 'NETWORK_ERROR':
            friendly =
              friendly ||
              'Network error while uploading images. Please check your internet connection and try again.'
            break
          case 'DB_ERROR':
            friendly = friendly || 'Server error while saving your property. Please try again.'
            break
          case 'VALIDATION_ERROR':
            friendly =
              friendly ||
              'There was a problem with your submission. Please check the form and try again.'
            break
          default:
            friendly = friendly || 'Failed to post property. Please try again.'
        }

        setErrorMessage(friendly)
        setSuccessMessage(null)
        return
      }

      setErrorMessage(null)
      setSuccessMessage(json?.message || 'Property submitted successfully.')

      methods.reset()
      setInsideFiles([])
      setFloorFiles([])
      setOutsideFiles([])
      setBrochureFiles([])
      setActiveTab('Inside View')
    } catch (e) {
      console.error('Posting error', e)
      setErrorMessage('Network error. Please check your internet connection and try again.')
      setSuccessMessage(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`${Styles.loginContainer} ${className ?? ''}`}>
      <div className={`${Styles.loginContainer_in} relative my-[4em] mx-[1em] sm:mx-auto`}>
        <button
          type='button'
          aria-label='Close posting form'
          onClick={handleClose}
          className='absolute top-2 right-2 md:top-3 md:right-3 h-11 w-11 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors z-10'
        >
          <X className='h-5 w-5' aria-hidden='true' />
        </button>

        <div className={Styles.login_heading}>
          <span>Post Property</span>
        </div>

        {errorMessage && (
          <div className='mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700'>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className='mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
            {successMessage}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={Styles.wrapper}>
              {/* Listing */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='listing'>Listing</label>
                  <ListingSelect listingType={listingType} />
                </div>
                <ErrorMessage error={errors.listing} />
              </div>

              {/* Type */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='type'>Property Type</label>
                  <input id='type' placeholder='Type' className={Styles.inputField} {...register('type')} />
                </div>
              </div>

              {/* Rooms */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='rooms'>Rooms</label>
                  <RoomsSelect />
                </div>
                <ErrorMessage error={errors.rooms} />
              </div>

              {/* Price */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='price'>Price</label>
                  <input
                    type='number'
                    id='price'
                    placeholder='Price'
                    className={Styles.inputField}
                    {...register('price', { required: 'Price is required' })}
                  />
                </div>
                <ErrorMessage error={errors.price} />
              </div>

              {/* City */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='city'>City</label>
                  <input
                    id='city'
                    placeholder='City'
                    className={Styles.inputField}
                    {...register('city', { required: 'City is required' })}
                  />
                </div>
                <ErrorMessage error={errors.city} />
              </div>

              {/* Address */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='address'>Address</label>
                  <textarea
                    id='address'
                    className={Styles.inputField}
                    {...register('address', { required: 'Address is required' })}
                    placeholder='Address'
                  />
                </div>
                <ErrorMessage error={errors.address} />
              </div>

              {/* Project */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='project'>Project</label>
                  <input id='project' placeholder='Project' className={Styles.inputField} {...register('project')} />
                </div>
              </div>

              {/* Pin Code */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='pin_code'>Pin Code</label>
                  <input
                    type='number'
                    id='pin_code'
                    placeholder='Pin Code'
                    className={Styles.inputField}
                    {...register('pin_code')}
                  />
                </div>
              </div>

              {/* Parking */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='parking'>Parking</label>
                  <ParkingSelect />
                </div>
              </div>

              {/* Facing */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='facing'>Facing</label>
                  <input id='facing' placeholder='Facing' className={Styles.inputField} {...register('facing')} />
                </div>
              </div>

              {/* Start Date */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='starting_dt'>Start Date</label>
                  <input
                    type='date'
                    id='starting_dt'
                    className={Styles.inputField}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('starting_dt')}
                  />
                </div>
              </div>

              {/* Area */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='area'>Area (sqft)</label>
                  <input
                    type='number'
                    id='area'
                    placeholder='Area'
                    className={Styles.inputField}
                    {...register('area')}
                  />
                </div>
              </div>

              {/* Status */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='status'>Status</label>
                  <input id='status' placeholder='Status' className={Styles.inputField} {...register('status')} />
                </div>
              </div>

              {/* Message */}
              <div className={Styles.inputGroup}>
                <div className='relative z-1'>
                  <label htmlFor='message'>Message</label>
                  <textarea id='message' className={Styles.inputField} {...register('message')} placeholder='Message' />
                </div>
                <ErrorMessage error={errors.message} />
              </div>

              {/* External ID */}
              <div className={`${Styles.inputGroup} ${Styles.anotherHalf}`}>
                <div className='relative z-1'>
                  <label htmlFor='external_id'>External ID</label>
                  <input
                    id='external_id'
                    placeholder='External ID'
                    className={Styles.inputField}
                    {...register('external_id')}
                  />
                </div>
              </div>

              {/* Media Uploads */}
              <div className='mt-6 border rounded-md p-4 w-full'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>Media uploads</h3>
                  <span className='text-xs text-gray-500'>Accepted: JPG, PNG, WebP (+ PDF for Brochure)</span>
                </div>

                {/* Tabs */}
                <div className='mt-5 flex gap-2 w-full flex-wrap'>
                  {(['Inside View', 'Floor Plan', 'Outside View', 'Brochure'] as const).map((tab) => (
                    <button
                      key={tab}
                      type='button'
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
                      } px-3 py-1.5 rounded-md text-sm md:w-[24%] w-[48%] cursor-pointer`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Uploader */}
                <div className='mt-8'>
                  <input
                    type='file'
                    multiple
                    onChange={(e) => e.target.files && handleAddFiles(activeTab, e.target.files)}
                    accept={
                      activeTab === 'Brochure'
                        ? 'image/jpeg,image/png,image/webp,application/pdf'
                        : 'image/jpeg,image/png,image/webp'
                    }
                    className='block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 file:cursor-pointer cursor-pointer '
                    disabled={uploading}
                  />
                </div>

                {/* Previews */}
                <div className='mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
                  {(activeTab === 'Inside View'
                    ? insideFiles
                    : activeTab === 'Floor Plan'
                    ? floorFiles
                    : activeTab === 'Outside View'
                    ? outsideFiles
                    : brochureFiles
                  ).map((lf, idx) => (
                    <div key={idx} className='relative border rounded overflow-hidden'>
                      <button
                        type='button'
                        aria-label='Remove'
                        onClick={() => removeFile(activeTab, idx)}
                        className='absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full px-1 text-xs'
                      >
                        ✕
                      </button>
                      {lf.isPdf ? (
                        <div className='h-24 flex items-center justify-center text-xs text-gray-600 p-2'>
                          <span className='text-center'>PDF\n{lf.file.name}</span>
                        </div>
                      ) : lf.url ? (
                        <Image
                          src={lf.url}
                          alt={lf.file.name}
                          width={300}
                          height={150}
                          className='h-24 w-full object-cover'
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Counts */}
                <div className='mt-2 text-xs text-gray-600'>
                  <span>Inside: {insideFiles.length}</span>
                  <span className='mx-2'>•</span>
                  <span>Floor: {floorFiles.length}</span>
                  <span className='mx-2'>•</span>
                  <span>Outside: {outsideFiles.length}</span>
                  <span className='mx-2'>•</span>
                  <span>Brochure: {brochureFiles.length}</span>
                </div>
              </div>

              <Button type='submit' disabled={uploading} className='w-full cursor-pointer'>
                {uploading ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default PostingForm

const ListingSelect = ({ listingType }: { listingType: string }) => {
  const { control, setValue } = useFormContext<PostingFormInputs>()

  useEffect(() => {
    if (listingType && setValue) setValue('listing', listingType)
  }, [listingType, setValue])

  return (
    <Controller
      defaultValue={listingType}
      name='listing'
      control={control}
      rules={{ required: 'Please select listing type' }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value='rent'>Rent</option>
            <option value='sale'>Sale</option>
          </select>
        </div>
      )}
    />
  )
}

const RoomsSelect = () => {
  const { control } = useFormContext<PostingFormInputs>()

  return (
    <Controller
      name='rooms'
      control={control}
      rules={{ required: 'Please select rooms' }}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value=''>Select Rooms</option>
            <option value='1rk'>1RK</option>
            <option value='1bhk'>1BHK</option>
            <option value='2bhk'>2BHK</option>
            <option value='3bhk'>3BHK</option>
            <option value='4bhk'>4BHK</option>
          </select>
        </div>
      )}
    />
  )
}

const ParkingSelect = () => {
  const { control } = useFormContext<PostingFormInputs>()

  return (
    <Controller
      name='parking'
      control={control}
      render={({ field }) => (
        <div className={Styles.selectWrapper}>
          <select {...field} className={Styles.inputField}>
            <option value='no'>No</option>
            <option value='yes'>Yes</option>
          </select>
        </div>
      )}
    />
  )
}
