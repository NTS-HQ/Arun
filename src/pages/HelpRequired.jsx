import { useState } from "react";
import { FaPhone, FaHome } from "react-icons/fa";

export default function HelpRequired() {
  const [agreed, setAgreed] = useState(false);

  return (
    <section className="w-full bg-gray-100 py-10 px-4 pt-24 flex justify-center">
      <form className="max-w-3xl w-full bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/40 space-y-6">
        
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Help Request Form
        </h2>

        {/* GRID – FULLNAME + DOB */}
        <div className="grid md:grid-cols-2 gap-5">
          
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Date of Birth *</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* GRID – GENDER */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Gender *</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" />
              Female
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" />
              Other
            </label>
          </div>
        </div>

        {/* GRID – PHONE + EMAIL */}
        <div className="grid md:grid-cols-2 gap-5">
          
          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number *</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full pl-10 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email Address *</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* EMERGENCY */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Is there any emergency? *
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="emergency" />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="emergency" />
              No
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="emergency" />
              Decline to answer
            </label>
          </div>
        </div>

        {/* HELP TYPE */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">What kind of help do you need?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3">
            {["Social", "Medical", "Educational", "Livelihood", "Legal"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="checkbox" />
                {opt}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Decline to answer
            </label>
          </div>
        </div>

        {/* ZIP + ADDRESS */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Zip Code *</label>
            <input
              type="text"
              placeholder="Enter zip code"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-gray-700">Address *</label>
            <div className="relative">
              <FaHome className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full pl-10 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* STATE + DISTRICT */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">State *</label>
            <select className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500">
              <option>Select state</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">District *</label>
            <select className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500">
              <option>Select district</option>
            </select>
          </div>
        </div>

        {/* RULES & REGS CHECKBOX — ADDED AS REQUESTED */}
        <div className="flex items-start gap-3 mt-4">
          <input
            type="checkbox"
            id="rules"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="mt-1"
          />
          <label htmlFor="rules" className="text-gray-700 text-sm">
            I agree to the <strong>Terms & Conditions</strong> and <strong>Rules & Regulations</strong>.
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={!agreed}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition 
            ${agreed ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
          `}
        >
          SUBMIT
        </button>

      </form>
    </section>
  );
}