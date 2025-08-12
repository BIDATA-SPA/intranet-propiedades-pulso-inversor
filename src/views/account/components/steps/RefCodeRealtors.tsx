import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import ReferredRealtor from '@/views/referred-realtor'
import classNames from 'classnames'
import { useState } from 'react'
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import Meta from '../Meta'

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      throw new Error(err)
    }
  }

  return { isCopied, copyToClipboard }
}

const tip = (
  <Tooltip title="Comparte este enlace a otros corredores">
    <HiOutlineQuestionMarkCircle className="text-lg cursor-pointer ml-1" />
  </Tooltip>
)

const RefCodeRealtors = ({ data }: { data: { referralCode: string } }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div>
      {data?.referralCode && (
        <div>
          <FormContainer>
            <div className="flex flex-row items-center">
              <div className="w-[93%]">
                <FormItem label="Mi código de referidos" extra={tip}>
                  <Input
                    disabled
                    type="text"
                    name="referralCode"
                    placeholder="Sin código de referentes registrado"
                    value={data?.referralCode || ''}
                    className={classNames(
                      isCopied &&
                        'border-2 border-green-600 bg-gray-50 text-gray-800 font-bold'
                    )}
                  />
                </FormItem>
              </div>
              <div className="w-[7%] flex justify-center items-center">
                <Tooltip title="Compartir enlace a otros corredores">
                  <button
                    type="button"
                    className={`p-2 rounded-md transition-colors ${
                      isCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() =>
                      copyToClipboard(
                        `https://procanje.app/crear-cuenta/${data?.referralCode}` ||
                          ''
                      )
                    }
                  >
                    {isCopied ? (
                      <FaClipboardCheck className="text-2xl" />
                    ) : (
                      <FaClipboard className="text-2xl" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          </FormContainer>
        </div>
      )}

      <hr className="mb-8 h-[1px] border-t-0 bg-gray-200 dark:bg-white/10" />

      <Meta />
      <ReferredRealtor />
    </div>
  )
}

export default RefCodeRealtors
