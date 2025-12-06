import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import "@/styles/assessment-response.css";

const IeltsWritingAssessPage = () => {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // mock response (bạn thay bằng API thật)
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    setSubmitted(true);

    // giả lập RAG call
    setTimeout(() => {
      setResponse(
        "Your essay has clear ideas but needs improvement in coherence and grammar..."
      );
    }, 800);
  };

  return (
    <div className="w-full min-h-screen py-10 px-6 bg-[#F02F34]">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          IELTS Writing Assessment
        </h1>

        <p className="text-white/80 text-xl mt-3 leading-relaxed">
          A powerful tool designed to evaluate your IELTS Writing performance
          using an advanced RAG-enhanced LLM scoring system.
        </p>
      </div>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 110, damping: 20 }}
        className="mx-auto rounded-2xl shadow-lg border p-8 bg-white"
        style={{
          width: submitted ? "90%" : "60%",
        }}
      >
        <motion.div
          layout
          className="flex gap-6 overflow-hidden"
          style={{
            minHeight: submitted ? "350px" : "auto",
          }}
        >
          {/* LEFT SIDE: INPUTS */}
          <motion.div
            layout
            animate={{
              x: submitted ? "-10%" : "0%",
              width: submitted ? "60%" : "100%",
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-2.5">
              <h2 className="text-2xl font-bold mx-auto">Submit your essay</h2>

              <div>
                <Label className="font-semibold mb-2.5 text-md">Topic</Label>
                <Textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Write your IELTS Writing topic here..."
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none"
                />
                <p className="text-sm text-zinc-500 italic mt-2.5">
                  *Note: For IELTS Writing Task 1, please leave this field
                  empty. The system has not yet support chart analysis, so
                  evaluations will focus on language-related criteria (e.g.,
                  vocabulary, wording) rather than the accuracy of the visual
                  data.
                </p>
              </div>

              <div>
                <Label className="font-semibold mb-2.5 text-md">Essay</Label>
                <Textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Write your essay here..."
                  className="min-h-[200px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none"
                />
              </div>

              {!submitted && (
                <Button onClick={handleSubmit} className="w-fit mt-2">
                  Submit
                </Button>
              )}
            </div>
          </motion.div>

          {/* RIGHT SIDE: RESPONSE */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-1/2 bg-gray-50 border rounded-xl p-5"
              >
                <div className="grid gap-2.5">
                  <h2 className="text-2xl font-bold mx-auto">
                    Detailed Assessment
                  </h2>

                  <div
                    className="assessment-response"
                    dangerouslySetInnerHTML={{
                      __html:
                        response || "<p>Processing essay… Please wait</p>",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IeltsWritingAssessPage;
