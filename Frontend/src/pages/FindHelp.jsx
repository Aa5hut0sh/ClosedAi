import React from "react";
import { Navigation } from "../components/Navigate";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";

export const FindHelp = () => {
  const { user } = useContext(AuthContext);

  const faqs = [
    {
      q: "Is this platform a replacement for therapy?",
      a: "No. Aroha provides mental wellness tools, but it is not a replacement for professional mental health treatment. Always reach out to a professional if you're struggling.",
    },
    {
      q: "Are my journal entries private?",
      a: "Yes. Your entries are encrypted and only visible to you.",
    },
    {
      q: "Can I talk to a real counsellor?",
      a: "Yes. We offer scheduled sessions with certified counsellors in the 'Book Session' feature.",
    },
    {
      q: "Is this service free?",
      a: "Most features are free. Premium wellness content may require a subscription.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Need Help? We’re Here for You ❤️
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers, get support, or reach out to us directly.
          </p>
        </div>

        {/* FAQ SECTION */}
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <HelpCircle className="text-pink-500" /> Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((item, idx) => (
              <div key={idx} className="border-b pb-4">
                <p className="text-lg font-semibold text-gray-800">
                  {item.q}
                </p>
                <p className="text-gray-600 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <MessageCircle className="text-purple-500" /> Contact Us
          </h2>

          <p className="text-gray-600 mb-6">
            Have a question or need personal assistance? Reach out to us anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border">
              <Phone className="text-blue-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm text-gray-500">+91 62071 36032</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border">
              <Mail className="text-pink-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-gray-500">support@Aroha.com</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border">
              <MessageCircle className="text-green-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Live Chat</p>
                <p className="text-sm text-gray-500">Available 9am – 6pm</p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg"
            />
            <textarea
              placeholder="Write your message..."
              className="w-full border p-3 rounded-lg h-32"
            ></textarea>

            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
              Send Message
            </button>
          </form>
        </div>

        {/* EMERGENCY CALL TO ACTION */}
        <div className="text-center bg-red-50 border border-red-200 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-red-600 mb-2">
            🚨 If you are in an emergency
          </h3>
          <p className="text-gray-700">
            Please contact your local emergency services or visit the nearest hospital.
          </p>
        </div>
      </div>
    </div>
  );
};
