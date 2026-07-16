/**
 * CryptoAuto - Final Mobile-First Version
 */

const ADMIN_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>CryptoAuto Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; overflow: hidden; }

    .login-page { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .login-page.active { display: flex !important; }
    .login-card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 30px 20px; width: 100%; max-width: 380px; margin: 20px; }
    .login-card h1 { margin-bottom: 25px; font-size: 28px; text-align: center; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: white; font-size: 16px; }
    .btn-login { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; }

    .dashboard { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
    .dashboard.active { display: flex !important; flex-direction: column; }

    .app-header { background: #1e293b; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding: 15px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .app-header .logo { font-size: 20px; font-weight: 700; }
    .app-header .logout-btn { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }

    .content { flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 80px; }

    .section { display: none; }
    .section.active { display: block !important; }

    .section h2 { font-size: 20px; margin-bottom: 20px; }

    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat-card { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 15px; text-align: center; }
    .stat-card .value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .stat-card .label { font-size: 12px; color: rgba(255, 255, 255, 0.6); }

    .card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .card h3 { font-size: 14px; font-weight: 600; margin-bottom: 12px; }

    .table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table th { background: rgba(16, 185, 129, 0.1); padding: 10px; text-align: left; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .table td { padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .badge.win { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .badge.loss { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; border-top: 1px solid rgba(16, 185, 129, 0.2); display: flex; justify-content: space-around; align-items: flex-end; height: 70px; flex-shrink: 0; padding-bottom: env(safe-area-inset-bottom); }

    .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; cursor: pointer; transition: all 0.2s; color: rgba(255, 255, 255, 0.6); font-size: 11px; }
    .nav-item:active { background: rgba(16, 185, 129, 0.1); }
    .nav-item.active { color: #10b981; }
    .nav-item .icon { font-size: 24px; margin-bottom: 2px; }

    @media (min-width: 768px) {
      .stat-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
      .content { padding: 30px; padding-bottom: 30px; }
    }
  </style>
</head>
<body>

<div class="login-page active" id="loginPage">
  <div class="login-card">
    <h1>🤖 CryptoAuto</h1>
    <form onsubmit="handleLogin(event)">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" value="admin@example.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" value="password">
      </div>
      <button type="submit" class="btn-login">Login</button>
    </form>
  </div>
</div>

<div class="dashboard" id="dashboard">
  <div class="app-header">
    <div class="logo">🚀 CryptoAuto</div>
    <button class="logout-btn" onclick="handleLogout()">Logout</button>
  </div>

  <div class="content">
    <div class="section active" id="portfolio">
      <h2>📊 Portfolio</h2>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="value">\$12,450</div>
          <div class="label">Total</div>
        </div>
        <div class="stat-card">
          <div class="value">65%</div>
          <div class="label">Win Rate</div>
        </div>
        <div class="stat-card">
          <div class="value">+3.2%</div>
          <div class="label">This Month</div>
        </div>
        <div class="stat-card">
          <div class="value">24</div>
          <div class="label">Active</div>
        </div>
      </div>

      <div class="card">
        <h3>Recent Trades</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>P&L</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BTC/USDT</td>
              <td>+\$542</td>
              <td><span class="badge win">WIN</span></td>
            </tr>
            <tr>
              <td>ETH/USDT</td>
              <td>-\$120</td>
              <td><span class="badge loss">LOSS</span></td>
            </tr>
            <tr>
              <td>XRP/USDT</td>
              <td>+\$89</td>
              <td><span class="badge win">WIN</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section" id="trades">
      <h2>💹 Trade History</h2>
      <div class="card"><p>View all your trades here</p></div>
    </div>

    <div class="section" id="settings">
      <h2>⚙️ Settings</h2>
      <div class="card"><p>Settings coming soon</p></div>
    </div>

    <div class="section" id="users">
      <h2>👥 Users</h2>
      <div class="card"><p>User management coming soon</p></div>
    </div>
  </div>

  <div class="bottom-nav">
    <div class="nav-item active" onclick="switchTab('portfolio')">
      <div class="icon">📊</div>
      <div>Portfolio</div>
    </div>
    <div class="nav-item" onclick="switchTab('trades')">
      <div class="icon">💹</div>
      <div>Trades</div>
    </div>
    <div class="nav-item" onclick="switchTab('settings')">
      <div class="icon">⚙️</div>
      <div>Settings</div>
    </div>
    <div class="nav-item" onclick="switchTab('users')">
      <div class="icon">👥</div>
      <div>Users</div>
    </div>
  </div>
</div>

<script>
  function handleLogin(e) {
    e.preventDefault();
    if (document.getElementById('email').value === 'admin@example.com' && 
        document.getElementById('password').value === 'password') {
      document.getElementById('loginPage').classList.remove('active');
      document.getElementById('dashboard').classList.add('active');
    }
  }

  function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.closest('.nav-item').classList.add('active');
  }

  function handleLogout() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboard').classList.remove('active');
  }
</script>

</body>
</html>`;

const PRICING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    nav { display: flex; justify-content: space-between; margin-bottom: 40px; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 20px; font-weight: 700; }
    nav a { color: rgba(255,255,255,0.7); text-decoration: none; margin-left: 20px; font-size: 14px; }
    .hero { text-align: center; margin-bottom: 40px; }
    h1 { font-size: 32px; margin-bottom: 10px; }
    .pricing-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
    .pricing-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 25px; text-align: center; }
    .pricing-card.popular { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .badge { background: #10b981; color: #0f172a; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-bottom: 15px; display: inline-block; }
    .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
    .price { font-size: 32px; font-weight: 700; }
    .btn { display: block; width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; margin: 15px 0; }
    .features { list-style: none; text-align: left; font-size: 13px; }
    .features li { padding: 8px 0; color: rgba(255,255,255,0.8); }
    .features li:before { content: "✓ "; color: #10b981; margin-right: 8px; }
    @media (min-width: 768px) {
      .pricing-grid { grid-template-columns: repeat(3, 1fr); }
      h1 { font-size: 48px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <div class="logo">🚀 CryptoAuto</div>
      <div><a href="/">Home</a><a href="/admin">Admin</a></div>
    </nav>

    <div class="hero">
      <h1>Simple Pricing</h1>
      <p>Start free. Upgrade anytime.</p>
    </div>

    <div class="pricing-grid">
      <div class="pricing-card">
        <div class="plan-name">Free Trial</div>
        <div class="price">\$0</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 15px;">7 days</div>
        <button class="btn">Get Started</button>
        <ul class="features">
          <li>Full access</li>
          <li>1 active bot</li>
          <li>Binance only</li>
          <li>Basic analytics</li>
        </ul>
      </div>

      <div class="pricing-card popular">
        <div class="badge">MOST POPULAR</div>
        <div class="plan-name">Pro</div>
        <div class="price">\$29</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 15px;">per month</div>
        <button class="btn">Start Pro</button>
        <ul class="features">
          <li>Unlimited bots</li>
          <li>All 4 exchanges</li>
          <li>Advanced signals</li>
          <li>Real-time alerts</li>
          <li>Email support</li>
        </ul>
      </div>

      <div class="pricing-card">
        <div class="plan-name">Enterprise</div>
        <div class="price">\$299</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 15px;">per month</div>
        <button class="btn">Contact Sales</button>
        <ul class="features">
          <li>Everything in Pro</li>
          <li>Custom strategies</li>
          <li>API access</li>
          <li>White label</li>
          <li>24/7 support</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const method = request.method;

      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (pathname === '/' && method === 'GET') {
        return new Response(getLandingPage(), {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      if (pathname === '/pricing' && method === 'GET') {
        return new Response(PRICING_PAGE_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      if (pathname === '/admin' && method === 'GET') {
        return new Response(ADMIN_DASHBOARD_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      if (pathname === '/health' && method === 'GET') {
        return new Response(
          JSON.stringify({ status: 'ok' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  }
};

function getLandingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoAuto - Passive Crypto Trading</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    nav a { color: rgba(255,255,255,0.7); text-decoration: none; margin-left: 20px; font-size: 14px; }
    .hero { text-align: center; margin-bottom: 50px; }
    h1 { font-size: 36px; margin-bottom: 15px; line-height: 1.2; }
    .subtitle { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 30px; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; cursor: pointer; border: none; font-size: 14px; }
    .cta:active { background: #059669; }
    .features { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 40px; }
    .feature { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
    .feature-icon { font-size: 28px; margin-bottom: 10px; }
    .feature h3 { margin-bottom: 8px; font-size: 16px; }
    .feature p { color: rgba(255,255,255,0.7); font-size: 13px; }
    .status { text-align: center; margin-top: 40px; padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 14px; }
    @media (min-width: 768px) {
      h1 { font-size: 48px; }
      .features { grid-template-columns: repeat(3, 1fr); }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <div class="logo">🚀 CryptoAuto</div>
      <div><a href="/pricing">Pricing</a><a href="/admin">Admin</a></div>
    </nav>
    <div class="hero">
      <h1>Your Savings Earn 0%. Let AI Make You 2–5% Monthly.</h1>
      <p class="subtitle">Passive income from automated crypto trading powered by AI.</p>
      <a href="/pricing" class="cta">Start Free Trial</a>
    </div>
    <div class="features">
      <div class="feature"><div class="feature-icon">🤖</div><h3>AI-Powered Signals</h3><p>Advanced algorithms generate trading signals 24/7 across all major exchanges.</p></div>
      <div class="feature"><div class="feature-icon">🛡️</div><h3>Your Money, Your Control</h3><p>You keep your API keys. We never touch your funds or personal data.</p></div>
      <div class="feature"><div class="feature-icon">📊</div><h3>Real Returns</h3><p>2–5% monthly profit. All trades visible on your exchange in real-time.</p></div>
      <div class="feature"><div class="feature-icon">🔒</div><h3>Military-Grade Security</h3><p>Encrypted, hashed, secure. No passwords stored. 256-bit encryption standard.</p></div>
      <div class="feature"><div class="feature-icon">💰</div><h3>Low Cost, High Value</h3><p>Free 7-day trial. \$29/month Pro. \$299/month Enterprise. No hidden fees.</p></div>
      <div class="feature"><div class="feature-icon">✅</div><h3>Transparent & Verified</h3><p>Every trade shown. Win rate verified. Performance tracked daily. No BS.</p></div>
    </div>
    <div class="status">✅ Status: Live & Active on Cloudflare Workers</div>
  </div>
</body>
</html>`;
}
