export const TRANSLATE = (text: string) => {
  switch (text) {
    case 'Network Error':
      return 'Servidor Offline';
    case 'Invalid e-mail/password combination.':
      return 'Senha ou e-mail inválido.'
    default:
      return text
  }
}