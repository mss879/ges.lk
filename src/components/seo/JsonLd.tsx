/**
 * Renders schema.org data as a JSON-LD script tag.
 *
 * Plain <script> rather than next/script, as the Next docs recommend, with `<`
 * escaped so no string in the data can close the tag early.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
