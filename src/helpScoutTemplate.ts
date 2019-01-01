import marked from 'marked';

type TextOptions = {
  content: string;
  link: string;
};

export const formatText = ({ content, link }: TextOptions) => {
  const html = marked(content, {
    sanitize: true,
  });

  return (
    html +
    '<br />\n' +
    '-----------------------------------------------------------\n' +
    '<br />\n' +
    '<h3 style="color: #FF4F81;">\n' +
    '👉  PLEASE ANSWER ON GITHUB THEN CLOSE THIS TICKET  👈\n' +
    '</h3>\n' +
    `<a href="${link}">${link}</a>\n` +
    '<br/>\n' +
    '-----------------------------------------------------------'
  );
};
