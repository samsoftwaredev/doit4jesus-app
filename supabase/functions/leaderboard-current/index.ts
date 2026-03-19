import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json().catch(() => ({}));
    const tab = body.tab ?? 'this_week';
    const limit = Math.min(Number(body.limit) || 50, 200);

    // Compute week boundaries
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    if (tab === 'last_week') {
      weekStart.setDate(weekStart.getDate() - 7);
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartStr = weekStart.toISOString().slice(0, 10);
    const weekEndStr = weekEnd.toISOString().slice(0, 10);

    const { data, error } = await supabase.rpc('get_weekly_leaderboard', {
      p_week_start: weekStartStr,
      p_week_end: weekEndStr,
      p_limit: limit,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        data,
        week_start: weekStartStr,
        week_end: weekEndStr,
        total_participants: data?.length ?? 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
