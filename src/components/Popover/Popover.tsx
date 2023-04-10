import React, { useId, useRef, useState } from 'react'
import { useFloating, FloatingPortal, arrow, shift, offset, type Placement } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: React.ElementType
  initialOpen?: boolean
  placement?: Placement
}

export default function Popover(props: Props) {
  const { children, renderPopover, className, as: Element = 'div', initialOpen, placement = 'bottom-end' } = props
  const [open, setOpen] = useState(initialOpen || false)
  const id = useId()
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  const showPopover = () => {
    setOpen(true)
  }
  const closePopover = () => {
    setOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={closePopover}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(1)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='absolute z-[1] translate-y-[-95%] border-[11px] border-x-transparent border-b-white border-t-transparent'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
