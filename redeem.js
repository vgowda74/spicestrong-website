import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1';
const config = window.SPICESTRONG_PARTNERS, root = document.getElementById('offer'), notice = document.getElementById('notice');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const client = createClient(config.url, config.anonKey, { auth: { storageKey: 'spicestrong-offer-auth', detectSessionInUrl: false } });
let code = new URLSearchParams(location.search).get('code') || '', session;
async function api(action, input) {
  const auth = await client.auth.getSession();
  if (auth.error) throw Error('Please sign in again.');
  const response = await fetch(config.url + '/functions/v1/partner-portal', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: config.anonKey,
    ...(auth.data.session ? { Authorization: 'Bearer ' + auth.data.session.access_token } : {}) }, body: JSON.stringify({ action, ...input }) });
  const result = await response.json(); if (!response.ok) throw Error(result.error || 'Unable to complete this request.'); return result;
}
async function working(button, fn) {
  button.disabled = true; notice.textContent = '';
  try { await fn(); } catch (error) { notice.textContent = error.message || 'Please try again.'; }
  finally { button.disabled = false; }
}
async function render() {
  session = (await client.auth.getSession()).data.session;
  root.innerHTML = `<h1>Claim your SpiceStrong partner offer</h1><p>For eligible new monthly subscribers. Store rules apply. Regular monthly pricing follows the promotional month.</p>
  <section class="partner-card"><label>Partner coupon code<input id="code" value="${escape(code)}" maxlength="100" autocomplete="off"></label>
  ${session ? `<p>Signed in as ${escape(session.user.email)}.</p><p>Use the same email address in SpiceStrong so your saved promotion follows your account.</p>
  <label>Your store<select id="store"><option value="APP_STORE">App Store · iPhone / iPad</option><option value="PLAY_STORE">Google Play · Android</option></select></label>
  <button id="claim">Claim my promotion</button><button id="signout" class="secondary">Use another email</button><div id="redemption"></div>` :
    '<p>Sign in by email to reserve your own promotion. This does not give access to partner or administrator dashboards.</p><form id="login"><label>Your SpiceStrong account email<input name="email" type="email" autocomplete="email" maxlength="254" required></label><button type="submit">Email me a secure claim link</button></form>'}</section>
  <p>The first-100 free-month campaign is limited to 100 claimed places per partner across both stores. No payment is collected on this page.</p>`;
  document.getElementById('code').oninput = event => { code = event.target.value.trim().toUpperCase(); };
  document.getElementById('login')?.addEventListener('submit', event => {
    event.preventDefault(); const form = event.currentTarget;
    void working(form.querySelector('button'), async () => { notice.textContent = (await api('redeem_login', { code, email: new FormData(form).get('email') })).message; });
  });
  const claim = document.getElementById('claim');
  if (claim) claim.onclick = () => working(claim, async () => {
    if (!/^(?:SS-FREE-[A-Z0-9]{16}|SS50[A-Z0-9]{8})$/.test(code.trim().toUpperCase())) throw Error('Enter a free-month or half-price coupon code here.');
    const store = document.getElementById('store').value;
    const result = await api('claim', { code, store });
    if (!result.discount_kind) throw Error('Use a free-month or half-price coupon here, not a tracking-only referral code.');
    const target = document.getElementById('redemption');
    if (result.redemption_url) {
      const url = new URL(result.redemption_url);
      if (url.protocol !== 'https:' || url.hostname !== 'apps.apple.com') throw Error('The store redemption link was not valid.');
      target.innerHTML = `<p class="partner-status">${escape(result.message)}</p><p>Your personal App Store code:</p><code class="partner-code">${escape(result.redemption_code)}</code>
      <a class="partner-action" href="${escape(url.href)}" rel="noopener noreferrer">Redeem on App Store</a><p>Check the promotional price and renewal terms shown by Apple before confirming.</p>`;
    } else if (result.offer_id) {
      target.innerHTML = `<p class="partner-status">${escape(result.message)}</p><p>Open the updated SpiceStrong Android app, sign in with this same email and choose the monthly plan. The app retrieves your saved promotion. Confirm the offer in Google Play before purchasing.</p><a class="partner-action" href="spicestrong://">Open SpiceStrong</a>`;
    }
  });
  const signout = document.getElementById('signout');
  if (signout) signout.onclick = () => working(signout, async () => { const result = await client.auth.signOut({ scope: 'local' }); if (result.error) throw result.error; await render(); });
}
async function start() {
  const fragment = new URLSearchParams(location.hash.slice(1)), token = fragment.get('token_hash'), type = fragment.get('type');
  if (token) {
    history.replaceState(null, '', location.pathname + location.search);
    if (!['magiclink', 'signup', 'invite'].includes(type)) throw Error('Invalid sign-in link. Request a new one.');
    root.innerHTML = '<h1>Confirm your offer sign-in</h1><section class="partner-card"><p>Continue to choose your store and claim your promotion.</p><button id="continue">Continue to my offer</button></section>';
    const button = document.getElementById('continue'); button.onclick = () => working(button, async () => {
      const result = await client.auth.verifyOtp({ token_hash: token, type });
      if (result.error) throw Error('This link expired or was already used. Open your claim link and request a new email.');
      await render();
    });
  } else await render();
}
start().catch(error => { root.innerHTML = `<h1>Claim your offer</h1><p>${escape(error.message)}</p><a href="/redeem">Request a new link</a>`; });
