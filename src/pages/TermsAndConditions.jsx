import "../styles/index.css"
export default function TermsAndConditions() {
  return (
    <section className="w-full bg-white py-30 md:py-20 px-6 lg:px-12 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed">
          These are sample terms and conditions. Replace this placeholder text with 
          final content approved by your admin or legal department.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            By accessing or using our website, you agree to comply with these terms 
            and conditions. If you do not agree, please discontinue use immediately.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">2. Use of Our Services</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            You agree not to misuse our platform or engage in illegal activities. 
            All content is for informational purposes unless otherwise stated.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">3. Intellectual Property</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            All designs, images, videos, and content are owned by us or our licensors 
            and may not be reused without written permission.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">4. Limitation of Liability</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We are not responsible for any damages arising from the use or inability 
            to use our services. Use at your own risk.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">5. Modifications</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We reserve the right to update or modify these terms at any time. 
            Please review this page periodically for changes.
          </p>
        </div>

      </div>
    </section>
  );
}