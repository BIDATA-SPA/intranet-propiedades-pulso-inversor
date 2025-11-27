import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { ReactElement, ReactNode } from 'react'
import { cloneElement } from 'react'

interface CoverProps extends CommonProps {
  content?: ReactNode
}

const Cover = ({ children, content, ...rest }: CoverProps) => {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="col-span-2 bg-no-repeat bg-cover py-6 px-16 flex-col justify-between bg-white dark:bg-gray-800 hidden lg:flex"
        style={{
          backgroundImage: `url('/img/others/auth-cover-bg.jpg')`,
        }}
      >
        <Logo mode="light" imgClass="w-auto h-[4.5rem] max-h-[4.5rem]" />
        <span className="text-white">
          Desarrollada por{' '}
          <a
            href="https://bidata.cl/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline font-bold"
          >
            BIDATA SPA
          </a>{' '}
          &copy; {`${new Date().getFullYear()}`}{' '}
          <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
        </span>
      </div>
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children
            ? cloneElement(children as ReactElement, { ...rest })
            : null}
        </div>
      </div>
    </div>
  )
}

export default Cover
