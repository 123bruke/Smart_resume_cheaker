import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { analyzeResume } from '../lib/gemini';

export default function ResumeChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      // In a real app, we'd send the file to the server, parse it, and then analyze.
      // For this demo, we'll simulate reading text and using Gemini directly.
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        // Simulate a resume text for analysis if it's not a text file
        const analysisText = text.length > 100 ? text : "Sample resume text for analysis...";
        const analysis = await analyzeResume(analysisText);
        setResult(analysis);
        setLoading(false);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
        <p className="text-slate-500 mb-6">Get instant AI feedback on your resume's strengths and weaknesses.</p>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-12 cursor-pointer hover:border-primary-green transition-colors bg-slate-50/50"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".txt,.pdf,.doc,.docx"
          />
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            {file ? file.name : "Click to upload or drag and drop"}
          </p>
          <p className="text-slate-400 text-sm mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
        </div>

        {file && !loading && !result && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleUpload}
            className="mt-6 bg-primary-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark-green transition-colors"
          >
            Analyze Resume
          </motion.button>
        )}

        {loading && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
            <p className="text-slate-600 font-medium">AI is analyzing your resume...</p>
          </div>
        )}
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Analysis Results</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black text-primary-blue">{result.score}</span>
              <span className="text-slate-400 font-bold">/ 100</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-primary-green flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Strengths
              </h4>
              <ul className="space-y-2">
                {result.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {result.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-primary-blue mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" /> AI Suggestions
            </h4>
            <ul className="space-y-2">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i} className="text-slate-700 text-sm leading-relaxed">
                  • {s}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
