import { Link } from "react-router-dom";
import { FileText, Gift, MessageSquare, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to SeralSeva</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your one-stop solution for lodging grievances, accessing government
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features of SeralSeva
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: FileText,
              title: "Grievance Redressal",
              desc: "Easily lodge and track your grievances with our user-friendly platform.",
            },
            {
              icon: Gift,
              title: "Government Schemes",
              desc: "Access information about all government schemes and benefits available to you.",
            },
            {
              icon: MessageSquare,
              title: "AI Assistant",
              desc: "Get instant assistance with your queries using our AI-powered chatbot.",
            },
            {
              icon: TrendingUp,
              title: "Track Progress",
              desc: "Monitor the status and resolution of your grievances in real-time.",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <Icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Grievances Lodged</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                100+
              </div>
              <div className="text-gray-600">Government Schemes</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8">
            Join thousands of citizens who are already using SaralSeva to access
            government services
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
