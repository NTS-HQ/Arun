import { useState } from "react";

export default function JoinOurTeam() {
  const [photoName, setPhotoName] = useState("No file chosen");

  return (
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-24">
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Registration Form
        </h2>

        <form className="space-y-5">

          {/* Full Name */}
          <div>
            <label required className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" required
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Family Members */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">No. of Members in Family</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number"
            />
          </div>

          {/* State */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="State"
            />
          </div>

          {/* District */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="District"
            />
          </div>

          {/* Block */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Block</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Block"
            />
          </div>

          {/* City / Village */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">City / Village Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city or village"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pincode"
            />
          </div>

          {/* Referred By */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Referred By (optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Referral name (optional)"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Photo</label>

            <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
              <span className="font-medium text-gray-700">Choose File</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setPhotoName(e.target.files[0].name);
                  }
                }}
              />
              <span className="text-gray-600 text-sm">{photoName}</span>
            </label>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" id="agree" required className="mt-1" />
            <label htmlFor="agree" className="text-gray-700 text-sm">
              I agree to the Terms & Conditions and Rules & Regulations.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            Submit Registration
          </button>

        </form>
      </div>
    </section>
  );
}