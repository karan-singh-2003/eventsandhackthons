'use client'
import React from 'react'

import PageLoader from '@/components/Global/PageLoader'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLogInUser } from '@/hooks/useLogInUser'

import { Button } from '@/components/ui/button'
import FormElements from '@/components/Global/FormElements'
import Spinner from '@/components/Global/Spinner'

const LoginPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => setLoading(false)
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])
  const {
    register,
    errors,
    onFormSubmit,
    watch,
    isPending,
    serverError,
    isValid,
  } = useLogInUser()

  const watchedValues = watch()
  const universityId = watchedValues?.universityId || ''
  console.log('universityId', universityId)

  if (loading) return <PageLoader />
  return (
    <div className="flex flex-col items-center h-screen">
      {/* 🔹 "events" stays at the very top */}
      <h1 className="mt-6 mr-5">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center">
            {/* Use the SVG with proper styling to make it visible */}
            <Image
              src="/eventsLogo.svg"
              alt="eventsLogo"
              height={40}
              width={126}
              className="w-20 h-6 sm:w-22 sm:h-6 lg:w-24 lg:h-7"
              style={{
                filter: 'invert(1)', // This will make white SVG appear black
                display: 'block',
              }}
            />
          </div>
        </Link>
      </h1>

      {/* 🔹 Move the form slightly below but not centered */}
      <div className="flex flex-col items-center mt-16 w-full  lg:max-w-md xl:max-w-lg px-4">
        <h1 className=" font-bold text-lg sm:text-xl lg:text-xl xl:text-2xl mr-6">
          Get Started
        </h1>
        <h3 className="text-[#454444] text-xs sm:text-sm lg:text-sm xl:text-base font-semibold mt-2 mb-4 text-center">
          Access your account with your gndec guru portal credentials and start
          enrolling in events now!
        </h3>
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col w-full p-4 sm:p-6"
        >
          {serverError && (
            <div className="bg-[#FFDADA] flex text-[#FF3F3F] text-xs sm:text-xs lg:text-sm p-3 mb-4 text-center justify-center h-10 sm:h-12 items-center">
              <p className="mt-0 ml-2">
                {typeof serverError === 'string'
                  ? serverError
                  : JSON.stringify(serverError)}
              </p>
            </div>
          )}

          <FormElements
            inputType="input"
            register={register}
            placeholder="University ID"
            name="universityId"
            errors={errors}
            type="text"
          />

          <FormElements
            inputType="input"
            register={register}
            placeholder={'secret password'}
            name="password"
            errors={errors}
            type="password"
          />
          <a
            href="/forgot-password"
            className="hover:underline text-[#3D3A3A] my-1 mb-2 text-xs sm:text-xs lg:text-sm block text-right"
          >
            Forgot Password?
          </a>
          <Button
            variant="secondary"
            disabled={!isValid || isPending}
            className={`h-10 sm:h-12 lg:h-12 mt-4 w-full rounded-none text-white text-xs sm:text-sm lg:text-sm ${
              !isValid || isPending
                ? 'bg-[#D4D4D4] cursor-not-allowed'
                : 'bg-[#635BFF] hover:bg-[#635BFF]/80'
            }`}
          >
            {isPending ? (
              <div className="flex justify-center items-center space-x-2 text-xs sm:text-xs lg:text-sm -ml-3">
                <Spinner size={16} />
                <span>Checking</span>
              </div>
            ) : (
              'Log In'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
