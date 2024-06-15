import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const emailBody = ({ message }) => `
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
 
  <p>${message}</p>
`;

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateName = (name) => {
  return String(name)
    .toLowerCase()
    .match(/^[a-zA-Z0-9]{2,20}$/);
};

Deno.serve(async (req) => {
  // This is needed to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    if (!payload.userName || validateName(payload.userName) === false) {
      throw new Error("Invalid Name or is empty");
    }
    if (!payload.userMessage || payload.userMessage.length < 2) {
      throw new Error("Invalid Message or message is too short");
    }
    if (!payload.userEmail || validateEmail(payload.userEmail) === false) {
      throw new Error("Invalid Email or is empty");
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: `${payload.userName} <admin@doit4jesus.com>`,
        to: ["admin@doit4jesus.com"],
        subject: `${payload.userName} is trying to contact you!`,
        html: emailBody({
          message: `User: ${payload.userName}\nEmail: ${payload.userEmail}\n\n${payload.userMessage}`,
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
