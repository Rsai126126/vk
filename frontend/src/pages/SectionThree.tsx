import { useState } from 'react';
import { PlayCircle, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import Section from '../components/Section';
import FileUploader from '../components/FileUploader';
import InfoBox from '../components/InfoBox';

export default function SectionThree() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!file1 || !file2 || !file3) {
      alert('Please upload all three files to run analysis.');
      return;
    }
    setLoading(true);
    setToastMessage(null);

    try {
      const form = new FormData();
      form.set('file1', file1);
      form.set('file2', file2);
      form.set('file3', file3);

      const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || '';
      const res = await fetch(`${API_BASE}/no-sonum/analyze`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Request failed ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NO_SONUM_Analysis.xlsx';
      a.click();
      URL.revokeObjectURL(url);

      setToastMessage('NO_SONUM Analysis Excel downloaded successfully');
    } catch (e: any) {
      alert(e.message || 'Failed to process files');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setFile3(null);
    setToastMessage('Reset complete');
  };

  return (
    <main className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl px-8 py-7 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="text-base font-semibold text-gray-900">Processing NO_SONUM analysis...</div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border-l-4 border-green-500 rounded-lg shadow-2xl px-5 py-4 text-sm text-gray-800">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div className="font-medium text-gray-900">{toastMessage}</div>
        </div>
      )}

      <Section
        title="NO_SONUM Analysis"
        caption="Upload three data files for NO_SONUM reconciliation analysis"
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <FileUploader
            label="1. First Data File"
            hint="Primary dataset for NO_SONUM analysis"
            file={file1}
            onChange={setFile1}
          />
          <FileUploader
            label="2. Second Data File"
            hint="Secondary dataset for comparison"
            file={file2}
            onChange={setFile2}
          />
          <FileUploader
            label="3. Third Data File"
            hint="Additional reference data"
            file={file3}
            onChange={setFile3}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRunAnalysis}
            disabled={loading || !file1 || !file2 || !file3}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle className="w-5 h-5" />
            Run Analysis & Download Excel
          </button>

          <button
            onClick={handleReset}
            className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </Section>

      <InfoBox>
        <div>
          This analysis posts three files to <code>/no-sonum/analyze</code> and returns an Excel file
          with NO_SONUM analysis results. Backend endpoint needs to be implemented.
        </div>
      </InfoBox>
    </main>
  );
}
  