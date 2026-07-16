/**
 * CryptoAuto - Complete Worker with Admin Dashboard (FIXED)
 */

const ADMIN_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoAuto Admin</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: white;
    }

    .login-page {
      display: none;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }

    .login-page.active {
      display: flex !important;
    }

    .login-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    .login-card h1 {
      margin-bottom: 30px;
      font-size: 28px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      font-size: 14px;
    }

    .btn {
      width: 100%;
      padding: 12px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn:hover {
      background: #059669;
    }

    .dashboard {
      display: none;
      min-height: 100vh;
    }

    .dashboard.active {
      display: block !important;
    }

    .sidebar {
      width: 250px;
      background: #1e293b;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      min-height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      padding: 20px;
    }

    .logo {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 40px;
    }

    .nav-item {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 14px;
    }

    .nav-item:hover {
      background: rgba(16, 185, 129, 0.1);
    }

    .nav-item.active {
      background: #10b981;
    }

    .main-content {
      margin-left: 250px;
      padding: 30px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section {
      display: none;
    }

    .section.active {
      display: block !important;
    }

    .card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .stat-card .value {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-card .label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .table th {
      background: rgba(16, 185, 129, 0.1);
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .table td {
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge.win {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .badge.loss {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }

    .error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
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
      <button type="submit" class="btn">Login</button>
      <div id="loginError"></div>
    </form>
  </div>
</div>

<div class="dashboard" id="dashboard">
  <div class="sidebar">
    <div class="logo">🚀 CryptoAuto</div>
    <div class="nav-item active" onclick="switchTab('portfolio')">📊 Portfolio</div>
    <div class="nav-item" onclick="switchTab('trades')">💹 Trades</div>
    <div class="nav-item" onclick="switchTab('settings')">⚙️ Settings</div>
    <div class="nav-item" onclick="switchTab('users')">👥 Users</div>
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
    <div class="nav-item" onclick="handleLogout()" style="color: #fca5a5;">🚪 Logout</div>
  </div>

  <div class="main-content">
    <div class="header">
      <h2>Dashboard</h2>
      <button class="btn" style="width: auto;" onclick="handleLogout()">Logout</button>
    </div>

    <div class="section active" id="portfolio">
      <h3 style="margin-bottom: 20px;">📊 Portfolio Overview</h3>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="value">$12,450</div>
          <div class="label">Total Value</div>
        </div>
        <div class="stat-card">
          <div class="value">65%</div>
          <div class="label">Win Rate</div>
        </div>
        <div class="stat-card">
          <div class="value">+3.2%</div>
          <div class="label">Month Profit</div>
        </div>
        <div class="stat-card">
          <div class="value">24</div>
          <div class="label">Active Trades</div>
        </div>
      </div>
      <div class="card">
        <h4>Active Positions</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Entry</th>
              <th>Current</th>
              <th>Change</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BTC/USDT</td>
              <td>$42,300</td>
              <td>$43,150</td>
              <td>+2.0%</td>
              <td><span class="badge win">WINNING</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section" id="trades">
      <h3>💹 Trade History</h3>
      <div class="card">
        <p>Demo trade data here</p>
      </div>
    </div>

    <div class="section" id="settings">
      <h3>⚙️ Settings</h3>
      <div class="card">
        <p>Admin settings here</p>
      </div>
    </div>

    <div class="section" id="users">
      <h3>👥 Users</h3>
      <div class="card">
        <p>User management here</p>
      </div>
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
    } else {
      document.getElementById('loginError').innerHTML = '<div class="error">Invalid</div>';
    }
  }

  function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
  }

  function handleLogout() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboard').classList.remove('active');
  }
</script>

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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      // Landing page
      if (pathname === '/' && method === 'GET') {
        return new Response(getLandingPage(), {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      // Admin dashboard
      if (pathname === '/admin' && method === 'GET') {
        return new Response(ADMIN_DASHBOARD_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
        });
      }

      // Admin login
      if (pathname === '/admin/login' && method === 'POST') {
        try {
          const body = await request.json();
          const { email, password } = body;

          if (email === 'admin@example.com' && password === 'password') {
            return new Response(
              JSON.stringify({ success: true, token: 'demo-token-' + Date.now() }),
              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }
          return new Response(
            JSON.stringify({ error: 'Invalid credentials' }),
            { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Login failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
      }

      // Portfolio API
      if (pathname === '/api/portfolio' && method === 'GET') {
        return new Response(
          JSON.stringify({ portfolio: { total_value: 12450, win_rate: 0.65, monthly_profit: 3.2 } }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Health check
      if (pathname === '/health' && method === 'GET') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};

function getLandingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoAuto</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 80px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    nav a { color: rgba(255,255,255,0.7); text-decoration: none; margin-left: 30px; transition: color 0.3s; }
    nav a:hover { color: #10b981; }
    .hero { text-align: center; margin-bottom: 60px; }
    h1 { font-size: 56px; margin-bottom: 20px; line-height: 1.2; }
    .subtitle { font-size: 20px; color: rgba(255,255,255,0.8); margin-bottom: 40px; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; cursor: pointer; border: none; font-size: 16px; transition: all 0.3s; }
    .cta:hover { background: #059669; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 60px; }
    .feature { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
    .feature-icon { font-size: 32px; margin-bottom: 15px; }
    .feature h3 { margin-bottom: 10px; font-size: 18px; }
    .feature p { color: rgba(255,255,255,0.7); font-size: 14px; }
    .status { text-align: center; margin-top: 40px; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3); }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <div class="logo"><span>🚀</span> CryptoAuto</div>
      <div><a href="/admin">Admin</a></div>
    </nav>
    <div class="hero">
      <h1>Your Savings Earn 0%. Let AI Make You 2–5% Monthly.</h1>
      <p class="subtitle">Passive income from automated crypto trading.</p>
      <button class="cta" onclick="alert('Coming Soon')">Start Free Trial</button>
    </div>
    <div class="features">
      <div class="feature"><div class="feature-icon">🤖</div><h3>AI-Powered</h3><p>Advanced trading signals 24/7</p></div>
      <div class="feature"><div class="feature-icon">🛡️</div><h3>Your Control</h3><p>You keep your API keys</p></div>
      <div class="feature"><div class="feature-icon">📊</div><h3>Real Returns</h3><p>2–5% monthly profit</p></div>
    </div>
    <div class="status">✅ Status: Live & Active</div>
  </div>
</body>
</html>`;
}
