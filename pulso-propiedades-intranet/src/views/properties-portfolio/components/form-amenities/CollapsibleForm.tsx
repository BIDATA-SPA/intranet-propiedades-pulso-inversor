import type { ReactNode } from 'react'
import Collapsible from 'react-collapsible'
import { FaChevronDown } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'

type CollapsibleProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

const Trigger = ({ title, isOpen }: { title: string; isOpen: boolean }) => {
  return (
    <div
      className={[
        'flex w-full items-center justify-between gap-3 ',
        'rounded-lg border  border-gray-200 bg-white px-4 py-3',
        'shadow-sm transition hover:bg-gray-50',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
      ].join(' ')}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-start">
          <FiPlus className="text-gray-900 mr-1" />
          <p className="truncate text-md font-semibold text-gray-900">
            {title}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          Haz clic para desplegar más opciones
        </p>
      </div>

      <FaChevronDown
        className={[
          'shrink-0 text-gray-500 transition-transform duration-300',
          isOpen ? 'rotate-180' : 'rotate-0',
        ].join(' ')}
      />
    </div>
  )
}

const CollapsibleForm = ({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleProps) => {
  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <Collapsible
        lazyRender
        open={defaultOpen}
        transitionTime={250}
        openedClassName="rounded-lg"
        triggerClassName="w-full"
        triggerOpenedClassName="w-full"
        contentOuterClassName="overflow-hidden"
        contentInnerClassName={[
          'mt-2 rounded-lg border border-gray-200 bg-white p-4',
          'shadow-sm',
        ].join(' ')}
        easing="cubic-bezier(0.2, 0.8, 0.2, 1)"
        trigger={<Trigger title={title} isOpen={false} />}
        triggerWhenOpen={<Trigger title={title} isOpen={true} />}
        className="rounded-lg"
      >
        {children}
      </Collapsible>
    </div>
  )
}

export default CollapsibleForm
