import { useState, useRef } from "react";
import { getRecommendations } from "../utils/api";
import toast from "react-hot-toast";

const SuggestScheme = () => {
  const [form, setForm] = useState({
    income: "",
    category: "",
  });
  const resultsRef = useRef(null);

  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await getRecommendations(form);

      if (data.success) {
        setResults(data.data);

        toast.success("Suggestions loaded");

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        toast.error(data.message || "Invalid input");
        setResults([]);
      }
    } catch (err) {
      console.error("FULL ERROR:", err);
      toast.error("Something went wrong. Please try again.");

      setResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--txt)] py-10 px-4">
      {/* Header*/}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Smart Scheme Suggestion
        </h1>
        <p className="text-[var(--txt-dim)]">
          Find the most relevant government schemes based on your profile
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="
          bg-[var(--bg-sec)] p-6 md:p-8 rounded-[var(--radius)]
          border border-[var(--bg-ter)] space-y-5
          shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.25)]"
        >
          <h2 className="text-lg font-semibold text-[var(--txt)] mb-2">
            Enter Your Details
          </h2>

          {/* Income */}
          <div>
            <label className="block text-sm text-[var(--txt-dim)] mb-1">
              Annual Income
            </label>
            <input
              type="number"
              placeholder="Enter Annual Income"
              value={form.income}
              onChange={(e) =>
                setForm({ ...form, income: Number(e.target.value) })
              }
              className="
              w-full px-4 py-2.5 bg-[var(--bg-ter)] text-[var(--txt)] 
              rounded-[var(--radius)] border border-[var(--bg-ter)]
              focus:border-[var(--btn)] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-[var(--txt-dim)] mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="
              w-full px-4 py-2.5 bg-[var(--bg-ter)] text-[var(--txt)] 
              rounded-[var(--radius)] border border-[var(--bg-ter)]
              focus:border-[var(--btn)] focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="Agriculture">Farmer</option>
              <option value="Women Empowerment">Widow / Women</option>
              <option value="Education">Student</option>
              <option value="Employment">Job Seeker</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
            w-full bg-[var(--btn)] hover:bg-[var(--btn-hover)]
            text-white py-3 rounded-[var(--radius)]
            font-semibold transition-all duration-200
            shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]"
          >
            Get Suggestions
          </button>
        </form>
      </div>

      {/* Results */}
      <div ref={resultsRef} className="max-w-6xl mx-auto mt-12 scroll-mt-24">
        {results.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-[var(--txt)]">
              Recommended Schemes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((scheme, index) => (
                <div
                  key={scheme._id}
                  className="
                  bg-[var(--bg-sec)] border border-[var(--txt)] p-5
                  rounded-[var(--radius)] transition-all duration-300
                  hover:shadow-[0_12px_30px_rgba(var(--shadow-rgb),0.35)]
                  hover:-translate-y-1 hover:border-none"
                >
                  {/* Title */}
                  <h2 className="text-lg font-semibold mb-2 text-[var(--txt)]">
                    {scheme.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[var(--txt-dim)] text-sm line-clamp-3 mb-3">
                    {scheme.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="
                      text-xs font-medium bg-[rgba(var(--shadow-rgb),0.15)]
                      text-[var(--btn)] px-2.5 py-1 rounded-full"
                    >
                      {scheme.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="text-center mt-12 text-[var(--txt-dim)]">
            No suggestions yet. Fill the form to get recommendations.
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestScheme;
