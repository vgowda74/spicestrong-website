import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1';

const root = document.querySelector('#portal');
const notice = document.querySelector('#notice');
const config = window.SPICESTRONG_PARTNERS;
const route = location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
const adminRoute = route === '/admin';
let client, session, admin = false, selectedPartner = null;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = value => value == null ? 'Awaiting proceeds' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const date = value => new Date(value).toLocaleDateString();
const field = (name, label, type = 'text', value = '', extra = '') => `<label>${label}<input name="${name}" type="${type}" value="${escape(value)}" required ${extra}></label>`;
const data = form => Object.fromEntries(new FormData(form));
function notify(message) { notice.textContent = message; }
async function api(action, input = {}) {
  const { data: auth, error } = await client.auth.getSession();
  if (error) throw Error('Please sign in again.');
  session = auth.session;
  const response = await fetch(`${config.url}/functions/v1/partner-portal`, { method: 'POST',
    headers: { apikey: config.anonKey, 'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    body: JSON.stringify({ action, ...input }) });
  const result = await response.json();
  if (!response.ok) throw Error(result.error || 'Request failed. Please try again.');
  return result;
}
async function working(button, fn) {
  button.disabled = true;
  try { await fn(); } catch (error) { notify(error.message || 'Unable to complete this request.'); }
  finally { button.disabled = false; }
}
function bindForm(id, fn) {
  const form = document.getElementById(id);
  form?.addEventListener('submit', event => { event.preventDefault(); void working(form.querySelector('button[type=submit]'), () => fn(data(form), form)); });
}
const rules = `<h2>How rewards work</h2><ul>
<li>Share your unique referral code on your social pages. New subscribers enter it before checkout.</li>
<li>Earn 25% of net proceeds from the first three paid monthly subscription periods after all three periods are completed.</li>
<li>Net proceeds are after store fees, taxes and refunds. Renewals stay attributed to the subscription account.</li>
<li>Applies to App Store and Google Play monthly subscriptions. Annual subscriptions, free trials, sign-ups alone and refunded purchases earn no reward.</li>
<li>Pending amounts are USD estimates. Eligible earnings require verified store proceeds. Payouts are processed separately through PayPal.</li>
</ul>`;
function login() {
  return `<section class="partner-card"><h2>${adminRoute ? 'Administrator sign-in' : 'Partner sign-in'}</h2><p>${adminRoute ? 'Only registered administrators can access partner applications, approvals and payment administration.' : 'Approved promotion partners can request a secure email link to their own dashboard.'}</p>
  <form id="login">${field('email', 'Email address', 'email', '', 'autocomplete="email" maxlength="254"')}<button type="submit">Email me a sign-in link</button></form></section>`;
}
function bindLogin() { bindForm('login', async values => notify((await api('login', { ...values, portal: adminRoute ? 'admin' : 'partner' })).message)); }
function application() {
  root.innerHTML = `<h1>Refer &amp; earn with SpiceStrong</h1><p>Help your audience cook high-protein meals and earn rewards on qualifying subscriptions.</p>
  <div class="partner-grid"><section class="partner-card"><h2>Become a promotion partner</h2><form id="apply">
  ${field('name', 'Your name', 'text', '', 'autocomplete="name" maxlength="120"')}${field('email', 'Email address', 'email', '', 'autocomplete="email" maxlength="254"')}
  <label>Social links and how you plan to promote SpiceStrong<textarea name="details" maxlength="3000" required></textarea></label>
  <label><input type="checkbox" name="consent" required> I agree to the reward terms shown here and the <a href="/terms.html">terms</a> and <a href="/privacy.html">privacy policy</a>.</label>
  <button type="submit">Submit application</button></form></section><section class="partner-card">${rules}</section></div>${login()}`;
  bindForm('apply', async (values, form) => {
    const result = await api('apply', { ...values, consent: values.consent === 'on' });
    form.reset(); notify(result.message);
  }); bindLogin();
}
function offerCards(offers, partner, claimed) {
  return `<div class="partner-grid">${['free_month', 'half_price'].map(kind => {
    const entries = offers.filter(offer => offer.kind === kind);
    return `<section class="partner-card"><h2>${kind === 'free_month' ? 'First 100 · one month free' : '50% off the first month'}</h2>
      <p>${kind === 'free_month' ? 'Share this code with your audience. The first 100 eligible people to claim the configured store offer get one month free, then regular monthly pricing.' : 'Share this code with your audience. Eligible new monthly subscribers get 50% off their first month, then regular monthly pricing.'}</p>
      ${entries.length && kind === 'free_month' ? `<code class="partner-code">${escape(partner.free_code)}</code><button data-copy="${escape(partner.free_code)}">Copy free-month code</button>
      <p>${escape(claimed)} of 100 places claimed across both stores.</p><p>New subscribers enter this code in the app’s monthly upgrade screen to reserve a place and receive a personal store code. Available for ${entries.map(o => o.store === 'APP_STORE' ? 'App Store' : 'Google Play').join(' and ')}.</p>` : entries.length ? entries.map(offer => `<h3>${offer.store === 'APP_STORE' ? 'App Store' : 'Google Play'}</h3><code class="partner-code">${escape(offer.code)}</code>
      <button data-copy="${escape(offer.code)}">Copy code</button><a class="partner-action" href="${escape(offer.redemption_url)}" target="_blank" rel="noopener noreferrer">Redeem in store</a>`).join('') : '<p class="partner-status">Store offer awaiting configuration</p><p>The code will appear here after the offer is configured and activated in the store.</p>'}</section>`;
  }).join('')}</div>`;
}
function earningsTable(earnings, administrative = false) {
  return `<div class="partner-table"><table><thead><tr>${administrative ? '<th>Select</th>' : ''}<th>Purchase date</th><th>Store</th><th>Paid month</th><th>Status</th><th>Reward USD</th>${administrative ? '<th>Verify proceeds</th>' : ''}</tr></thead><tbody>
  ${earnings.map(row => `<tr>${administrative ? `<td>${row.reward_status === 'eligible' ? `<input type="checkbox" aria-label="Select purchase ${escape(row.transaction_id)}" data-transaction="${escape(row.transaction_id)}" data-reward="${escape(row.reward_usd)}">` : ''}</td>` : ''}
  <td>${escape(date(row.purchased_at))}</td><td>${escape(row.store)}</td><td>${escape(row.paid_month)}</td><td>${escape(row.reward_status)}</td>
  <td>${['excluded', 'refunded', 'unattributed'].includes(row.reward_status) ? money(0) : escape(money(row.reward_usd))}</td>
  ${administrative ? `<td><button data-reconcile="${escape(row.transaction_id)}" ${row.reward_status === 'paid' ? 'disabled' : ''}>Verify</button></td>` : ''}</tr>`).join('') || `<tr><td colspan="7">No purchases yet.</td></tr>`}</tbody></table></div>`;
}
function dashboardMarkup(result, administrative = false) {
  const { partner, summary, payout, earnings, payments, offers } = result;
  return `<h1>Promotion partner dashboard</h1><p class="partner-email">${escape(partner.email)}</p>
  ${administrative ? `<p>Status: <strong>${escape(partner.status)}</strong> · <button id="toggle-status" class="secondary">${partner.status === 'active' ? 'Suspend partner' : 'Restore partner'}</button></p>` : ''}
  ${offerCards(offers, partner, result.free_claimed)}<div class="partner-grid partner-stats">${[
    ['Referred subscribers', summary.referred_subscribers], ['Pending earnings · estimated', money(summary.pending_usd)],
    ['Eligible earnings', money(summary.eligible_usd)], ['Paid to you', money(summary.paid_usd)],
  ].map(([label, value]) => `<div class="partner-card">${label}<strong class="partner-stat">${escape(value)}</strong></div>`).join('')}</div>
  ${summary.unknown_proceeds ? '<p>Some purchases are awaiting store proceeds and are not included in the estimated amount.</p>' : ''}
  ${Number(summary.adjustments_usd) > 0 ? `<p class="partner-status">Previously paid purchases were refunded (${money(summary.adjustments_usd)}). Contact support to resolve the payout adjustment.</p>` : ''}
  <div class="partner-grid"><section class="partner-card"><h2>Your referral code</h2><code class="partner-code">${escape(partner.referral_code)}</code>
  <button data-copy="${escape(partner.referral_code)}">Copy referral code</button>
  <p>Share this code and ask new subscribers to enter it before checkout. Referral codes track purchases; only separately configured store offers provide a discount. Renewals stay attributed to the account.</p>
  <p>Use this same referral code for App Store and Google Play purchases.</p></section><section class="partner-card">${rules}</section></div>
  <section class="partner-card"><h2>PayPal payout details</h2><div id="payout-saved" ${payout ? '' : 'hidden'}>
  <p>Saved: ${escape(payout?.paypal_email)} · ${escape(payout?.country)}</p>${administrative ? '' : '<button id="edit-payout" class="secondary">Edit payout details</button>'}</div>
  ${administrative ? (!payout ? '<p>No payout details saved.</p>' : '') : `<form id="payout" ${payout ? 'hidden' : ''}>
  ${field('paypal_email', 'PayPal email address', 'email', payout?.paypal_email || '', 'maxlength="254"')}
  ${field('country', 'Country code (two letters, for example US)', 'text', payout?.country || '', 'minlength="2" maxlength="2" pattern="[A-Za-z]{2}"')}
  <button type="submit">Save payout details</button></form>`}</section>
  <section class="partner-card"><h2>Referral earnings</h2><p>Latest 100 purchases. Totals above include the full earnings history.</p>${earningsTable(earnings, administrative)}</section>
  <section class="partner-card"><h2>Payment history</h2><p>Latest 100 completed payments.</p><div class="partner-table"><table><thead><tr><th>Date</th><th>Amount USD</th><th>Payment reference</th></tr></thead>
  <tbody>${payments.map(payment => `<tr><td>${escape(date(payment.paid_at))}</td><td>${escape(money(payment.amount_usd))}</td><td>${escape(payment.payment_reference)}</td></tr>`).join('') || '<tr><td colspan="3">No payments yet.</td></tr>'}</tbody></table></div></section>`;
}
function bindCopy() {
  root.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => working(button, async () => {
    await navigator.clipboard.writeText(button.dataset.copy); notify('Code copied.');
  })));
}
async function partnerDashboard() {
  const result = await api('dashboard');
  root.innerHTML = dashboardMarkup(result); bindCopy();
  document.getElementById('edit-payout')?.addEventListener('click', () => {
    document.getElementById('payout').hidden = false;
    document.getElementById('payout-saved').hidden = true;
  });
  bindForm('payout', async values => { await api('payout_details', values); await partnerDashboard(); notify('PayPal payout details saved.'); });
}
async function adminList() {
  const result = await api('admin_list');
  root.innerHTML = `<h1>Partner administration</h1><p>Review promotion partner applications and manage earnings.</p>
  <section class="partner-card"><h2>Applications</h2><p>Latest 500 applications.</p><div class="partner-table"><table><thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Details</th><th>Actions</th></tr></thead><tbody>
  ${result.applications.map(a => `<tr><td>${escape(a.name)}</td><td>${escape(a.email)}</td><td>${escape(a.status)}</td><td style="white-space:pre-wrap;min-width:200px">${escape(a.details)}</td><td>
  ${a.status !== 'declined' ? `<button data-approve="${escape(a.id)}">${a.status === 'approved' ? 'Resend invitation' : 'Approve & email'}</button>` : ''}
  ${a.status === 'pending' ? `<button class="secondary" data-decline="${escape(a.id)}">Decline</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="5">No applications yet.</td></tr>'}</tbody></table></div></section>
  <section class="partner-card"><h2>Partners</h2><p>Latest 500 partners.</p>${result.partners.map(p => `<p>${escape(p.email)} · ${escape(p.status)} <button data-partner="${escape(p.id)}">Open dashboard</button></p>`).join('') || '<p>No partners yet.</p>'}</section>`;
  for (const [attribute, action] of [['approve', 'admin_approve'], ['decline', 'admin_decline']]) {
    root.querySelectorAll(`[data-${attribute}]`).forEach(button => button.addEventListener('click', () => working(button, async () => {
      const response = await api(action, { application_id: button.dataset[attribute] });
      await adminList(); notify(response.message);
    })));
  }
  root.querySelectorAll('[data-partner]').forEach(button => button.addEventListener('click', () => working(button, () => adminDashboard(button.dataset.partner))));
}
async function adminDashboard(partnerId) {
  selectedPartner = partnerId;
  const result = await api('admin_dashboard', { partner_id: partnerId });
  root.innerHTML = `<button id="back" class="secondary">Back to applications</button>${dashboardMarkup(result, true)}
  <section class="partner-card"><h2>Verify store proceeds</h2><p>Use the store financial report, after fees, taxes and refunds. Amounts must be in USD.</p>
  <form id="reconcile">${field('transaction_id', 'Transaction ID')}${field('net_usd', 'Verified net proceeds USD', 'number', '', 'step="0.0001" min="0"')}${field('reference', 'Store report reference', 'text', '', 'minlength="5"')}<button type="submit">Save verified proceeds</button></form></section>
  <section class="partner-card"><h2>Record a completed PayPal payment</h2><p>Select eligible purchases above, pay the saved PayPal address, then record the payment here. This action does not send money.</p>
  <p id="selected-total">Selected: $0.00</p><form id="payment">${field('amount_usd', 'Actual amount paid USD', 'number', '', 'min="0.01" step="0.01"')}${field('reference', 'Unique PayPal payment reference', 'text', '', 'minlength="5"')}<button type="submit">Record completed payment</button></form></section>
  <section class="partner-card"><h2>Configure a store offer</h2><p>Create the offer in App Store Connect or Google Play first. Enforce new-subscriber eligibility, one-month duration and, for the free-month offer, a total redemption limit of 100 in the store.</p>
  <form id="offer"><label>Store<select name="store"><option value="APP_STORE">App Store</option><option value="PLAY_STORE">Google Play</option></select></label>
  <label>Offer<select name="kind"><option value="free_month">First 100 · one month free</option><option value="half_price">50% off first month</option></select></label>
  ${field('code', 'Store coupon code', 'text', '', 'maxlength="100" pattern="[A-Za-z0-9_-]+"')}${field('redemption_url', 'Official store redemption URL', 'url')}${field('store_reference', 'Store configuration reference', 'text', '', 'minlength="4"')}
  <label><input type="checkbox" name="confirm_store_configuration" required> I verified the discount, monthly product, eligibility and redemption limit in the store.</label>
  <label><input type="checkbox" name="active"> Activate this offer (uncheck to disable)</label><button type="submit">Save store offer</button></form></section>`;
  root.insertAdjacentHTML('beforeend', `<section class="partner-card"><h2>Private free-month code inventory</h2>
  <p>Import unique single-use codes generated by the store for the one-month-free offer. The shared campaign allocates at most 100 places across iOS and Android. Personal store codes are never shown in the public partner dashboard.</p>
  <form id="inventory"><label>Store<select name="store"><option value="APP_STORE">App Store</option><option value="PLAY_STORE">Google Play</option></select></label>
  <label>One unused store code per line<textarea name="codes" required></textarea></label>${field('expires_at', 'Store expiration date', 'date')}
  <label><input type="checkbox" name="confirm_single_use" required> These are single-use, one-month-free codes for eligible new monthly subscribers.</label><button type="submit">Import private codes</button></form></section>`);
  bindCopy(); document.getElementById('back').onclick = () => working(document.getElementById('back'), adminList);
  document.getElementById('toggle-status').onclick = event => working(event.currentTarget, async () => {
    await api('admin_status', { partner_id: partnerId, status: result.partner.status === 'active' ? 'suspended' : 'active' }); await adminDashboard(partnerId);
  });
  root.querySelectorAll('[data-reconcile]').forEach(button => button.onclick = () => {
    document.querySelector('#reconcile [name=transaction_id]').value = button.dataset.reconcile;
    document.querySelector('#reconcile [name=net_usd]').focus();
  });
  root.querySelectorAll('[data-transaction]').forEach(input => input.onchange = () => {
    const sum = [...root.querySelectorAll('[data-transaction]:checked')].reduce((total, item) => total + Number(item.dataset.reward), 0);
    document.getElementById('selected-total').textContent = `Selected: ${money(sum)}`;
  });
  bindForm('reconcile', async values => { await api('admin_reconcile', values); await adminDashboard(partnerId); notify('Verified proceeds saved.'); });
  bindForm('payment', async values => {
    const transactions = [...root.querySelectorAll('[data-transaction]:checked')].map(input => input.dataset.transaction);
    await api('admin_payout', { ...values, partner_id: partnerId, transactions });
    await adminDashboard(partnerId); notify('Completed payment recorded.');
  });
  bindForm('offer', async values => {
    await api('admin_offer', { ...values, partner_id: partnerId, active: values.active === 'on', confirm_store_configuration: values.confirm_store_configuration === 'on' });
    await adminDashboard(partnerId); notify('Store offer saved.');
  });
  bindForm('inventory', async values => {
    const response = await api('admin_inventory', { ...values, partner_id: partnerId,
      codes: values.codes.split(/\r?\n/).map(code => code.trim()).filter(Boolean), confirm_single_use: values.confirm_single_use === 'on' });
    await adminDashboard(partnerId); notify(response.message);
  });
}
async function start() {
  if (adminRoute) {
    document.title = 'Partner Administration · SpiceStrong';
    document.getElementById('dashboard-link').href = '/admin';
    document.getElementById('dashboard-link').textContent = 'Partner administration';
    document.getElementById('refer-link').hidden = true;
  }
  if (!config?.url || !config?.anonKey) throw Error('Partner portal is awaiting server configuration. Please contact support.');
  client = createClient(config.url, config.anonKey, { auth: { storageKey: 'spicestrong-partner-auth', detectSessionInUrl: false, flowType: 'pkce' } });
  const fragment = new URLSearchParams(location.hash.slice(1));
  const token = fragment.get('token_hash');
  if (token) {
    history.replaceState(null, '', location.pathname);
    const type = fragment.get('type');
    if (!['magiclink', 'signup', 'invite'].includes(type)) throw Error('Invalid sign-in link. Request a new link.');
    // An explicit click prevents email-link scanners from consuming the token.
    root.innerHTML = `<h1>${adminRoute ? 'Secure administrator sign-in' : 'Your secure partner sign-in link'}</h1><section class="partner-card"><p>${adminRoute ? 'Continue to review partner applications and manage the promotion program.' : 'Continue to open your SpiceStrong partner dashboard.'}</p><button id="continue">${adminRoute ? 'Continue to administration' : 'Continue to partner dashboard'}</button></section>${login()}`;
    bindLogin(); root.setAttribute('aria-busy', 'false');
    document.getElementById('continue').onclick = event => working(event.currentTarget, async () => {
      const result = await client.auth.verifyOtp({ token_hash: token, type });
      if (result.error) throw Error('This sign-in link has expired or was already used. Request a new one below.');
      location.assign(adminRoute ? '/admin' : '/partner');
    });
    return;
  }
  const auth = await client.auth.getSession();
  if (auth.error) throw Error('Unable to read sign-in session.');
  session = auth.data.session;
  document.getElementById('signout').hidden = !session;
  document.getElementById('signout').onclick = async event => working(event.currentTarget, async () => {
    const result = await client.auth.signOut({ scope: 'local' });
    if (result.error) throw result.error;
    root.replaceChildren(); location.assign(adminRoute ? '/admin' : '/partner');
  });
  if (session) {
    admin = (await api('access')).admin;
    document.getElementById('admin-link').hidden = !admin || adminRoute;
  }
  if (route === '/partners' || route === '/partners.html') application();
  else if (!session) { root.innerHTML = `<h1>${route === '/admin' ? 'Partner administration' : 'Partner dashboard'}</h1>${login()}`; bindLogin(); }
  else if (route === '/admin' && !admin) { root.innerHTML = '<h1>Administrator access required</h1><p>This account is not an administrator.</p>'; }
  else if (admin) {
    if (!adminRoute) { location.replace('/admin'); return; }
    await adminList();
  }
  else await partnerDashboard();
  root.setAttribute('aria-busy', 'false');
}
start().catch(error => { root.innerHTML = `<h1>Partner portal</h1><p>${escape(error.message)}</p><a class="partner-action" href="/partner">Try again</a>`; root.setAttribute('aria-busy', 'false'); });
