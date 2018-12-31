export const formatText = ({ content, link }: { content: string; link: string }) =>
  `
${content}
<br />
-----------------------------------------------------------
<br />
<h3 style="color: #FF4F81;">
👉  PLEASE ANSWER ON GITHUB THEN CLOSE THIS TICKET  👈
</h3>
<a href="${link}">${link}</a>
<br/>
-----------------------------------------------------------
  `.trim();
