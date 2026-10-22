import { cn } from '@/shared/lib/cn';
import { UserIcon } from '@/shared/ui/icons';

import { CartIndicator } from '../cart-indicator/cart-indicator';

type NavLink = {
  label: string;
  href: string;
  desktopOnly?: boolean;
};

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', href: '#top', desktopOnly: true },
  { label: 'Shop', href: '#cart' },
  { label: 'Collections', href: '#design-tool' },
  { label: 'About Us', href: '#about' },
  { label: 'FAQ', href: '#faq', desktopOnly: true },
  { label: 'Gallery', href: '#gallery', desktopOnly: true },
  { label: 'Blog', href: '#blog', desktopOnly: true },
];

const WINDOW_DOTS = ['bg-traffic-red', 'bg-traffic-amber', 'bg-traffic-green'];

export function SiteHeader() {
  return (
    <header
      id="top"
      className="relative z-20 flex h-[29px] items-center gap-2 border-b-2 border-ink bg-paper-muted px-[9px] md:h-13 md:gap-4 md:px-4 lg:h-8 lg:px-5"
    >
      <div
        className="mr-1 hidden shrink-0 gap-[5px] min-[400px]:flex md:gap-1"
        aria-hidden="true"
      >
        {WINDOW_DOTS.map(color => (
          <span
            key={color}
            className={cn(
              'size-[9px] rounded-full border border-ink md:size-3.5 md:border-[1.5px]',
              color
            )}
          />
        ))}
      </div>

      <nav aria-label="Main" className="min-w-0 flex-1">
        <ul className="flex items-center justify-center gap-5 md:gap-8 lg:gap-7 xl:gap-9">
          {NAV_LINKS.map(link => (
            <li
              key={link.label}
              className={cn(link.desktopOnly && 'hidden lg:block')}
            >
              <a
                href={link.href}
                className="relative text-[0.83rem] font-semibold tracking-wide whitespace-nowrap uppercase after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:after:scale-x-100 md:text-lg lg:text-base"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-[7px] md:gap-3">
        <CartIndicator />
        <UserIcon className="size-[17px] md:size-7 lg:size-6" />
        <a
          href="#login"
          className="rounded-[4px] border-[1.5px] border-navy-dark bg-navy px-[5px] text-[0.68rem] leading-[14px] font-semibold text-paper transition-colors hover:bg-navy-dark md:rounded-md md:border-2 md:px-2 md:py-0.5 md:text-[0.95rem] md:leading-normal lg:hidden"
        >
          Log In
        </a>
        <span className="hidden rounded-md border-2 border-navy-dark bg-navy px-2 text-[0.95rem] font-semibold text-paper lg:inline-block">
          A. Smith
        </span>
      </div>
    </header>
  );
}
