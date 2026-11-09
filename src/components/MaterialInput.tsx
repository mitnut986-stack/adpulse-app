import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export const MaterialInput = forwardRef<HTMLInputElement, MaterialInputProps>(
  (
    {
      label,
      error,
      helperText,
      isPassword = false,
      value,
      onChange,
      onFocus,
      onBlur,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Controlled or uncontrolled check
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const isFloating = isFocused || hasValue;
    const inputId = id || `material-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const togglePasswordVisibility = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowPassword((prev) => !prev);
    };

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type || 'text';

    // Border and label color classes based on state
    let containerBorderClass = 'border-[#dadce0] hover:border-[#747775]';
    let labelColorClass = 'text-[#5f6368]';

    if (error) {
      containerBorderClass = 'border-[#d93025] ring-1 ring-[#d93025]';
      labelColorClass = 'text-[#d93025]';
    } else if (isFocused) {
      containerBorderClass = 'border-[#1a73e8] ring-1 ring-[#1a73e8]';
      labelColorClass = 'text-[#1a73e8]';
    }

    return (
      <div className={`relative w-full ${className}`}>
        {/* Outlined Input Wrapper */}
        <div
          className={`relative flex items-center w-full min-h-[54px] rounded-[6px] border bg-white transition-colors duration-150 ${containerBorderClass} ${
            disabled ? 'bg-[#f1f3f4] opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={`absolute pointer-events-none transition-all duration-150 ease-out origin-top-left z-10 ${
              isFloating
                ? `top-0 -translate-y-1/2 left-3 px-1 text-xs font-medium bg-white ${labelColorClass}`
                : 'top-1/2 -translate-y-1/2 left-3.5 text-[15px] text-[#5f6368]'
            }`}
          >
            {label}
          </label>

          {/* Actual Input */}
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            disabled={disabled}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full h-full pt-3.5 pb-2.5 px-3.5 text-[15px] text-[#202124] bg-transparent outline-none rounded-[6px] placeholder-transparent ${
              isPassword ? 'pr-11' : ''
            }`}
            placeholder={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />

          {/* Password Toggle Button */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={togglePasswordVisibility}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-neutral-100 transition-colors focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" strokeWidth={1.75} />
              ) : (
                <Eye className="w-5 h-5" strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>

        {/* Error message or Helper text */}
        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-start gap-1.5 text-xs text-[#d93025] mt-1.5 px-1 animate-fadeIn leading-relaxed"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-[#5f6368] mt-1.5 px-1 leading-relaxed">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

MaterialInput.displayName = 'MaterialInput';
