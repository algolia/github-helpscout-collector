import { encodeHTML } from '../encodeHTML';

describe('encodeHTML', () => {
  it('encodes `>` to `&gt;`', () => {
    expect(encodeHTML('>')).toMatchInlineSnapshot(`"&gt;"`);
  });

  it('encodes `<` to `&lt;`', () => {
    expect(encodeHTML('<')).toMatchInlineSnapshot(`"&lt;"`);
  });

  it('leaves other characters', () => {
    expect(encodeHTML('Hello <InstantSearch />')).toMatchInlineSnapshot(
      `"Hello &lt;InstantSearch /&gt;"`
    );
  });
});
