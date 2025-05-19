import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/classes/SupabaseDB';
import AppWrapper from '@/components/AppWrapper';
import Loading from '@/components/Loading';
import AllEventSection from '@/components/Sections/AllEventSection';
import { AppLayout } from '@/components/Templates';
import { useLanguageContext } from '@/context/LanguageContext';
import { DataEvent, LANG } from '@/interfaces';
import { normalizeEvent } from '@/utils';

const App: NextPage = () => {
  const { lang } = useLanguageContext();
  const [events, setEvents] = useState<DataEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async (lang: LANG) => {
    setIsLoading(true);
    const { data, error } = await db
      .getEvents()
      .select('*')
      .or(`language.eq.${lang},language.is.null`)
      .order('started_at', { ascending: false });
    if (!error) setEvents(normalizeEvent(data));
    else {
      console.error(error);
      toast.error('Unable to get list of events');
    }
    setIsLoading(false);
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

const AppPageWrapper = () => {
  return (
    <AppWrapper>
      <App />
    </AppWrapper>
  );
};

export default AppPageWrapper;
