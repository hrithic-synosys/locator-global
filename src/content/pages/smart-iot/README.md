# Smart IoT content

Edit `global.ts` to update the unprefixed `/service/smart-iot` page. It contains
Global metadata, hero copy, three image/text blocks, four platform features, ten
FAQs and the final CTA. The route applies this data only for the Global market.
Country routes continue using the original component defaults, including their
metadata, text, images and FAQ structured data.

The existing SmartIotHero, SmartIotShowcase, SmartIotFeatures, SmartIotFAQ and
SoftwareCTA render the content. SmartIotFAQ uses the same supplied questions and
answers for both the visible accordion and FAQPage JSON-LD.

Keep the block IDs `gps-asset-tracking`, `equipment-machinery`, and `iot-sensors`:
the homepage links to these anchors. Images can be replaced through each block's
image path and dimensions. Features correspond to the four existing icons in
their current order. Do not add a fifth item without adding a matching icon.

The supplied chat metadata and H1 take precedence over the PDF hero title. Search
intent is editorial guidance, not displayed copy. The SEO title is absolute to
avoid the layout appending another site-name suffix.
