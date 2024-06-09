export const extractTokenFromHeader = (header: string | string[]): string | null => {
    if (Array.isArray(header)) {
      header = header.join(' ');
    }
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice(7);
    }
    return null;
  };