'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getAuthData, type AuthData } from '@/lib/auth-client'

export default function Home() {
  const [cookieData, setCookieData] = useState<AuthData | null>(null)

  useEffect(() => {
    const data = getAuthData()
    setCookieData(data)
    console.log('cookie data', data)
  }, [])

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* 🍪 Cookie Data Display */}
        <div className="w-full max-w-4xl bg-gray-50 dark:bg-gray-900 rounded-none p-6 border">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Cookie Data
          </h2>

          {cookieData ? (
            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
                  User Info
                </h3>
                {cookieData.userInfo ? (
                  <div className="bg-white dark:bg-gray-800 rounded p-4 space-y-2">
                    <p>
                      <span className="font-medium">User ID:</span>{' '}
                      {cookieData.userInfo.userId}
                    </p>
                    <p>
                      <span className="font-medium">University ID:</span>{' '}
                      {cookieData.userInfo.universityId}
                    </p>
                    <p>
                      <span className="font-medium">Name:</span>{' '}
                      {cookieData.userInfo.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {cookieData.userInfo.email}
                    </p>
                    <p>
                      <span className="font-medium">Is Admin:</span>{' '}
                      {cookieData.userInfo.isAdmin ? 'Yes' : 'No'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No user info available
                  </p>
                )}
              </div>

              {/* Session Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
                  Session Info
                </h3>
                {cookieData.sessionInfo ? (
                  <div className="bg-white dark:bg-gray-800 rounded p-4 space-y-2">
                    <p>
                      <span className="font-medium">Session ID:</span>{' '}
                      {cookieData.sessionInfo.sessionId}
                    </p>
                    <p>
                      <span className="font-medium">Token:</span>{' '}
                      {cookieData.sessionInfo.token.substring(0, 20)}...
                    </p>
                    <p>
                      <span className="font-medium">IP Address:</span>{' '}
                      {cookieData.sessionInfo.ipAddress}
                    </p>
                    <p>
                      <span className="font-medium">User Agent:</span>{' '}
                      {cookieData.sessionInfo.userAgent}
                    </p>
                    <p>
                      <span className="font-medium">Created At:</span>{' '}
                      {new Date(
                        cookieData.sessionInfo.createdAt
                      ).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Expires At:</span>{' '}
                      {new Date(
                        cookieData.sessionInfo.expiresAt
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No session info available
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Loading cookie data...
            </p>
          )}
        </div>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
