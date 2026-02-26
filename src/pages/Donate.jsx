import { useState } from "react";

export default function Donate() {
  const [amount, setAmount] = useState("");

  const quickAmounts = [500, 1000, 2000];

  return (
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12 pt-36 md:py-36">
      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Donation
        </h2>

        <form className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Your mobile number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email ID
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Your email address"
            />
          </div>

          {/* Donation Amount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Donation Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />

            {/* Quick Amount Buttons */}
            <div className="flex gap-3 mt-3">
              {quickAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition font-medium"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" id="agree" className="mt-1" required />
            <label htmlFor="agree" className="text-gray-700 text-sm">
              I confirm that the above details are correct and I agree to proceed with the donation.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            Donate
          </button>

        </form>
      </div>
    </section>
  );
}