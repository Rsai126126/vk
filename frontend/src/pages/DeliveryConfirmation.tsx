import { useState } from 'react';
import { PlayCircle, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import Section from '../components/Section';
import FileUploader from '../components/FileUploader';
import InfoBox from '../components/InfoBox';

export default function DeliveryConfirmation() {
  const [axReport, setAxReport] = useState<File | null>(null);
  const [edi214, setEdi214] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!axReport || !edi214) {
      alert('Please upload both files to run analysis.');
      return;
    }
    setLoading(true);
    setToastMessage(null);

    try {
      const form = new FormData();
      form.set('ax_report', axReport);
      form.set('edi214', edi214);

      const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || '';
      const res = await fetch(`${API_BASE}/delivery/delivery-confirmation`, {
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
      a.download = 'AX_Load_Failures.xlsx';
      a.click();
      URL.revokeObjectURL(url);

      setToastMessage('AX Load Failures Excel downloaded successfully');
    } catch (e: any) {
      alert(e.message || 'Failed to process files');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAxReport(null);
    setEdi214(null);
    setToastMessage('Reset complete');
  };

  return (
    <main className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl px-8 py-7 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="text-base font-semibold text-gray-900">Processing delivery confirmation...</div>
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
        title="Delivery Confirmation Analysis"
        caption="Upload AX D1 Report and EDI 214 to identify AX Load Failures"
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <FileUploader
            label="1. AX D1 Report"
            hint="Must include: Pick Number, Customer, 1st/2nd Leg SID/SCAC"
            file={axReport}
            onChange={setAxReport}
          />
          <FileUploader
            label="2. EDI 214 Report"
            hint="Must include: SalesOrderNumber1, StatusSummary, etc."
            file={edi214}
            onChange={setEdi214}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRunAnalysis}
            disabled={loading || !axReport || !edi214}
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
          This analysis posts <code>ax_report</code> and <code>edi214</code> to
          <code> /delivery/delivery-confirmation</code> and returns an Excel file with AX Load Failures
          filtered by Picking List status and AX Load Failure processing status.
        </div>
      </InfoBox>
    </main>
  );
}
