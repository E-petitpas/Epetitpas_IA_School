import { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface ExportButtonProps {
  content: {
    question?: string;
    answer?: string;
    steps?: string[];
    quizData?: any;
    title?: string;
  };
  type: 'ai-response' | 'quiz' | 'step-by-step';
}

export function ExportButton({ content, type }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = 30;

      // Header with logo text (since we can't easily embed images in jsPDF)
      pdf.setFontSize(20);
      pdf.setTextColor(255, 102, 51); // Orange color
      pdf.text('E-PETITPAS IA SCHOOL', margin, yPosition);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      yPosition += 10;
      pdf.text('Votre assistant éducatif Mr Alex', margin, yPosition);
      yPosition += 20;

      // Content based on type
      if (type === 'ai-response' && content.question && content.answer) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243); // Blue color
        pdf.text('Question:', margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        const questionLines = pdf.splitTextToSize(content.question, maxWidth);
        pdf.text(questionLines, margin, yPosition);
        yPosition += questionLines.length * 6 + 10;

        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Réponse de Mr Alex:', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        const answerLines = pdf.splitTextToSize(content.answer, maxWidth);
        pdf.text(answerLines, margin, yPosition);
      }

      if (type === 'step-by-step' && content.steps) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Explication étape par étape:', margin, yPosition);
        yPosition += 15;

        content.steps.forEach((step, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 30;
          }
          
          pdf.setFontSize(14);
          pdf.setTextColor(76, 175, 80); // Green color
          pdf.text(`Étape ${index + 1}:`, margin, yPosition);
          yPosition += 8;
          
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          const stepLines = pdf.splitTextToSize(step, maxWidth);
          pdf.text(stepLines, margin, yPosition);
          yPosition += stepLines.length * 6 + 10;
        });
      }

      if (type === 'quiz' && content.quizData) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Quiz Généré par Mr Alex', margin, yPosition);
        yPosition += 15;

        content.quizData.questions?.forEach((q: any, index: number) => {
          if (yPosition > 220) {
            pdf.addPage();
            yPosition = 30;
          }
          
          pdf.setFontSize(14);
          pdf.setTextColor(0, 0, 0);
          const questionText = `${index + 1}. ${q.question}`;
          const questionLines = pdf.splitTextToSize(questionText, maxWidth);
          pdf.text(questionLines, margin, yPosition);
          yPosition += questionLines.length * 6 + 5;

          q.options?.forEach((option: string, optIndex: number) => {
            pdf.setFontSize(12);
            const optionText = `   ${String.fromCharCode(97 + optIndex)}) ${option}`;
            const optionLines = pdf.splitTextToSize(optionText, maxWidth);
            pdf.text(optionLines, margin, yPosition);
            yPosition += optionLines.length * 5 + 3;
          });
          yPosition += 8;
        });
      }

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Généré par E-petitpas IA School - ' + new Date().toLocaleDateString(), margin, 280);

      pdf.save(`${type}-${Date.now()}.pdf`);
      toast.success('PDF exporté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const generateWord = async () => {
    setIsExporting(true);
    try {
      const children = [];
      
      // Header
      children.push(
        new Paragraph({
          text: 'E-PETITPAS IA SCHOOL',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: 'Votre assistant éducatif Mr Alex',
          spacing: { after: 400 }
        })
      );

      // Content based on type
      if (type === 'ai-response' && content.question && content.answer) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Question: ',
                bold: true,
                color: '2196F3'
              })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: content.question,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Réponse de Mr Alex: ',
                bold: true,
                color: '2196F3'
              })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: content.answer,
            spacing: { after: 400 }
          })
        );
      }

      if (type === 'step-by-step' && content.steps) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Explication étape par étape',
                bold: true,
                color: '2196F3'
              })
            ],
            spacing: { after: 300 }
          })
        );

        content.steps.forEach((step, index) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Étape ${index + 1}: `,
                  bold: true,
                  color: '4CAF50'
                })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: step,
              spacing: { after: 200 }
            })
          );
        });
      }

      if (type === 'quiz' && content.quizData) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Quiz Généré par Mr Alex',
                bold: true,
                color: '2196F3'
              })
            ],
            spacing: { after: 300 }
          })
        );

        content.quizData.questions?.forEach((q: any, index: number) => {
          children.push(
            new Paragraph({
              text: `${index + 1}. ${q.question}`,
              spacing: { after: 200 }
            })
          );

          q.options?.forEach((option: string, optIndex: number) => {
            children.push(
              new Paragraph({
                text: `   ${String.fromCharCode(97 + optIndex)}) ${option}`,
                spacing: { after: 100 }
              })
            );
          });
          
          children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
        });
      }

      // Footer
      children.push(
        new Paragraph({
          text: `Généré par E-petitpas IA School - ${new Date().toLocaleDateString()}`,
          spacing: { before: 400 }
        })
      );

      const doc = new Document({
        sections: [{
          children
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${Date.now()}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Document Word exporté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export Word:', error);
      toast.error('Erreur lors de l\'export Word');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? 'Export...' : 'Exporter'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={generatePDF} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateWord} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          Exporter en Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}