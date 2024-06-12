import type { NextPage } from "next";
import { Meta } from "@/components";
import { MainLayout } from "@/components/Templates";
import { Container, Typography } from "@mui/material";
import { COMPANY, minAge } from "../constants";

const PrivacyPolicy: NextPage = () => {
  const appName = COMPANY.nameAbbr;
  return (
    <MainLayout>
      <Meta pageTitle="Register" />
      <Container maxWidth="lg">
        <Typography mt={3} variant="h4" component="h1">
          Privacy Policy
        </Typography>
        <Typography variant="body1" component="p">
          <p>Effective Date: 6/8/2024</p>
          <p>
            Thank you for choosing {appName}! Your privacy is important to us,
            and we are committed to protecting your personal information. This
            Privacy Policy outlines how we collect, use, and disclose the
            information you provide to us when you use our platform.
          </p>
          <p>
            <b>1. Information We Collect</b>
            <br />
            <ul>
              <li>
                <b>Personal Information:</b> When you create an account on{" "}
                {appName}, we may collect certain personal information, such as
                your name, email address, and any other information you choose
                to provide.
              </li>
              <li>
                <b>Usage Information:</b> We may collect information about how
                you interact with our platform, including your IP address,
                device type, browser type, pages visited, and the dates and
                times of your visits.
              </li>
              <li>
                <b>Communications:</b> If you contact us for support or other
                inquiries, we may collect information about your communication
                with us, including any messages or attachments you send.
              </li>
            </ul>
          </p>
          <p>
            <b>2. How We Use Your Information</b>
            <br />
            We may use the information we collect for the following purposes:
            <br />
            <ul>
              <li>To provide and maintain our platform.</li>
              <li>To personalize your experience and improve our services.</li>
              <li>
                To communicate with you about your account, updates, and
                promotions.
              </li>
              <li>
                To respond to your inquiries and provide customer support.
              </li>
              <li>
                To detect, prevent, and address technical issues and security
                concerns.
              </li>
              <li>
                To comply with legal obligations and enforce our Terms of
                Service.
              </li>
            </ul>
          </p>
          <p>
            <b>3. Information Sharing and Disclosure</b>
            <br />
            We may share your information with third parties in the following
            circumstances:
            <br />
            <ul>
              <li>
                <b>Service Providers:</b> We may engage third-party service
                providers to assist us in providing and improving our platform.
                These service providers may have access to your personal
                information only to perform tasks on our behalf and are
                obligated not to disclose or use it for any other purpose.
              </li>
              <li>
                <b>Legal Compliance:</b> We may disclose your information if
                required to do so by law or in response to valid requests from
                public authorities (e.g., court orders or government agencies).
              </li>
              <li>
                <b>Business Transfers:</b> If {appName} is involved in a merger,
                acquisition, or sale of assets, your information may be
                transferred as part of that transaction. We will notify you via
                email and/or prominent notice on our platform of any change in
                ownership or use of your personal information.
              </li>
            </ul>
          </p>
          <p>
            <b>3.1. Managing Access to Your Google Account</b>
            <br />
            Your Google Account is a powerful tool that allows you to
            personalize your experience across various Google services. Here’s
            how you can manage access to your account:
            <br />
            <ol>
              <li>
                <b>Sign In:</b> To access your Google Account, simply sign in
                using your credentials. Once signed in, you’ll have seamless
                access to services like Gmail, Google Calendar, and more.
              </li>
              <li>
                <b>Manage Your Account:</b> Click on your profile picture and
                select “Manage your Google Account.” From there, you can update
                basic information, control privacy settings, and review your
                data and preferences.
              </li>
              <li>
                <b>Privacy Controls:</b> Google provides easy-to-use tools for
                managing your privacy. The Privacy Checkup feature allows you to
                choose privacy settings that suit your preferences.{" "}
                <a href="https://support.google.com/a/answer/7281227?hl=en">
                  You can also control what data is saved in your account and
                  delete specific information by date, product, and topic.
                </a>
              </li>
              <li>
                <b>Security:</b> Google prioritizes security by automatically
                detecting and blocking threats. Your account is protected with
                industry-leading security features. Regularly check the Security
                Checkup to ensure your account remains secure.
              </li>
              For more details, visit the Google Account Help article on
              managing your account.
            </ol>
          </p>
          <p>
            <b>3.2. Google OAuth and User Data Usage</b>
            <br />
            Our website uses Google OAuth for authentication purposes. When
            users log in using their Google account, we collect the following
            information:
            <br />
            <ol>
              <li>
                <b>Email Address:</b> We retrieve the user’s email address to
                create a personalized experience and communicate important
                updates related to their account.
              </li>
              <li>
                <b>Name:</b> The user’s name is used to personalize their
                interactions within our platform. It helps us address them
                appropriately and enhance their overall experience.
              </li>
              <li>
                <b>Profile Picture:</b> We may display the user’s profile
                picture within our application. This feature aims to create a
                more engaging and visually appealing experience for our users.
              </li>
            </ol>
          </p>
          <p>
            <b>3.3. How We Use This Data</b>
            <br />
            <ol>
              <li>
                <b>Enhancing User Experience:</b> We use the collected data to
                tailor our services to each user. Personalization allows us to
                provide relevant content, recommendations, and features based on
                their preferences.
              </li>
              <li>
                <b>Communication:</b> We may send email notifications related to
                account updates, security alerts, or new features. The user’s
                email address is essential for effective communication.
              </li>
              <li>
                <b>Displaying Profile Pictures:</b> Users’ profile pictures may
                appear in their profiles, comments, or other relevant sections
                of our platform. This feature fosters a sense of community and
                identity.
              </li>
            </ol>
          </p>
          <p>
            <b>3.5 Data Security: </b>
            <br />
            We take data security seriously. All user information is stored
            securely, and we follow industry best practices to protect it from
            unauthorized access, misuse, or disclosure.
          </p>
          <p>
            <b>3.6. Third-Party Services: </b>
            <br />
            Our website integrates with Google services, including Google OAuth.
            Users should review Google’s privacy policies to understand how
            their data is handled by Google.
          </p>
          <p>
            <b>4. Data Retention</b>
            <br />
            We will retain your personal information for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
          </p>
          <p>
            <b>5. Your Choices and Rights</b>
            <br />
            <ul>
              <li>
                <b>Account Information:</b> You may update or correct your
                account information at any time by logging into your account
                settings.
              </li>
              <li>
                <b>Communications:</b> You may opt out of receiving promotional
                emails from us by following the instructions provided in those
                emails. Please note that even if you opt out, you may still
                receive transactional emails related to your account.
              </li>
              <li>
                <b>Access and Deletion:</b> You may request access to or
                deletion of your personal information by contacting us using the
                information provided below.
              </li>
            </ul>
          </p>
          <p>
            <b>6. Security</b>
            <br />
            We take reasonable measures to protect your personal information
            from unauthorized access, use, or disclosure. However, please be
            aware that no method of transmission over the internet or electronic
            storage is 100% secure.
          </p>
          <p>
            <b>7. Children&apos;s Privacy</b>
            <br />
            {appName} is not intended for use by children under the age of{" "}
            {minAge}. We do not knowingly collect personal information from
            children under {minAge}. If you believe that we may have collected
            personal information from a child under {minAge}, please contact us
            immediately.
          </p>
          <p>
            <b>8. Changes to this Privacy Policy</b>
            <br />
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. We will notify you
            of any material changes by posting the new Privacy Policy on this
            page.
          </p>
          <p>
            <b>9. Contact Us</b>
            <br />
            If you have any questions or concerns about this Privacy Policy,
            please contact us at{" "}
            <a href="mailto:admin@doitforjesus.com">admin@doitforjesus.com</a>.
          </p>
          Thank you for trusting {appName} with your personal information. We
          are honored to serve you in your journey of connecting with others in
          prayer.
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default PrivacyPolicy;
