
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeCardProps {
  title: string;
  language: string;
  code: string;
  description?: string;
}

const CodeCard = ({ title, language, code, description }: CodeCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-headings font-semibold text-accent mb-1">
              {title}
            </h3>
            <span className="text-sm text-subtle-text font-mono">
              {language}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-subtle-text hover:text-accent"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        {description && (
          <p className="text-subtle-text mb-4">{description}</p>
        )}
        
        <div className="bg-shadow-blue rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-accent">
            <code>{code}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeCard;
