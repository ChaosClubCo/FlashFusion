import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service – FlashFusion</title>
        <meta name="description" content="Terms and conditions for using FlashFusion." />
        <link rel="canonical" href="https://flashfusion.dev/terms" />
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div 
          className="relative z-10"
        >
          <main id="main" className="py-20 px-4">
            <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
              <h1>Terms of Service</h1>
              <p className="lead">Last updated: October 15, 2025</p>

              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using FlashFusion, you accept and agree to be bound by the terms 
                and provisions of this agreement.
              </p>

              <h2>Use License</h2>
              <p>
                Permission is granted to use FlashFusion for personal and commercial purposes 
                within the limits of your subscription tier.
              </p>

              <h2>Usage Limits</h2>
              <p>
                Each plan tier has specific usage limits:
              </p>
              <ul>
                <li><strong>Free:</strong> 10 generations per month</li>
                <li><strong>Pro:</strong> Unlimited generations</li>
                <li><strong>Enterprise:</strong> Custom limits</li>
              </ul>

              <h2>AI-Generated Content</h2>
              <p>
                You acknowledge that:
              </p>
              <ul>
                <li>AI-generated code requires review before production use</li>
                <li>FlashFusion is not liable for errors in generated code</li>
                <li>You are responsible for testing and validating all outputs</li>
              </ul>

              <h2>Prohibited Uses</h2>
              <p>
                You may not use FlashFusion to:
              </p>
              <ul>
                <li>Generate malicious or harmful software</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to reverse engineer our AI models</li>
              </ul>

              <h2>Service Availability</h2>
              <p>
                We strive for 99.9% uptime but do not guarantee uninterrupted service. 
                Scheduled maintenance will be announced in advance.
              </p>

              <h2>Termination</h2>
              <p>
                We may terminate or suspend access to our service immediately, without prior 
                notice or liability, for any reason whatsoever.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                FlashFusion shall not be liable for any indirect, incidental, special, 
                consequential or punitive damages resulting from your use of the service.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the 
                service constitutes acceptance of modified terms.
              </p>

              <h2>Contact</h2>
              <p>
                For questions about these Terms, please contact us at legal@flashfusion.dev
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
