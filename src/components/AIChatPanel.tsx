
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Member, Proposal, VotesState, CRITERIA } from '../types';
import { CORE_TEAM_IDS } from '../constants';
import { generateReportText } from '../utils/formatReport';
import { Send, Bot, Sparkles, Loader2, RefreshCw, FileText, BarChart3, Download, Share2, Printer, Table, Brain, Calculator, FileType } from 'lucide-react';

interface AIChatPanelProps {
  proposals: Proposal[];
  members: Member[];
  votes: VotesState;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIScoreData {
  proposalId: string;
  proposalName: string;
  scores: number[]; 
  reasoning: string[]; 
  totalScore: number;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ proposals, members, votes }) => {
  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Protocolo Gênese v3.5 (Clean Text) Ativo. Plano de Batalha Trello v2.0 carregado. Aguardando diretrizes do Arquiteto Edivaldo.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [aiScores, setAiScores] = useState<AIScoreData[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Default to 'doc' (Documento Oficial)
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'doc' | 'ai-scoring' | 'text' | 'export'>('doc'); 

  const chatEndRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // --- HELPERS ---
  const buildContext = () => {
    let context = `DADOS DO AMBIENTE (PROTOCOLO GÊNESE v3.5 - CLEAN TEXT):\n`;
    context += `ARQUITETO DO SISTEMA: Edivaldo Junior (Líder Frontend / Squad Bravo).\n`;
    context += `PLANO DE BATALHA TRELLO V2.0 (ATIVO):\n`;
    context += `META DO SPRINT 1: API Funcional (Upload+Deploy) e Protótipos de UI.\n`;
    
    context += `CRITÉRIOS DE AVALIAÇÃO:\n${CRITERIA.map((c, i) => `${i+1}. ${c}`).join('\n')}\n\n`;

    const coreStats = calculateStats();
    const winner = coreStats[0];

    context += `STATUS ATUAL DA VOTAÇÃO:\n`;
    context += `Vencedor Atual: ${winner.name} (Média: ${winner.average}/20).\n`;
    
    context += `DETALHAMENTO DAS PROPOSTAS:\n`;
    proposals.forEach(p => {
        context += `>>> PROJETO ID: ${p.id} | NOME: ${p.name}\n`;
        p.descriptions.forEach((d, i) => context += `      - Critério ${i+1}: ${d || "NÃO PREENCHIDO"}\n`);
    });

    return context;
  };

  const calculateStats = () => {
    const coreMembers = members.filter(m => CORE_TEAM_IDS.includes(m.id));

    return proposals.map(p => {
        let totalPoints = 0;
        let voteCount = 0;
        
        coreMembers.forEach(m => {
            const userVotes = votes[m.id]?.[p.id];
            if(userVotes) {
                Object.values(userVotes).forEach(v => {
                    const val = v as number;
                    if(val > 0) {
                        totalPoints += val;
                        voteCount++;
                    }
                });
            }
        });

        const rawAverage = voteCount > 0 ? (totalPoints / voteCount) : 0; 
        
        return {
            id: p.id,
            name: p.name,
            totalPoints,
            average: rawAverage.toFixed(1),
            percent: Math.min(100, (rawAverage / 20) * 100) 
        };
    }).sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
  };

  const stats = calculateStats();
  const winner = stats[0];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- ACTIONS ---

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoadingChat(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const context = buildContext();
        
        const systemInstruction = `
        IDENTIDADE: Você é o 'Arquiteto Virtual MatrizCognis', assistente estratégico do Edivaldo Junior.
        DIRETRIZ: NÃO use emojis. Seja técnico e direto.
        `;

        const prompt = `${context}\n\nPERGUNTA: ${userMsg}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { systemInstruction }
        });

        setMessages(prev => [...prev, { role: 'model', text: response.text || 'Falha no protocolo.' }]);

    } catch (error) {
        console.error("Erro IA:", error);
        setMessages(prev => [...prev, { role: 'model', text: 'Erro de conexão com a API.' }]);
    } finally {
        setIsLoadingChat(false);
    }
  };

  const handleAIScoring = async () => {
    setIsAnalyzing(true);
    setActiveSubTab('ai-scoring');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let dataPrompt = `Analise as propostas. CRITÉRIOS DE 1 a 5:\n`;
        CRITERIA.forEach((c, i) => dataPrompt += `${i+1}. ${c}\n`);
        
        dataPrompt += `\nPROPOSTAS:\n`;
        proposals.forEach(p => {
             dataPrompt += `ID: ${p.id} | Nome: ${p.name}\n`;
             p.descriptions.forEach((d, i) => dataPrompt += `  Critério ${i+1}: ${d || "Vazio"}\n`);
        });

        const prompt = `
        ${dataPrompt}
        TAREFA: Atribua notas de 1 a 5.
        Retorne APENAS JSON: [{ "proposalId": "string", "proposalName": "string", "scores": [n,n,n,n], "reasoning": ["s","s","s","s"] }]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const jsonText = response.text;
        if (jsonText) {
            const parsedData = JSON.parse(jsonText);
            const enrichedData: AIScoreData[] = parsedData.map((item: any) => ({
                ...item,
                totalScore: item.scores.reduce((a: number, b: number) => a + b, 0)
            })).sort((a: AIScoreData, b: AIScoreData) => b.totalScore - a.totalScore);
            
            setAiScores(enrichedData);
            setMessages(prev => [...prev, { role: 'model', text: 'Auditoria concluída.' }]);
        }
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: 'Erro na auditoria.' }]);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleDeepAnalysis = async () => {
    setIsAnalyzing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const context = buildContext();
        
        const prompt = `${context}\nGere um RELATÓRIO TÉCNICO EXECUTIVO. Veredito, Arquitetura e Riscos. Sem emojis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        setAnalysisResult(response.text || "Sem análise.");
        setActiveSubTab('text'); 
    } catch (error) {
        setAnalysisResult("Erro ao gerar análise.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleExportWord = () => {
    if (!reportRef.current) return;
    const content = reportRef.current.innerHTML;
    const styles = `<style>body{font-family:'Arial';}table{width:100%;border-collapse:collapse}td,th{border:1px solid #000;padding:5px}</style>`;
    const sourceHTML = `<html><head><title>Relatório</title>${styles}</head><body>${content}</body></html>`;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `relatorio_${new Date().toISOString().slice(0,10)}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };
  
  const handleDownloadDoc = () => {
     const docText = generateReportText(votes, members, proposals);
     const blob = new Blob([docText], { type: 'text/markdown' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `matriz_analise.md`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
  };

  const handleCopyDoc = () => {
    const docText = generateReportText(votes, members, proposals);
    navigator.clipboard.writeText(docText);
    alert('Documento Oficial copiado!');
  };

  const handleCopyText = () => {
    if(!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    alert('Copiado!');
  };

  const handlePrint = () => {
    const printContent = reportRef.current;
    if (!printContent) return;
    const win = window.open('', '', 'height=700,width=900');
    if(win) {
        win.document.write('<html><body>');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => win.print(), 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatAIResponse = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => (
        <div key={idx} className="mb-1">{line}</div>
    ));
  };

  const renderVisualReport = () => (
    <div ref={reportRef} className="space-y-8 p-6 bg-white dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold">Relatório Visual</h1>
        {stats.map((stat) => (
            <div key={stat.id}>
                <div className="flex justify-between text-sm mb-1">
                    <span>{stat.name}</span>
                    <span>{stat.average} / 20</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${stat.percent}%` }}></div>
                </div>
            </div>
        ))}
    </div>
  );

  const renderAIScoringPanel = () => {
    if (!aiScores) return <div className="p-8 text-center"><button onClick={handleAIScoring} className="bg-purple-600 text-white px-4 py-2 rounded">Iniciar Auditoria IA</button></div>;
    return (
        <div className="space-y-4 p-4">
            {aiScores.map((score, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded border">
                    <h3 className="font-bold">{score.proposalName}: {score.totalScore}/20</h3>
                    <div className="text-xs mt-2 space-y-1">
                        {score.reasoning.map((r, i) => <p key={i}>Critério {i+1}: {r}</p>)}
                    </div>
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[600px] animate-fade-in">
      <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2"><Sparkles size={20} /><h2 className="font-bold text-lg">Central de Auditoria</h2></div>
            <div className="flex gap-2">
                <button onClick={handleAIScoring} className="bg-white/20 text-xs font-bold py-2 px-3 rounded flex items-center gap-2"><Calculator size={14} /> Pontuar</button>
                <button onClick={handleDeepAnalysis} disabled={isAnalyzing} className="bg-white/20 text-xs font-bold py-2 px-3 rounded flex items-center gap-2">{isAnalyzing ? '...' : 'Resumo CTO'}</button>
            </div>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
             <button onClick={() => setActiveSubTab('doc')} className={`flex-1 min-w-[100px] py-3 text-xs font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'doc' ? 'bg-white dark:bg-slate-800 border-b-2 border-orange-500 text-orange-600' : 'text-slate-500'}`}><FileType size={14} /> Doc Oficial</button>
             <button onClick={() => setActiveSubTab('visual')} className={`flex-1 min-w-[100px] py-3 text-xs font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'visual' ? 'bg-white dark:bg-slate-800 border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}><BarChart3 size={14} /> Visual</button>
             <button onClick={() => setActiveSubTab('ai-scoring')} className={`flex-1 min-w-[100px] py-3 text-xs font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'ai-scoring' ? 'bg-white dark:bg-slate-800 border-b-2 border-purple-500 text-purple-600' : 'text-slate-500'}`}><Brain size={14} /> IA Score</button>
             <button onClick={() => setActiveSubTab('text')} className={`flex-1 min-w-[100px] py-3 text-xs font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'text' ? 'bg-white dark:bg-slate-800 border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}><FileText size={14} /> Parecer</button>
             <button onClick={() => setActiveSubTab('export')} className={`flex-1 min-w-[100px] py-3 text-xs font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'export' ? 'bg-white dark:bg-slate-800 border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-500'}`}><Download size={14} /> Exportar</button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
            {activeSubTab === 'doc' && (
                 <div className="p-6 h-full flex flex-col">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm flex-1 flex flex-col">
                         <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                             <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><FileText className="text-orange-500" size={18} /> Modelo Markdown</h3>
                             <div className="flex gap-2">
                                 <button onClick={handleCopyDoc} className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded flex items-center gap-1"><Share2 size={12} /> Copiar</button>
                                 <button onClick={handleDownloadDoc} className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 px-3 py-1.5 rounded flex items-center gap-1"><Download size={12} /> Baixar</button>
                             </div>
                         </div>
                         <textarea readOnly value={generateReportText(votes, members, proposals)} className="w-full flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 font-mono text-xs leading-relaxed resize-none outline-none" />
                    </div>
                 </div>
            )}
            {activeSubTab === 'visual' && <div className="p-4">{renderVisualReport()}</div>}
            {activeSubTab === 'ai-scoring' && <div className="p-4">{renderAIScoringPanel()}</div>}
            {activeSubTab === 'text' && <div className="p-6">{analysisResult ? <div className="p-4 bg-white dark:bg-slate-800 rounded border">{formatAIResponse(analysisResult)}</div> : <p className="text-center p-8 text-slate-400">Sem análise.</p>}</div>}
            {activeSubTab === 'export' && <div className="p-8 flex flex-col gap-4 items-center justify-center h-full"><button onClick={handleExportWord} className="bg-blue-600 text-white py-3 px-6 rounded font-bold shadow-lg">Baixar .DOC</button><button onClick={handlePrint} className="bg-slate-700 text-white py-3 px-6 rounded font-bold shadow-lg">Imprimir PDF</button></div>}
        </div>
      </div>
      <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
         <div className="bg-slate-100 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3"><div className="bg-accent text-white p-2 rounded-lg shadow-sm"><Bot size={24} /></div><div><h3 className="font-bold text-slate-900 dark:text-white">Arquiteto Virtual</h3><p className="text-xs text-slate-500 dark:text-slate-400">Protocolo Gênese v3.5 Ativo</p></div></div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
            {messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none'}`}>{formatAIResponse(msg.text)}</div></div>))}
            {isLoadingChat && <div className="flex justify-start"><div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2"><Loader2 className="animate-spin text-accent" size={16} /><span className="text-xs text-slate-500">...</span></div></div>}
            <div ref={chatEndRef} />
         </div>
         <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="relative"><textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Pergunte ao Arquiteto..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-accent outline-none resize-none dark:text-white max-h-32 shadow-inner" rows={1} /><button onClick={handleSendMessage} disabled={!inputText.trim() || isLoadingChat} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-accent text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-accent transition-colors shadow-sm"><Send size={16} /></button></div>
         </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
