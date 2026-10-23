/*
# Add separate contact destination links

1. New Columns on `site_content`
- `facebook_account_link`: URL for the main Facebook account used for direct messages.
- `website_747_link`: URL for the 747 website shown under the Play Now action.

2. Modified Tables
- `site_content`: Adds two optional contact destinations without removing or changing existing links or content.
- Existing rows receive safe defaults based on the current Facebook and Messenger destinations.

3. Security
- Existing public SELECT policy and authenticated admin-only INSERT/UPDATE/DELETE policies remain unchanged.
- The new columns inherit the existing table grants and RLS protections.

4. Important Notes
- The Contact page displays Facebook Page, Main Facebook Account, and 747 Website as separate destinations.
- The admin can update all three destinations from Contact Info.
*/

ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS facebook_account_link text NOT NULL DEFAULT 'https://m.me/welsunpicks',
  ADD COLUMN IF NOT EXISTS website_747_link text NOT NULL DEFAULT 'https://bit.ly/m/Welsunpicks';
