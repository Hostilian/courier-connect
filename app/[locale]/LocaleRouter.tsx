import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

/**
 * LocaleRouter: Example of locale-aware navigation using next-intl and Next.js App Router.
 * Use this component to get the current locale and perform locale-prefixed navigation.
 */
export default function LocaleRouter() {
  const locale = useLocale();
  const router = useRouter();

  // Example: Navigate to a locale-prefixed route
  const goToHome = () => {
    router.push(`/${locale}`);
  };

  return (
    <button onClick={goToHome} className="px-4 py-2 bg-blue-600 text-white rounded">
      Go to Home ({locale})
    </button>
  );
}
