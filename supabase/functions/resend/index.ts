// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const emailBody = `
  <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        text-align: center;
        padding: 20px;
    }
    .container {
        max-width: 400px;
        margin: auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
        color: #333;
    }
    p {
        color: #666;
    }
    .bible-verse {
        margin-top: 20px;
        font-style: italic;
        color: #888;
    }
  </style>

  <h2>Ready for a chill vibe? 🎧</h2>
  <p>Let’s hit pause on the daily grind and tune into the rosary’s rhythm. It’s not just a prayer; it’s a spiritual playlist that drops beats of peace and wisdom.</p>
  <b><a href="https://www.doitforjesus.com/app/dashboard">Start praying the Rosary</a></b>
  <p>Join our prayer party and let’s vibe with the divine. Can’t wait to sync our souls in harmony.</p>
  <p>Peace out,</p>
  <br />
  <p>Samuel Ruiz</p>
  <p>CEO | DoIt4Jesus</p>
`;

Deno.serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase SUPABASE_SERVICE_ROLE_KEY - env var exported by default.
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: {
            Authorization: `Bearer ${Deno.env.get(
              "SUPABASE_SERVICE_ROLE_KEY"
            )}`,
          },
        },
      }
    );
    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.auth.admin.listUsers();
    if (error) throw error;
    console.log(data);
    const userEmails = data.users.map(({ email }) => email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Samuel Ruiz - DoIt4Jesus <team@doitforjesus.com>",
        to: userEmails,
        subject: "Bead by Bead: Unveil the Power of Prayer with the Rosary",
        html: emailBody,
      }),
    });

    const emailData = await res.json();
    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
