const entities: { [key: string]: string } = {
  '<': '&lt;',
  '>': '&gt;',
};

export const encodeHTML = (s: string) => s.replace(/[<>]/g, tag => entities[tag] || tag);
