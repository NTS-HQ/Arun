import "../styles/index.css"
export default function PrivacyPolicy() {
  return (
    <section className="w-full bg-white py-30 md:py-20 px-6 lg:px-12 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Privacy Policy
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed">
          This is a sample privacy policy text. Replace this with the actual content 
          provided by your admin or legal team. We value your privacy and are committed 
          to protecting your personal information.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We may collect personal details such as your name, email, contact information, 
            and usage data. This information helps us improve our services.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Information collected is used for communication, service improvement, 
            analytics, personalization, and ensuring platform security.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">3. Data Security</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We follow industry-standard security measures to protect your data, 
            but no method can guarantee 100% security.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">4. Changes to This Policy</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We may update this privacy policy from time to time. Please review it 
            periodically to stay informed about how we protect your information.
          </p>
        </div>

      </div>
    </section>
  );
}