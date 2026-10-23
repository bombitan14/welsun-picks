import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultContent, type SiteContent } from '@/types/content';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchContent() {
      const { data, error: queryError } = await supabase
        .from('site_content')
        .select('*')
        .maybeSingle();

      if (!active) return;
      if (queryError) {
        setError(queryError.message);
      } else if (data) {
        setContent(data as SiteContent);
      }
      setLoading(false);
    }

    fetchContent();

    return () => {
      active = false;
    };
  }, []);

  return { content, loading, error, setContent };
}
