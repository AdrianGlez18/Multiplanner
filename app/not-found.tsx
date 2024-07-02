import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center gap-12'>
      <Link href='/' className='flex items-center justify-center p-1'>
        <Image src="/logo-light.png" alt="logo" width={400} height={400} />
      </Link>
      <h1 className='text-4xl font-bold'>Error 404</h1>
      <h2 className='text-3xl font-bold'>Oooops...this page was not found</h2>
      <Link href="/" passHref>
        <Button className='bg-blue-500 hover:bg-blue-700 text-white'>Back home</Button>
      </Link>
    </div>
  )
}

export default NotFound