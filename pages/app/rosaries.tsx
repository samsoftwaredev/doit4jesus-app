import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AppWrapper from '@/components/AppWrapper';
import Loading from '@/components/Loading';
import AllEventSection from '@/components/Sections/AllEventSection';
import { AppLayout } from '@/components/Templates';
import { useLanguageContext } from '@/context/LanguageContext';
import { DataEvent, LANG } from '@/interfaces';
import { fetchEvents } from '@/services/eventsApi';
import { normalizeEvent } from '@/utils';

const App: NextPage = () => {
  const { lang, t } = useLanguageContext();
  const [events, setEvents] = useState<DataEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async (lang: LANG) => {
    setIsLoading(true);
    try {
      const data = await fetchEvents(lang);
      if (data) setEvents(normalizeEvent(data));
    } catch (error) {
      console.error('Error in app/index (getEvents):', error);
      toast.error(t.unableToGetListOfEvents);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEvents(lang);
  }, [lang]);

  return (
    <AppLayout>
      {isLoading ? <Loading isFeature /> : <AllEventSection events={events} />}
    </AppLayout>
  );
};

const RosariesPageWrapper = () => {
  return (
    <AppWrapper>
      <App />
    </AppWrapper>
  );
};

export default RosariesPageWrapper;
