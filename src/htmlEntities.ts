const entities: { [key: string]: string } = {
  '<': '&lt;',
  '>': '&gt;',
};

export const encodeHtml = (str: string) => str.replace(/[<>]/g, tag => entities[tag] || tag);
