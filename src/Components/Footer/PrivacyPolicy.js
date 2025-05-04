import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            We value the trust you place in us and recognize the importance of secure transactions and
            information privacy. This Privacy Policy describes how Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>) ("we," "our," "us")
            collects, uses, shares, protects, or otherwise processes your personal information
            through its website and services. By visiting this Platform, providing your information,
            or availing of any product/service offered, you expressly agree to the terms of this
            Privacy Policy, the Terms of Use, and the applicable service/product terms and
            conditions. If you do not agree, please do not use or access our Platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Collection</h2>
          <p>
            We collect personal information relating to your identity, demographics, and interactions
            with our Platform. This includes but is not limited to:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Personal Information: Name, address, mobile number, email ID, and identity verification details (e.g., PAN, GST number, government-issued ID cards).</li>
            <li>Sensitive Information: Payment details, biometric data (e.g., facial features for specific features), and passwords.</li>
            <li>Usage Data: Browsing history, preferences, device location, and other data shared during your interaction with the Platform.</li>
          </ul>
          <p className="mt-2">
            We collect this information to provide a safe, efficient, and customized experience. While
            browsing certain sections of the Platform does not require registration, specific features
            and services do. You may choose not to provide certain information but doing so may limit
            access to those features or services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Use</h2>
          <p>We use personal information to:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Facilitate transactions and services.</li>
            <li>Enhance customer experience.</li>
            <li>Resolve disputes and troubleshoot issues.</li>
            <li>Send offers, updates, and marketing communications (with an option to opt out).</li>
            <li>Conduct market research and analysis.</li>
            <li>Protect against fraud and criminal activities.</li>
          </ul>
          <p className="mt-2">
            With your permission, we may access your SMS, contacts, camera, location, and other device
            information to improve your experience on the Platform. Denying permission may affect
            access to certain features.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p>We use cookies to:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Analyze web traffic and enhance user experience.</li>
            <li>Store preferences for ease of access.</li>
            <li>Support marketing and analytics using third-party tools like Google Analytics.</li>
          </ul>
          <p className="mt-2">
            You can manage cookie preferences via your browser settings, but disabling cookies may
            impact your experience on the Platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Sharing</h2>
          <p>We may share your information:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Within Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>) and affiliated entities.</li>
            <li>With third parties to facilitate transactions, marketing, and services.</li>
            <li>As required by law or to protect our rights and users' safety.</li>
            <li>During mergers, acquisitions, or business restructuring.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Security Precautions</h2>
          <p>
            We adopt industry-standard practices to safeguard your information. While we strive to
            ensure security, data transmission over the internet is not completely secure. You are
            responsible for protecting your account credentials.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Grievance Officer</h2>
          <p>
          Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>)
          </p>
          <p >
          Proprietor :  <span className='text-blue-500 cursor-pointer'>Nitish Kumar</span>
          </p>
          <p>
            Address - Kedar Das Nagar Near Kedia Petrol Pump Gurudwara Road, Chas, BOKARO, Bokaro,
            Jharkhand, 827013
          </p>
          <p>
            You can reach our customer support team to address any of your queries or complaints
            related to product and services by writing to info@retaildukaan.com
          </p>
          <p>
            Phone: +91 9942324747
            <br />
            Time: Mon - Sat (9:00 AM - 6:00 PM)
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Consent</h2>
          <p>
            By using the Platform, you consent to the collection, use, and sharing of your information
            as described in this Privacy Policy. Withdrawal of consent may affect access to certain
            services.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
