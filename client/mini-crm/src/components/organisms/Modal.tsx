'use client';

import { forwardRef, useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { FiX } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import { IconButton } from '../atoms/IconButton';

const modalVariants = cva(
  'w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] shadow-[var(--shadow-dropdown)]',
  {
    variants: {
      size: {
        sm: 'max-w-[400px]',
        md: 'max-w-[560px]',
        lg: 'max-w-[720px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      footer,
      size,
      closeOnOverlayClick = true,
      className,
    },
    ref
  ) => {
    const titleId = useId();

    useEffect(() => {
      if (!isOpen) return;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
      function handleKey(e: KeyboardEvent) {
        if (e.key === 'Escape') onClose();
      }
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            modalVariants({ size }),
            'relative z-10 mx-[var(--space-4)] animate-[modalIn_0.2s_ease-out]',
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between gap-[var(--space-4)] px-[var(--space-6)] pt-[var(--space-6)] pb-[var(--space-4)]">
              <div className="flex min-w-0 flex-col gap-[var(--space-1)]">
                {title && (
                  <h2
                    id={titleId}
                    className="truncate text-[var(--text-primary)] text-[var(--text-lg)] font-[var(--font-semibold)]"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-[var(--text-secondary)] text-[var(--text-sm)]">
                    {description}
                  </p>
                )}
              </div>
              <IconButton
                icon={<FiX size={20} />}
                label="Close"
                onClick={onClose}
                size="sm"
                className="shrink-0"
              />
            </div>
          )}

          <div className="px-[var(--space-6)] pb-[var(--space-6)]">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-[var(--space-3)] border-t border-[var(--border-subtle)] px-[var(--space-6)] py-[var(--space-4)]">
              {footer}
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>,
      document.body
    );
  }
);
Modal.displayName = 'Modal';

export { Modal, modalVariants };
export type { ModalProps };
