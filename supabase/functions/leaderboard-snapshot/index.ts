import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Weekly snapshot cron job — call via Supabase scheduled function or pg_cron.
 * Snapshots the current week's leaderboard into leaderboards_weekly + leaderboard_history.
 */
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
    const authHeader = req.headers.get('authorization');
    const cronSecret = Deno.env.get('CRON_SECRET');
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Snapshot the previous week (run on Monday morning)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - mondayOffset);
    thisMonday.setHours(0, 0, 0, 0);

    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    const weekStartStr = lastMonday.toISOString().slice(0, 10);
    const weekEndStr = lastSunday.toISOString().slice(0, 10);

    const { error } = await supabase.rpc('snapshot_weekly_leaderboard', {
      p_week_start: weekStartStr,
      p_week_end: weekEndStr,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        message: 'Weekly leaderboard snapshot completed',
        week_start: weekStartStr,
        week_end: weekEndStr,
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
