import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – FlashFusion</title>
        <meta name="description" content="Learn how FlashFusion collects, uses, and protects your data." />
        <link rel="canonical" href="https://flashfusion.dev/privacy" />
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div 
          className="relative z-10"
        >
          <main id="main" className="py-20 px-4">
            <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
              <h1>Privacy Policy</h1>
              <p className="lead">Last updated: October 15, 2025</p>

              <h2>Data Collection</h2>
              <p>
                FlashFusion collects only the minimum data necessary to provide our services. 
                This includes:
              </p>
              <ul>
                <li>Email addresses for account creation and communication</li>
                <li>First-party analytics data (with your consent)</li>
                <li>Usage metrics to improve our service</li>
              </ul>

              <h2>Data Usage</h2>
              <p>
                We use your data to:
              </p>
              <ul>
                <li>Provide and improve our AI-powered development platform</li>
                <li>Communicate important updates and features</li>
                <li>Analyze usage patterns (only with consent)</li>
              </ul>

              <h2>Data Protection</h2>
              <p>
                Your data is protected with industry-standard encryption and security measures. 
                We never sell your data to third parties.
              </p>

              <h2>AI-Generated Content</h2>
              <p>
                ⚠️ AI-generated content may require review. FlashFusion uses artificial intelligence 
                to generate code and applications. While we strive for accuracy, all AI-generated 
                output should be reviewed before production use.
              </p>

              <h2>Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt out of analytics</li>
                <li>Export your data</li>
              </ul>

              <h2>Contact</h2>
              <p>
                For privacy-related questions, please contact us at privacy@flashfusion.dev
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
