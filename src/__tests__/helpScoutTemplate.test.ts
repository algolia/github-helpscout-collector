import { formatText } from '../helpScoutTemplate';

describe('helpScoutTemplate', () => {
  describe('formatText', () => {
    it('expect the mailboxId to be a number when it exist', () => {
      const content = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla metus mi, condimentum eget
convallis quis, tempus a neque. Donec sit amet egestas libero. Praesent tempus magna libero
in semper nibh euismod vel. Pellentesque ultricies eu lorem id ultrices. Pellentesque
ultricies rhoncus turpis, ut rutrum nibh aliquet sit amet.
      `.trim();

      const actual = formatText({
        link: 'https://link.github.com',
        content,
      });

      expect(actual).toMatchInlineSnapshot(`
"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla metus mi, condimentum eget
convallis quis, tempus a neque. Donec sit amet egestas libero. Praesent tempus magna libero
in semper nibh euismod vel. Pellentesque ultricies eu lorem id ultrices. Pellentesque
ultricies rhoncus turpis, ut rutrum nibh aliquet sit amet.
<br />
-----------------------------------------------------------
<br />
<h3 style=\\"color: #FF4F81;\\">
👉  PLEASE ANSWER ON GITHUB THEN CLOSE THIS TICKET  👈
</h3>
<a href=\\"https://link.github.com\\">https://link.github.com</a>
<br/>
-----------------------------------------------------------"
`);
    });
  });
});
