

export const parseMoedaBR = (valor?: string | number): number => {
  if (!valor) return 0;
  const valorString = String(valor).trim();
  // Blindagem: Remove os pontos de milhar primeiro, depois troca vírgula por ponto
  const valorLimpo = valorString.replace(/\./g, '').replace(',', '.');
  const numero = parseFloat(valorLimpo);
  return isNaN(numero) ? 0 : numero;
};

export const formatarMoedaBR = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatarCNPJ = (cnpj?: string): string => {
  if (!cnpj) return 'XX.XXX.XXX/XXXX-XX';
  const apenasNumeros = cnpj.replace(/\D/g, '');
  if (apenasNumeros.length === 14) {
    return apenasNumeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return cnpj; 
};