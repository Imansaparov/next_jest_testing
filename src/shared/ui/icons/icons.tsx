import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, viewBox = '0 0 24 24', ...props }: IconProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M2 3h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.5-1.1L21 7H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7.5v5M12.3 7.5v5M15.6 7.5v5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="9.5" cy="19.5" r="1.6" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.6" fill="currentColor" />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="11" className="fill-navy" />
      <circle cx="12" cy="9.5" r="3.6" className="fill-paper" />
      <path
        d="M5.6 19.4c1.3-3 3.7-4.6 6.4-4.6s5.1 1.6 6.4 4.6a9.6 9.6 0 0 1-12.8 0Z"
        className="fill-paper"
      />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EraserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="m14.5 4.5 5 5a1.5 1.5 0 0 1 0 2.1L12 19H7.5l-3-3a1.5 1.5 0 0 1 0-2.1l7.9-9.4a1.5 1.5 0 0 1 2.1 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 9.5 6 6M12 19h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.8" />
    </Svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
