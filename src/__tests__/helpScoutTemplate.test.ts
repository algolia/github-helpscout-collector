import { formatText } from '../helpScoutTemplate';

describe('helpScoutTemplate', () => {
  describe('formatText', () => {
    it('expect to return the content with a footer', () => {
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

      expect(actual).toMatchSnapshot();
    });

    it('expect to return HTML from MD', () => {
      const content = `
# Hello

This is a test with Markdown.

\`\`\`jsx
const App = () => (
  <View>This is the content of the example.</View>
)
\`\`\`
      `.trim();

      const actual = formatText({
        link: 'https://link.github.com',
        content,
      });

      expect(actual).toMatchSnapshot();
    });

    it('expect to return escaped HTML from MD', () => {
      const content = `
# Hello

This is a test with Markdown.

<script>
  console.log('malicious');
</script>

\`\`\`jsx
const App = () => (
  <View>This is the content of the example.</View>
)
\`\`\`
      `.trim();

      const actual = formatText({
        link: 'https://link.github.com',
        content,
      });

      expect(actual).toMatchSnapshot();
    });
  });
});
