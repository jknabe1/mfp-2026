import { Metadata } from 'next';
import EventGrid from '@/components/Event/EventGrid';

export const metadata: Metadata = {
  title: 'Event & Konserter - Music For Pennies',
  description: 'Utforska alla kommande och tidigare event, konserter och arrangemang hos Music For Pennies. Boka dina biljetter nu!',
  openGraph: {
    title: 'Event & Konserter - Music For Pennies',
    description: 'Utforska alla kommande och tidigare event, konserter och arrangemang hos Music For Pennies.',
    url: 'https://musicforpennies.se/events',
    type: 'website',
  },
};

export default function EventsPage() {
  return <EventGrid />;
}
