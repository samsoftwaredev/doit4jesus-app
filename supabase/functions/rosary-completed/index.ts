import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";
import { corsHeaders } from "../_shared/cors.ts";

const formatDate = (date) => {
  let todayDate = new Date(date).toISOString().slice(0, 10);
  return todayDate;
};

Deno.serve(async (req) => {
  try {
    const todaysDate = new Date();
    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const payload = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Create a user object which contains the data we need to identify the user.id
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // Throw an error if there are any issues with identifying the users from the token
    if (!user) throw new Error("No user found for JWT!");

    let usersWhoPrayedRosary = [];
    if (payload.onlineUsers?.length > 0) {
      usersWhoPrayedRosary = payload.onlineUsers.map((userId) => ({
        user_id: user.id,
        join_rosary_user_id: userId === user.id ? null : userId,
        completed_at: formatDate(todaysDate),
      }));
    } else {
      usersWhoPrayedRosary = [
        {
          user_id: user.id,
          join_rosary_user_id: null,
          completed_at: formatDate(todaysDate),
        },
      ];
    }

    const promises = usersWhoPrayedRosary.map(
      ({ user_id, join_rosary_user_id, completed_at }) => {
        return supabaseClient.rpc("insert_into_rosary_stats", {
          p_user_id: user_id,
          p_join_rosary_user_id: join_rosary_user_id,
          p_completed_at: completed_at,
        });
      }
    );

    await Promise.all(promises);

    // Return a response of the user completed the rosary of the day
    return new Response(JSON.stringify({ message: "Rosary completed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Return an error with the error message should it run in to any issues
    return new Response(JSON.stringify({ message: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl --location --request POST 'http://127.0.0.1:54321/functions/v1/rosary-completed' \
  --header 'Authorization: Bearer  <RESEND_API_KEY>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "onlineUsers": "[{userId: '123'}]",
  }'
*/
