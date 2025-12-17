import React, { useState, useCallback } from 'react';
import { analyzeMedicalTerm } from './services/geminiService';
import { MedicalTermResponse, AnalysisStatus } from './types';
import { MorphologyVisualizer } from './components/MorphologyVisualizer';
import { Search, Stethoscope, BookOpen, Activity, AlertCircle, HelpCircle, FileText, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [data, setData] = useState<MedicalTermResponse | null>(null);
  const [showAcademic, setShowAcademic] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setStatus(AnalysisStatus.LOADING);
    setData(null);
    setShowAcademic(false);
    setErrorMsg('');

    try {
      const result = await analyzeMedicalTerm(input);
      setData(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AnalysisStatus.ERROR);
      setErrorMsg("حدث خطأ أثناء تحليل المصطلح. يرجى المحاولة مرة أخرى.");
    }
  }, [input]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-tajawal selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Dr. Aboudy</h1>
              <p className="text-xs text-slate-400 font-medium">Medical Terminology AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        
        {/* Search Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
              المترجم والمحلل الطبي الذكي
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              أدخل المصطلح الطبي بالإنجليزية أو بنطقه العربي للحصول على تحليل لغوي وترجمة سريرية دقيقة.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-800/90 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="مثال: Hyperglycemia أو هايبرجلايسميا"
                className="w-full bg-transparent px-6 py-4 text-lg md:text-xl text-white placeholder-slate-500 focus:outline-none font-tajawal text-right"
                dir="auto"
              />
              <button 
                type="submit"
                disabled={status === AnalysisStatus.LOADING}
                className="px-6 py-4 bg-transparent text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
              >
                {status === AnalysisStatus.LOADING ? (
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200 mb-8" dir="rtl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Results Section */}
        {status === AnalysisStatus.SUCCESS && data && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. Header & Translation */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 opacity-70"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-700 mb-4">
                  <span className="text-xs font-mono text-blue-300 uppercase tracking-widest">Medical Terminology</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{data.englishTerm}</h2>
                
                <div className="flex flex-col items-center gap-2 mt-4" dir="rtl">
                  <div className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-blue-100">
                    <Globe className="w-6 h-6 text-blue-400" />
                    <span>{data.arabicTranslation}</span>
                  </div>
                  {data.translationNote && (
                    <span className="text-sm text-slate-400 bg-slate-900 px-3 py-1 rounded-full">
                      {data.translationNote}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Morphology Analysis */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4" dir="rtl">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">التحليل اللغوي (Morphology)</h3>
              </div>
              <MorphologyVisualizer parts={data.parts} />
            </div>

            {/* 3. Academic Explanation Toggle */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setShowAcademic(!showAcademic)}
                className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-slate-700/30 transition-colors text-right"
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${showAcademic ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'}`}>
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold text-white">الشرح الطبي الأكاديمي</h3>
                    <p className="text-xs text-slate-400">لطلاب الطب والمختصين</p>
                  </div>
                </div>
                <span className={`text-slate-400 transform transition-transform duration-300 ${showAcademic ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {showAcademic && (
                <div className="px-6 pb-8 md:px-8 border-t border-slate-700/50 pt-6 space-y-6" dir="rtl">
                  
                  <div className="flex gap-4">
                    <div className="w-1 bg-purple-500/50 rounded-full h-auto"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">التعريف الطبي</h4>
                      <p className="text-slate-200 leading-relaxed">{data.academicExplanation.definition}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-1 bg-pink-500/50 rounded-full h-auto"></div>
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-pink-300 uppercase tracking-wider mb-2">الآلية المرضية (Pathophysiology)</h4>
                        <p className="text-slate-200 leading-relaxed">{data.academicExplanation.pathophysiology}</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-1 bg-cyan-500/50 rounded-full h-auto"></div>
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2">السياق السريري</h4>
                        <p className="text-slate-200 leading-relaxed">{data.academicExplanation.clinicalContext}</p>
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Usage Examples */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
               <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4" dir="rtl">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">أمثلة الاستخدام (Clinical Usage)</h3>
              </div>

              <div className="grid gap-4">
                {data.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-900/40 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-2" dir="rtl">
                       <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                         {ex.context}
                       </span>
                    </div>
                    <p className="text-lg text-slate-200 mb-2 font-sans dir-ltr">{ex.sentence}</p>
                    <p className="text-base text-slate-400 font-tajawal dir-rtl text-right border-t border-slate-700/50 pt-2 mt-2">
                      {ex.translation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800 mt-8 font-tajawal">
        <p>Medical AI Assistant powered by Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;