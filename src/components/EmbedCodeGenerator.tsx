import React from 'react';
import { Copy } from 'lucide-react';

interface EmbedCodeGeneratorProps {
  timerId: string;
}

export function EmbedCodeGenerator({ timerId }: EmbedCodeGeneratorProps) {
  const baseUrl = import.meta.env.PROD ? 'https://evled.com' : 'http://localhost:8888';
  const imageUrl = `${baseUrl}/api/timer/${timerId}`;

  const codeOptions = {
    url: imageUrl,
    basic: `<img src="${imageUrl}" border="0" style="display: block" alt="Countdown Timer" title="Countdown Timer">`,
    centered: `<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td align="center">
            <img src="${imageUrl}" border="0" style="display: block; max-width: 100%;" alt="Countdown Timer" title="Countdown Timer">
        </td>
    </tr>
</table>`,
    fullWidth: `<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td align="center">
            <img src="${imageUrl}" border="0" style="display: block; width: 100%; height: auto;" alt="Countdown Timer" title="Countdown Timer">
        </td>
    </tr>
</table>`
  };

  const [selectedOption, setSelectedOption] = React.useState<keyof typeof codeOptions>('basic');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Embed Type</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value as keyof typeof codeOptions)}
        >
          <option value="url">Timer URL</option>
          <option value="basic">HTML Code</option>
          <option value="centered">HTML Code (Centered)</option>
          <option value="fullWidth">HTML Code (Full Width)</option>
        </select>
      </div>

      <div className="relative">
        <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap border border-gray-100">
          {codeOptions[selectedOption]}
        </pre>
        <button
          onClick={() => copyToClipboard(codeOptions[selectedOption])}
          className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors border border-gray-100"
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-gray-600">
        {selectedOption === 'url' 
          ? 'Use this URL like a normal image in your email editor.'
          : 'Copy this code and paste it into your email HTML.'}
      </p>
    </div>
  );
}