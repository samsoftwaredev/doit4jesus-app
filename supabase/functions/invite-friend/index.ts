// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const emailBody = ({ userName, friendName }) => `
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

  <h2>${userName} is calling you to join a prayer session.</h2>
  <p>${friendName} don’t go solo on your prayer journey.</p>
  <p>Team up with friends and let your spirituality soar to divine heights.</p>
  <p>Will you answer the call to uplift your spirit?</p>
  <b><a href="https://www.doit4jesus.com/sign-up">Accept Invite</a></b>
  <br />
  <p>DoIt4Jesus</p>
  <p>Pray with millions around the world!</p>
`;

Deno.serve(async (req) => {
  // This is needed to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: `${payload.fullName} - DoIt4Jesus <admin@doit4jesus.com>`,
        to: payload.friendEmail,
        subject: `${payload.friendName}, it’s time to level up in faith together!`,
        html: emailBody({
          userName: payload.fullName,
          friendName: payload.friendName,
        }),
      }),
    });

    const emailData = await res.json();
    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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

  curl --location --request POST 'http://127.0.0.1:54321/functions/v1/invite-friend' \
  --header 'Authorization: Bearer  <RESEND_API_KEY>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "fullName": "Samuel Ruiz",
      "friendName": "Jose Santos",
      "friendEmail": "gero@fastmail.com"
  }'

*/
