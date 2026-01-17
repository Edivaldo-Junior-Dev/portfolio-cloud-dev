
import { CRITERIA, VotesState, Member, Proposal } from '../types';

export const generateReportText = (
  votes: VotesState, 
  members: Member[], 
  proposals: Proposal[]
): string => {
  const date = new Date().toLocaleDateString();
  
  let report = `# EXEMPLO DE PREENCHIMENTO COMPLETO: MATRIZ DE ANÁLISE COMPARATIVA\n`;
  report += `(Este é o modelo final para o documento, gerado automaticamente com as avaliações de ${members.length} integrantes)\n\n`;
  report += `---\n\n`;
  
  report += `## 1. DADOS DO PROJETO\n\n`;
  // Considerando que o foco é o projeto da equipe, mas listamos comparativos
  const mainProject = proposals[0] ? proposals[0].name : "Não definido";
  
  report += `* **Projeto Principal:** ${mainProject}\n`;
  report += `* **Data da Análise:** ${date}\n`;
  report += `* **Propostas Analisadas:** ${proposals.length}\n\n`;
  report += `---\n\n`;
  
  report += `## 2. ANÁLISE TÉCNICA POR CRITÉRIO\n\n`;

  CRITERIA.forEach((criterion, idx) => {
    report += `### Critério ${idx + 1}: ${criterion}\n`;
    report += `> Critério de avaliação técnica.\n\n`;
    
    proposals.forEach((p, pIdx) => {
        report += `* **Análise da Proposta ${pIdx + 1} (${p.name}):**\n  "${p.descriptions[idx] || "Sem descrição definida."}"\n\n`;
    });
    
    report += `**(Avaliações da Equipe)**\n`;
    members.forEach(m => {
        const scores = proposals.map(p => {
             const s = votes[m.id]?.[p.id]?.[idx];
             // Formatação compacta: P1[5] P2[3]
             return `${p.name.substring(0, 15)}...: [ ${s || '_'} ]/5`;
        }).join(' | ');
        report += `* ${m.name}: ${scores}\n`;
    });
    report += `\n---\n\n`;
  });

  report += `## 3. PONTUAÇÃO TOTAL E VEREDITO\n\n`;
  
  // Tabela Markdown simplificada para compatibilidade
  report += `| Proposta | ${members.map(m => `Soma (${m.name.split(' ')[0]})`).join(' | ')} | **MÉDIA FINAL** |\n`;
  report += `| :--- | ${members.map(() => `:---:`).join(' | ')} | :---: |\n`;
  
  let winner = { name: 'Empate/Indefinido', avg: -1 };
  
  proposals.forEach(p => {
    let row = `| **${p.name}** |`;
    let totalScore = 0;
    let count = 0;
    
    members.forEach(m => {
        const userVotes = votes[m.id]?.[p.id];
        const sum = userVotes ? Object.values(userVotes).reduce((a, b) => (a as number) + (b as number), 0) : 0;
        const hasVotes = userVotes && Object.keys(userVotes).length > 0;
        
        row += ` [ ${hasVotes ? sum : '_'} ]/20 |`;
        
        if(hasVotes) {
            totalScore += (sum as number);
            count++;
        }
    });
    
    const avg = count > 0 ? totalScore / count : 0;
    if(avg > winner.avg) winner = { name: p.name, avg };
    
    row += ` **[ ${avg.toFixed(1)} ]/20** |`;
    report += `${row}\n`;
  });
  
  report += `\n### 🏆 VENCEDOR OFICIAL: ${winner.name}\n\n`;
  report += `**Justificativa da Escolha:**\n`;
  report += `[Espaço reservado para justificativa do Arquiteto baseada na média de ${winner.avg.toFixed(1)} pontos. O projeto apresentou a melhor relação entre viabilidade técnica e impacto.]\n`;

  return report;
};
