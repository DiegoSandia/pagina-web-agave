'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GTAG = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

/** Meta Pixel + Google tag. Renders nothing until their IDs are set in the environment. */
export default function AdTags() {
  const pathname = usePathname();
  const first = useRef(true);

  // The base snippets log the first page view; client-side navigations log the rest.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
    window.gtag?.('event', 'page_view', { page_path: pathname });
  }, [pathname]);

  return (
    <>
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
      {GTAG && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GTAG}`} strategy="afterInteractive" />
          <Script id="google-tag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GTAG}');`}
          </Script>
        </>
      )}
    </>
  );
}
