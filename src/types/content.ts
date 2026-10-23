export interface SiteContent {
  id: string;
  home_title: string;
  home_description: string;
  about_title: string;
  about_description: string;
  how_to_title: string;
  how_to_step1: string;
  how_to_step2: string;
  how_to_step3: string;
  how_to_step4: string;
  facebook_page: string;
  messenger_link: string;
  email_address: string;
  contact_person: string;
  logo_url: string;
  home_primary_label: string;
  home_primary_url: string;
  home_secondary_label: string;
  home_secondary_url: string;
  feature_one_title: string;
  feature_one_description: string;
  feature_one_url: string;
  feature_two_title: string;
  feature_two_description: string;
  feature_two_url: string;
  feature_three_title: string;
  feature_three_description: string;
  feature_three_url: string;
  home_gallery_urls: string[];
  home_background_url: string;
  about_background_url: string;
  contact_background_url: string;
  facebook_account_link: string;
  website_747_link: string;
  updated_at: string;
}

export const defaultContent: SiteContent = {
  id: '',
  home_title: 'Welcome to WELSUN PICKS',
  home_description:
    'Your trusted source for premium picks and insights. We provide carefully curated selections to help you make informed decisions.',
  about_title: 'About WELSUN PICKS',
  about_description:
    'WELSUN PICKS is dedicated to providing high-quality picks and insights. Our team of experts carefully analyzes each selection to ensure you receive the best possible recommendations. We pride ourselves on transparency, accuracy, and a commitment to excellence.',
  how_to_title: 'How to Create an Account',
  how_to_step1: 'Visit our official Facebook page.',
  how_to_step2: 'Contact our authorized representative.',
  how_to_step3: 'Request account registration assistance.',
  how_to_step4: 'Follow the provided instructions.',
  facebook_page: 'https://bit.ly/m/Welsunpicks',
  messenger_link: 'https://m.me/welsunpicks',
  email_address: 'welsunpicks@gmail.com',
  contact_person: 'WELSUN PICKS Representative',
  logo_url: '',
  home_primary_label: 'Contact Us',
  home_primary_url: '/contact',
  home_secondary_label: 'Learn More',
  home_secondary_url: '/about',
  feature_one_title: 'Curated Selections',
  feature_one_description: 'Each pick is carefully analyzed by our team to ensure quality and accuracy.',
  feature_one_url: '/contact',
  feature_two_title: 'Trusted & Reliable',
  feature_two_description: 'We pride ourselves on transparency and a commitment to excellence.',
  feature_two_url: '/about',
  feature_three_title: 'Premium Quality',
  feature_three_description: 'High-quality insights to help you make informed decisions.',
  feature_three_url: '/how-to-create-account',
  home_gallery_urls: [],
  home_background_url: '',
  about_background_url: '',
  contact_background_url: '',
  facebook_account_link: 'https://m.me/welsunpicks',
  website_747_link: 'https://bit.ly/m/Welsunpicks',
  updated_at: '',
};
