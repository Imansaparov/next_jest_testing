import {
  CheckoutForm,
  CustomerFields,
  PaymentMethodPicker,
  PlaceOrderButton,
  ProjectNotesFields,
} from '@/features/checkout';

import {
  mobileHands,
  mobileNotesTiles,
  mobileSprig,
} from '@/shared/assets/decor';
import { DecorImage } from '@/shared/ui/decor';
import { TabHeading } from '@/shared/ui/tab-heading';

import { DesignTool } from '@/widgets/design-tool';
import { OrderHero } from '@/widgets/order-hero';
import { OrderSummaryTotals } from '@/widgets/order-summary';
import { PageDecor } from '@/widgets/page-decor';
import { ShoppingCart } from '@/widgets/shopping-cart';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';


export function OrderPage() {
  return (
    <div
      data-mobile-zoom
      className="@container min-h-dvh bg-paper-deep min-[400px]:p-[2px] md:px-4 md:py-6 lg:px-6"
    >
      <div className="relative mx-auto max-w-2xl overflow-hidden md:max-w-4xl bg-paper min-[400px]:rounded-frame min-[400px]:border-2 min-[400px]:border-ink min-[400px]:shadow-frame lg:max-w-frame">
        <SiteHeader />
        <PageDecor />

        <main className="relative z-10">
          <OrderHero />

          <CheckoutForm className="mt-[12px] grid grid-cols-1 gap-[11px] px-[29px] md:mt-6 md:grid-cols-2 md:gap-x-5 md:gap-y-4 md:px-6 lg:mt-[20px] lg:grid-cols-[380fr_498fr_308fr] lg:grid-rows-[repeat(5,auto)_1fr] lg:gap-x-[30px] lg:gap-y-0 lg:pr-[60px] lg:pl-[69px]">
            <TabHeading className="hidden md:col-start-1 md:row-start-2 md:flex lg:col-start-3 lg:row-start-1">
              Order Summary
            </TabHeading>

            <CustomerFields className="md:col-start-1 md:row-start-3 lg:col-start-3 lg:row-start-2 lg:mt-[10px] lg:px-[11px]" />

            <ShoppingCart className="md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-span-6 lg:row-start-1" />

            <DesignTool className="md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-span-6 lg:row-start-1 lg:-mr-[22px]" />

            <PaymentMethodPicker className="md:col-start-2 md:row-span-3 md:row-start-2 lg:col-start-3 lg:row-span-1 lg:row-start-5 lg:mt-[12px] lg:pr-[11px] lg:pl-[19px]" />

            <div className="relative mt-[3px] flex gap-2.5 pr-[28%] md:col-start-1 md:row-start-4 md:mt-0 md:pr-0 lg:col-start-3 lg:row-start-3 lg:mt-[2px] lg:px-[11px]">
          
              <DecorImage
                src={mobileNotesTiles}
                className="-ml-1 h-[40px] w-auto shrink-0 self-start md:hidden"
              />
              <ProjectNotesFields className="min-w-0 flex-1" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[-2px] -right-4 w-[32.4%] sm:-right-8 md:hidden"
              >
                <DecorImage src={mobileHands} className="h-auto w-full" />
                <DecorImage
                  src={mobileSprig}
                  className="absolute right-0 bottom-[98.9%] h-auto w-[30.8%]"
                />
              </div>
            </div>

            <OrderSummaryTotals className="hidden md:col-start-1 md:row-start-5 md:block lg:col-start-3 lg:row-start-4 lg:px-[11px] lg:pt-[12px]" />

            <PlaceOrderButton className="max-md:-mt-[11px] md:col-start-2 md:row-start-5 md:self-end lg:col-start-3 lg:row-start-6 lg:mt-[13px] lg:self-start lg:pr-[11px] lg:pl-[19px]" />
          </CheckoutForm>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
