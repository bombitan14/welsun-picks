/*
# Add editable homepage buttons and feature links

1. New Columns on `site_content`
- `home_primary_label`: Text shown on the main homepage call-to-action button.
- `home_primary_url`: Internal or external destination for the main button.
- `home_secondary_label`: Text shown on the secondary homepage button.
- `home_secondary_url`: Internal or external destination for the secondary button.
- `feature_one_title`, `feature_one_description`, `feature_one_url`: Editable content and link for the first homepage feature card.
- `feature_two_title`, `feature_two_description`, `feature_two_url`: Editable content and link for the second homepage feature card.
- `feature_three_title`, `feature_three_description`, `feature_three_url`: Editable content and link for the third homepage feature card.

2. Modified Tables
- `site_content`: Adds homepage presentation fields without removing or changing existing content.
- Existing rows receive useful defaults so the current homepage continues to work immediately.

3. Security
- Existing `site_content` RLS policies remain in place.
- Existing public SELECT access and authenticated admin-only write access continue to apply to the new columns.
- No new tables, roles, or policies are created.

4. Important Notes
- Links are stored as text so the administrator can use site pages such as `/contact` or external URLs such as Facebook and Messenger.
- The frontend only accepts safe internal paths and HTTP(S) links when rendering editable destinations.
*/

ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS home_primary_label text NOT NULL DEFAULT 'Contact Us',
  ADD COLUMN IF NOT EXISTS home_primary_url text NOT NULL DEFAULT '/contact',
  ADD COLUMN IF NOT EXISTS home_secondary_label text NOT NULL DEFAULT 'Learn More',
  ADD COLUMN IF NOT EXISTS home_secondary_url text NOT NULL DEFAULT '/about',
  ADD COLUMN IF NOT EXISTS feature_one_title text NOT NULL DEFAULT 'Curated Selections',
  ADD COLUMN IF NOT EXISTS feature_one_description text NOT NULL DEFAULT 'Each pick is carefully analyzed by our team to ensure quality and accuracy.',
  ADD COLUMN IF NOT EXISTS feature_one_url text NOT NULL DEFAULT '/contact',
  ADD COLUMN IF NOT EXISTS feature_two_title text NOT NULL DEFAULT 'Trusted & Reliable',
  ADD COLUMN IF NOT EXISTS feature_two_description text NOT NULL DEFAULT 'We pride ourselves on transparency and a commitment to excellence.',
  ADD COLUMN IF NOT EXISTS feature_two_url text NOT NULL DEFAULT '/about',
  ADD COLUMN IF NOT EXISTS feature_three_title text NOT NULL DEFAULT 'Premium Quality',
  ADD COLUMN IF NOT EXISTS feature_three_description text NOT NULL DEFAULT 'High-quality insights to help you make informed decisions.',
  ADD COLUMN IF NOT EXISTS feature_three_url text NOT NULL DEFAULT '/how-to-create-account';
