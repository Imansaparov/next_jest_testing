import { cn } from '@/shared/lib/cn';

type FooterLink = {
  href: string;
  mobileLabel?: string;
  label: string;
};

const FOOTER_LINKS: readonly FooterLink[] = [
  { href: '#terms', label: 'Terms of Service', mobileLabel: 'Terms' },
  { href: '#privacy', label: 'Privacy Policy' },
  { href: '#shipping', label: 'Shipping Info' },
  { href: '#contact', label: 'Contact Us', mobileLabel: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-4 pt-0 pb-[30px] text-center md:pt-8 md:pb-[72px] lg:pb-[6px]">
      <nav aria-label="Footer">
        <ul className="flex justify-center gap-6 md:gap-0">
          {FOOTER_LINKS.map((link, index) => (
            <li
              key={link.href}
              className={cn(
                !link.mobileLabel && 'hidden md:block',
                'relative',
                index > 0 &&
                  'md:before:absolute md:before:top-1/2 md:before:left-0 md:before:h-[1.05em] md:before:w-[2px] md:before:-translate-y-1/2 md:before:bg-ink'
              )}
            >
              <a
                href={link.href}
                className="font-semibold tracking-wide uppercase hover:underline md:px-2 md:text-[0.82rem] min-[1424px]:text-[0.95rem]"
              >
                {link.mobileLabel ? (
                  <>
                    <span className="md:hidden">{link.mobileLabel}</span>
                    <span className="hidden md:inline">{link.label}</span>
                  </>
                ) : (
                  link.label
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-1 hidden text-[0.75rem] font-medium tracking-wide uppercase md:block min-[1424px]:text-sm">
        © {new Date().getFullYear()} The Artisan Kiln. All rights reserved.
      </p>
    </footer>
  );
}
