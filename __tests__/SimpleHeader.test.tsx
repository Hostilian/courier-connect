import { LocationProvider } from '@/components/LocationProvider';
import SimpleHeader from '@/components/SimpleHeader';
import messages from '@/messages/en.json';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock the LanguageSelector component
jest.mock('@/components/LanguageSelector', () => {
  return function DummyLanguageSelector() {
    return <div data-testid="language-selector"></div>;
  };
});

// Mock the next-intl module
jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTranslations: () => (key: string) => {
    if (key === 'logo.name') return 'Courier Connect';
    return key;
  },
  useLocale: () => 'en',
}));

describe('SimpleHeader', () => {
  it('renders the logo and language selector', () => {
    render(
      <LocationProvider>
        <NextIntlClientProvider locale="en" messages={messages}>
          <SimpleHeader />
        </NextIntlClientProvider>
      </LocationProvider>
    );

    // Check if the logo is rendered
    const logo = screen.getByText('Courier Connect');
    expect(logo).toBeInTheDocument();

    // Check if the mocked LanguageSelector is rendered
    const languageSelector = screen.getByTestId('language-selector');
    expect(languageSelector).toBeInTheDocument();
  });
});
