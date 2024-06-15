import type { NextPage } from "next";
import { Meta } from "@/components";
import { MainLayout } from "@/components/Templates";
import { Container, Typography } from "@mui/material";
import { COMPANY } from "../constants";

const TermsOfService: NextPage = () => {
  const appName = COMPANY.nameAbbr;
  return (
    <MainLayout>
      <Meta pageTitle="Register" />
      <Container maxWidth="lg">
        <Typography mt={3} variant="h4" component="h1">
          Terms of Service
        </Typography>
        <Typography variant="body1" component="p">
          Welcome to {appName}! We&apos;re delighted to have you join our online
          community dedicated to connecting people through prayer. Before you
          begin using our platform, please take a moment to review our Terms of
          Service. By accessing or using our services, you agree to abide by
          these terms. If you have any questions, feel free to reach out to our
          support team.
          <p>
            <b> 1. Acceptance of Terms</b>
            <br />
            By accessing or using {appName}, you agree to be bound by these
            Terms of Service, as well as any additional terms and conditions
            that may apply to specific features or services within the platform.
          </p>
          <p>
            <b>2. User Eligibility</b>
            <br /> You must be at least 13 years old to use our services. By
            using {appName}, you represent and warrant that you have the legal
            capacity to enter into these terms and conditions.
          </p>
          <p>
            <b>3. User Accounts</b>
            <br /> To access certain features of our platform, you may need to
            create a user account. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account.
          </p>
          <p>
            <b>4. User Conduct</b>
            <br /> You agree to use {appName} in accordance with all applicable
            laws and regulations. You must not use our platform to engage in any
            unlawful, harmful, or fraudulent activities. Additionally, you agree
            not to:
            <ul>
              <li>Impersonate any person or entity.</li>
              <li>Interfere with or disrupt the operation of the platform. </li>
              <li>Transmit any viruses, malware, or other malicious code. </li>
              <li>Violate the privacy rights of others.</li>
              <li>Engage in any activity that could harm or exploit minors.</li>
            </ul>
          </p>
          <p>
            <b>5. Content Guidelines</b>
            <br /> You retain ownership of any content that you post or upload
            to {appName}. However, by submitting content to our platform, you
            grant us a worldwide, non-exclusive, royalty-free license to use,
            reproduce, modify, and distribute your content for the purpose of
            operating and improving our services. You agree not to post any
            content that is: False, misleading, or deceptive. Infringing upon
            the intellectual property rights of others. Obscene, offensive, or
            inappropriate. Violating any applicable laws or regulations.
          </p>
          <p>
            <b> 6. Privacy</b>
            <br /> Your privacy is important to us. Please review our{" "}
            <a href="/privacy-policy">Privacy Policy</a> to understand how we
            collect, use, and disclose your personal information.
          </p>
          <p>
            <b>7. Termination</b>
            <br /> We reserve the right to suspend or terminate your access to{" "}
            {appName} at any time and for any reason, without prior notice or
            liability.
          </p>
          <p>
            <b> 8. Changes to Terms</b>
            <br /> We may modify these Terms of Service at any time. If we make
            material changes, we will notify you by email or through the
            platform. Your continued use of {appName} after the effective date
            of the revised terms constitutes your acceptance of the changes.
          </p>
          <p>
            <b>9. Disclaimer of Warranties</b>
            <br />
            {appName} is provided on an &quot;as-is&quot; and
            &quot;as-available&quot; basis, without any warranties of any kind,
            express or implied. We do not warrant that our platform will be
            uninterrupted, secure, or error-free.
          </p>
          <p>
            <b>10. Limitation of Liability</b>
            <br /> To the fullest extent permitted by law, we shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising out of or relating to your use of {appName}
            , even if we have been advised of the possibility of such damages.
          </p>
          <p>
            <b>11. Governing Law</b>
            <br /> These Terms of Service shall be governed by and construed in
            accordance with the laws of State of Texas, without regard to its
            conflict of laws principles.
          </p>
          <p>
            <b>12. Contact Us</b>
            <br /> If you have any questions or concerns about these Terms of
            Service, please contact us at{" "}
            <a href="mailto:admin@doit4jesus.com">admin@doit4jesus.com</a>.
          </p>
          Thank you for using {appName}! We hope you find our platform to be a
          valuable resource for connecting with others in prayer.
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default TermsOfService;
