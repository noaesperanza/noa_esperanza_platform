import React from 'react';

type NoaSymbolProps = React.SVGProps<SVGSVGElement>;

const NoaSymbol = React.forwardRef<SVGSVGElement, NoaSymbolProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        ref={ref}
        {...props}
      >
        <circle cx="256" cy="256" r="240" stroke="#EAD9BD" strokeWidth="12" fill="#0B2242" />
        <path
          d="M160 192c-24-40 24-96 56-64s-8 64-24 72-40-8-32-40"
          fill="#A78BFA"
        />
        <path
          d="M360 104c32 0 40 48 0 80s-48-48 0-80z"
          fill="#EAD9BD"
        />
        <path
          d="M132 324c24-28 88 24 60 56s-92-4-60-56z"
          fill="#A78BFA"
        />
        <circle cx="400" cy="208" r="8" fill="#EAD9BD" />
        <circle cx="384" cy="232" r="6" fill="#EAD9BD" />
        <path
          d="M252 412c-6-32-56-44-60-80s44-64 68-20"
          stroke="#A78BFA"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M256 84l8 24h24l-20 16 8 24-20-16-20 16 8-24-20-16h24l8-24z"
          fill="#FFF"
        />
      </svg>
    );
  }
);

export default NoaSymbol;
