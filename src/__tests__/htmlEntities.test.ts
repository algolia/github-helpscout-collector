import { encodeHtml } from '../htmlEntities';

describe('encodeHtml', () => {
  it('encodes > to &gt;', () => {
    expect(encodeHtml('>')).toMatchInlineSnapshot(`"&gt;"`);
  });

  it('encodes < to &lt;', () => {
    expect(encodeHtml('<')).toMatchInlineSnapshot(`"&lt;"`);
  });

  it('leaves other characters as-is', () => {
    expect(encodeHtml('hi <InstantSearch />')).toMatchInlineSnapshot(
      `"hi &lt;InstantSearch /&gt;"`
    );
  });
});
