import React from 'react'
import Spinner from '@/components/Global/Spinner'
interface PageLoaderProps {
  title?: string
}
const PageLoader = ({ title }: PageLoaderProps) => {
  return (
    <div className="flex flex-col items-center h-[50px] lg:h-[70vh] justify-center lg:mt-0 mt-[95px]  ">
      <Spinner size={16} className="text-black dark:text-white" />
      <div className=" text-[12px] lg:text-1xl font-poppins font-bold  lg:mt-1.5">{title}</div>
    </div>
  )
}

export default PageLoader
