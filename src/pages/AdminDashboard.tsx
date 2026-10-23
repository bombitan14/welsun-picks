import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home as HomeIcon,
  Info,
  Phone,
  Image,
  Images,
  KeyRound,
  LogOut,
  Save,
  Check,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { defaultContent, type SiteContent } from '@/types/content';
import Logo from '@/components/Logo';

type Tab = 'home' | 'about' | 'media' | 'contact' | 'logo' | 'password';

const tabs: { id: Tab; label: string; icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Homepage', icon: HomeIcon },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'media', label: 'Images & Backgrounds', icon: Images },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'logo', label: 'Logo', icon: Image },
  { id: 'password', label: 'Change Password', icon: KeyRound },
];

export default function AdminDashboard() {
  const { signOut, adminUsername, changePassword } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      const { data, error: queryError } = await supabase
        .from('site_content')
        .select('*')
        .maybeSingle();
      if (queryError) setError(queryError.message);
      if (data) setContent(data as SiteContent);
      setLoading(false);
    }
    fetchContent();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await supabase
      .from('site_content')
      .update({
        home_title: content.home_title,
        home_description: content.home_description,
        about_title: content.about_title,
        about_description: content.about_description,
        how_to_title: content.how_to_title,
        how_to_step1: content.how_to_step1,
        how_to_step2: content.how_to_step2,
        how_to_step3: content.how_to_step3,
        how_to_step4: content.how_to_step4,
        facebook_page: content.facebook_page,
        messenger_link: content.messenger_link,
        email_address: content.email_address,
        contact_person: content.contact_person,
        logo_url: content.logo_url,
        home_primary_label: content.home_primary_label,
        home_primary_url: content.home_primary_url,
        home_secondary_label: content.home_secondary_label,
        home_secondary_url: content.home_secondary_url,
        feature_one_title: content.feature_one_title,
        feature_one_description: content.feature_one_description,
        feature_one_url: content.feature_one_url,
        feature_two_title: content.feature_two_title,
        feature_two_description: content.feature_two_description,
        feature_two_url: content.feature_two_url,
        feature_three_title: content.feature_three_title,
        feature_three_description: content.feature_three_description,
        feature_three_url: content.feature_three_url,
        home_gallery_urls: content.home_gallery_urls,
        home_background_url: content.home_background_url,
        about_background_url: content.about_background_url,
        contact_background_url: content.contact_background_url,
        facebook_account_link: content.facebook_account_link,
        website_747_link: content.website_747_link,
        updated_at: new Date().toISOString(),
      })
      .eq('id', content.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function uploadImage(file: File, folder: 'logos' | 'home-gallery' | 'backgrounds') {
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setError('Please upload an image file smaller than 10 MB.');
      return null;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExt)) {
      setError('Only JPG, PNG, WEBP, and GIF images are supported.');
      return null;
    }

    const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('public').upload(filePath, file);
    if (uploadError) {
      setError('The image could not be uploaded. Please try again.');
      return null;
    }

    const { data: urlData } = supabase.storage.from('public').getPublicUrl(filePath);
    return urlData.publicUrl;
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const url = await uploadImage(file, 'logos');
    if (url) {
      setContent({ ...content, logo_url: url });
      await saveField('logo_url', url);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setError(null);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file, 'home-gallery');
      if (url) urls.push(url);
    }
    if (urls.length) {
      const next = { ...content, home_gallery_urls: [...content.home_gallery_urls, ...urls] };
      setContent(next);
      await saveField('home_gallery_urls', next.home_gallery_urls);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function saveField(field: keyof SiteContent, value: string | string[]) {
    const { error: updateError } = await supabase
      .from('site_content')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', content.id);
    if (updateError) {
      setError('Could not save to the database. Please try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleBackgroundUpload(
    field: 'home_background_url' | 'about_background_url' | 'contact_background_url',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const url = await uploadImage(file, 'backgrounds');
    if (url) {
      const next = { ...content, [field]: url };
      setContent(next);
      await saveField(field, url);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setChangingPassword(true);
    const { error: pwError } = await changePassword(newPassword);
    if (pwError) {
      setPasswordMsg({ type: 'error', text: pwError });
    } else {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setChangingPassword(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/admin');
  }

  function update(field: keyof SiteContent, value: string) {
    setContent({ ...content, [field]: value });
  }

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-navy-950/80 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-colors focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30';
  const labelClass = 'mb-2 block text-sm font-medium text-gray-300';

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-red/10 p-2">
              <LayoutDashboard size={20} className="text-brand-red" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin Dashboard</p>
              <p className="text-xs text-gray-500">Signed in as {adminUsername}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-gray-400 transition-colors hover:text-brand-gold"
            >
              View Site
            </a>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar tabs */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex flex-wrap gap-2 lg:flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-brand-red/10 text-brand-red'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content panel */}
          <main className="rounded-xl border border-white/5 bg-navy-900 p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
              </div>
            ) : (
              <>
                {/* Save bar */}
                {activeTab !== 'password' && (
                  <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-navy-950/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {saved && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                          <Check size={16} /> Changes saved successfully
                        </span>
                      )}
                      {error && (
                        <span className="text-sm text-red-400">Error: {error}</span>
                      )}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-red to-brand-red-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-red/20 transition-all hover:from-brand-red-dark hover:to-brand-red disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* HOME TAB */}
                {activeTab === 'home' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-white">Homepage Content</h2>
                    <div>
                      <label className={labelClass}>Home Title</label>
                      <input
                        className={inputClass}
                        value={content.home_title}
                        onChange={(e) => update('home_title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Home Description</label>
                      <textarea
                        className={`${inputClass} min-h-[120px] resize-y`}
                        value={content.home_description}
                        onChange={(e) => update('home_description', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-5 border-t border-white/5 pt-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Primary Button Text</label>
                        <input
                          className={inputClass}
                          value={content.home_primary_label}
                          onChange={(e) => update('home_primary_label', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Primary Button Link</label>
                        <input
                          className={inputClass}
                          placeholder="/contact or https://..."
                          value={content.home_primary_url}
                          onChange={(e) => update('home_primary_url', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Secondary Button Text</label>
                        <input
                          className={inputClass}
                          value={content.home_secondary_label}
                          onChange={(e) => update('home_secondary_label', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Secondary Button Link</label>
                        <input
                          className={inputClass}
                          placeholder="/about or https://..."
                          value={content.home_secondary_url}
                          onChange={(e) => update('home_secondary_url', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MEDIA TAB */}
                {activeTab === 'media' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-white">Images &amp; Backgrounds</h2>
                      <p className="mt-2 text-sm text-gray-400">Upload images up to 10 MB. Backgrounds and slider images save automatically.</p>
                    </div>

                    <div className="border-b border-white/5 pb-8">
                      <h3 className="mb-4 text-base font-semibold text-white">Homepage Slider</h3>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-brand-red to-brand-red-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-red/20 transition-all hover:from-brand-red-dark hover:to-brand-red">
                        <Images size={16} />
                        {uploading ? 'Uploading...' : 'Upload Slider Images'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          multiple
                          className="hidden"
                          onChange={handleGalleryUpload}
                          disabled={uploading}
                        />
                      </label>
                      {content.home_gallery_urls.length > 0 && (
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {content.home_gallery_urls.map((url, index) => (
                            <div key={url} className="relative overflow-hidden rounded-lg border border-white/10 bg-navy-950">
                              <img src={url} alt={`Slider image ${index + 1}`} className="aspect-video w-full object-cover" />
                              <button
                                type="button"
                                onClick={async () => {
                                  const next = content.home_gallery_urls.filter((item) => item !== url);
                                  setContent({ ...content, home_gallery_urls: next });
                                  await saveField('home_gallery_urls', next);
                                }}
                                className="absolute right-2 top-2 rounded bg-navy-950/80 px-2 py-1 text-xs text-red-300 hover:bg-red-500/80 hover:text-white"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="mb-4 text-base font-semibold text-white">Page Backgrounds</h3>
                      <div className="grid gap-5 md:grid-cols-3">
                        {[
                          { field: 'home_background_url' as const, label: 'Home Background' },
                          { field: 'about_background_url' as const, label: 'About Us Background' },
                          { field: 'contact_background_url' as const, label: 'Contact Us Background' },
                        ].map((background) => (
                          <div key={background.field} className="rounded-lg border border-white/5 bg-navy-950/50 p-4">
                            <p className="mb-3 text-sm font-medium text-gray-300">{background.label}</p>
                            {content[background.field] && (
                              <img src={content[background.field]} alt={background.label} className="mb-3 aspect-video w-full rounded object-cover" />
                            )}
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-brand-red/50 hover:text-white">
                              <Upload size={14} /> Upload Image
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={(e) => handleBackgroundUpload(background.field, e)}
                                disabled={uploading}
                              />
                            </label>
                            {content[background.field] && (
                              <button
                                type="button"
                                onClick={async () => {
                                  update(background.field, '');
                                  await saveField(background.field, '');
                                }}
                                className="ml-2 text-xs text-gray-500 hover:text-red-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-white">About Us Content</h2>
                    <div>
                      <label className={labelClass}>About Title</label>
                      <input
                        className={inputClass}
                        value={content.about_title}
                        onChange={(e) => update('about_title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>About Description</label>
                      <textarea
                        className={`${inputClass} min-h-[200px] resize-y`}
                        value={content.about_description}
                        onChange={(e) => update('about_description', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* CONTACT TAB */}
                {activeTab === 'contact' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-white">Contact Information</h2>
                    <div>
                      <label className={labelClass}>Facebook Page URL</label>
                      <input
                        className={inputClass}
                        value={content.facebook_page}
                        onChange={(e) => update('facebook_page', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Main Facebook Account URL</label>
                      <input
                        className={inputClass}
                        value={content.facebook_account_link}
                        onChange={(e) => update('facebook_account_link', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>747 Website URL</label>
                      <input
                        className={inputClass}
                        value={content.website_747_link}
                        onChange={(e) => update('website_747_link', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* LOGO TAB */}
                {activeTab === 'logo' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-white">Logo &amp; Branding</h2>
                    <div className="rounded-lg border border-white/5 bg-navy-950/50 p-6">
                      <p className="mb-4 text-sm text-gray-400">
                        Upload a custom logo. If no logo is uploaded, the default WELSUN PICKS
                        text logo will be displayed.
                      </p>

                      <div className="mb-6 flex items-center gap-6 rounded-lg border border-white/5 bg-navy-950/80 p-6">
                        {content.logo_url ? (
                          <img
                            src={content.logo_url}
                            alt="Current logo"
                            className="max-h-20 object-contain"
                          />
                        ) : (
                          <Logo size="lg" />
                        )}
                        <div className="text-sm text-gray-500">
                          {content.logo_url ? 'Current logo' : 'Default logo'}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-brand-red to-brand-red-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-red/20 transition-all hover:from-brand-red-dark hover:to-brand-red">
                          <Upload size={16} />
                          {uploading ? 'Uploading...' : 'Upload Logo'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                            disabled={uploading}
                          />
                        </label>
                        {content.logo_url && (
                          <button
                            onClick={() => update('logo_url', '')}
                            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:text-red-400"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                      <p className="mt-4 text-xs text-gray-500">
                        After uploading, click "Save Changes" to apply.
                      </p>
                    </div>
                  </div>
                )}

                {/* PASSWORD TAB */}
                {activeTab === 'password' && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-white">Change Admin Password</h2>
                    <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                      {passwordMsg && (
                        <div
                          className={`rounded-lg border px-4 py-3 text-sm ${
                            passwordMsg.type === 'success'
                              ? 'border-green-500/30 bg-green-500/10 text-green-400'
                              : 'border-red-500/30 bg-red-500/10 text-red-400'
                          }`}
                        >
                          {passwordMsg.text}
                        </div>
                      )}
                      <div>
                        <label className={labelClass}>New Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          placeholder="At least 6 characters"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Confirm New Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Re-enter new password"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-red to-brand-red-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-red/20 transition-all hover:from-brand-red-dark hover:to-brand-red disabled:opacity-50"
                      >
                        <KeyRound size={16} />
                        {changingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
