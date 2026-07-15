// ==================== IMPORTS ====================
import { Auth } from './auth.js';
import { SignalEngine } from './signal-engine.js';
import { OrderManager } from './order-manager.js';
import { RiskManager } from './risk-manager.js';
import { Pricing } from './pricing.js';
import { RevenueTracker } from './revenue-tracker.js';
import { Notifications } from './notifications.js';
import { PerformanceTracker } from './performance-tracker.js';

// ==================== MAIN WORKER ====================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const auth = new Auth(env);
    const pricing = new Pricing(env);
    const revenueTracker = new RevenueTracker(env);
    
    // ============ PUBLIC ROUTES ============
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return renderLandingPage();
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'online',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/api/register') {
      return handleRegistration(request, env);
    }
    
    if (url.pathname === '/api/login') {
      return handleLogin(request, env);
    }
    
    // ============ PROTECTED ROUTES ============
    const authHeader = request.headers.get('Authorization');
    const apiKey = request.headers.get('X-API-Key');
    
    // Check authentication
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      user = await auth.verifyToken(token);
    } else if (apiKey) {
      user = await auth.verifyApiKey(apiKey);
    }
    
    if (!user && url.pathname.startsWith('/api/')) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // Check rate limit and subscription
    if (user) {
      const rateLimit = await pricing.checkRateLimit(user.id);
      if (!rateLimit.allowed) {
        return new Response('Rate limit exceeded', { status: 429 });
      }
      
      const subscription = await pricing.getUserSubscription(user.id);
      if (!subscription.active && url.pathname !== '/api/subscribe') {
        return new Response('Subscription required', { status: 402 });
      }
    }
    
    // ============ API ROUTES ============
    switch (url.pathname) {
      case '/api/dashboard':
        return handleDashboard(request, env, user);
        
      case '/api/signals':
        return handleSignals(request, env, user);
        
      case '/api/trade':
        return handleTrade(request, env, user);
        
      case '/api/portfolio':
        return handlePortfolio(request, env, user);
        
      case '/api/subscribe':
        return handleSubscription(request, env, user);
        
      case '/api/webhook/stripe':
        return handleStripeWebhook(request, env);
        
      case '/api/admin/metrics':
        return handleAdminMetrics(request, env, user);
        
      default:
        return new Response('Not found', { status: 404 });
    }
  },
  
  async scheduled(event, env, ctx) {
    console.log('🚀 Autonomous Trading Agent running scheduled task');
    
    try {
      // Initialize modules
      const signalEngine = new SignalEngine(env);
      const orderManager = new OrderManager(env);
      const riskManager = new RiskManager(env);
      const performanceTracker = new PerformanceTracker(env);
      const notifications = new Notifications(env);
      
      // 1. Generate trading signals
      const signals = await signalEngine.generateSignals();
      console.log(`📊 Generated ${signals.length} signals`);
      
      // 2. Risk assessment
      const approvedSignals = [];
      for (const signal of signals) {
        const riskAssessment = await riskManager.assessRisk(signal);
        if (riskAssessment.approved) {
          approvedSignals.push({
            ...signal,
            riskScore: riskAssessment.score,
            maxPositionSize: riskAssessment.maxSize
          });
        }
      }
      
      // 3. Execute trades
      const tradeResults = [];
      for (const signal of approvedSignals) {
        try {
          const trade = await orderManager.executeTrade(signal);
          tradeResults.push(trade);
          
          // Track revenue
          if (trade.fee) {
            await revenueTracker.trackRevenue('trade_fee', trade.fee, trade.userId);
          }
        } catch (error) {
          console.error('Trade execution failed:', error);
          await notifications.send({
            type: 'trade_error',
            message: `Trade failed: ${error.message}`,
            signal
          });
        }
      }
      
      // 4. Update performance metrics
      await performanceTracker.updateMetrics({
        signalsGenerated: signals.length,
        signalsApproved: approvedSignals.length,
        tradesExecuted: tradeResults.length,
        totalVolume: tradeResults.reduce((sum, t) => sum + t.volume, 0),
        totalFees: tradeResults.reduce((sum, t) => sum + (t.fee || 0), 0)
      });
      
      // 5. Send notifications for significant events
      if (tradeResults.length > 0) {
        await notifications.send({
          type: 'trades_executed',
          message: `${tradeResults.length} trades executed successfully`,
          trades: tradeResults.map(t => ({
            symbol: t.symbol,
            side: t.side,
            amount: t.amount,
            price: t.price
          }))
        });
      }
      
      // 6. Store last run timestamp
      await env.STATE.put('last_scheduled_run', new Date().toISOString());
      await env.STATE.put('last_trade_count', tradeResults.length.toString());
      
      console.log(`✅ Scheduled task completed: ${tradeResults.length} trades executed`);
      
    } catch (error) {
      console.error('❌ Scheduled task failed:', error);
      // Store error for monitoring
      await env.METRICS.put(`error_${Date.now()}`, JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }));
    }
  }
};

// ==================== HANDLER FUNCTIONS ====================
async function renderLandingPage() {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CryptoAuto - Autonomous Trading Agent</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          margin-top: 40px;
        }
        h1 {
          font-size: 48px;
          margin-bottom: 20px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          margin: 10px;
          transition: transform 0.3s;
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 40px 0;
        }
        .feature-card {
          background: rgba(255, 255, 255, 0.15);
          padding: 25px;
          border-radius: 15px;
          backdrop-filter: blur(5px);
        }
        .metric {
          font-size: 36px;
          font-weight: bold;
          color: #4ecdc4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 CryptoAuto</h1>
        <p>Autonomous AI Trading Agent</p>
        
        <div class="features">
          <div class="feature-card">
            <h3>🤖 AI-Powered Signals</h3>
            <p>Machine learning algorithms analyze market data 24/7</p>
          </div>
          <div class="feature-card">
            <h3>⚡ Real-Time Execution</h3>
            <p>Instant trade execution with minimal latency</p>
          </div>
          <div class="feature-card">
            <h3>📊 Risk Management</h3>
            <p>Advanced risk controls protect your capital</p>
          </div>
          <div class="feature-card">
            <h3>💰 Revenue Tracking</h3>
            <p>Real-time profit/loss monitoring and reporting</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="/api/dashboard" class="btn">Dashboard</a>
          <a href="https://buy.stripe.com/test_..." class="btn">Subscribe Now</a>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
          <h3>Live Metrics</h3>
          <div id="metrics">Loading...</div>
        </div>
      </div>
      
      <script>
        async function loadMetrics() {
          try {
            const res = await fetch('/api/health');
            const data = await res.json();
            document.getElementById('metrics').innerHTML = \`
              <div class="metric">\${data.status.toUpperCase()}</div>
              <p>Version: \${data.version}</p>
              <p>Last updated: \${new Date(data.timestamp).toLocaleString()}</p>
            \`;
          } catch (error) {
            document.getElementById('metrics').innerHTML = 'Metrics unavailable';
          }
        }
        loadMetrics();
        setInterval(loadMetrics, 30000);
      </script>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function handleRegistration(request, env) {
  try {
    const { email, password } = await request.json();
    const auth = new Auth(env);
    
    const userId = await auth.register(email, password);
    
    return new Response(JSON.stringify({
      success: true,
      userId,
      message: 'Registration successful'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLogin(request, env) {
  try {
    const { email, password } = await request.json();
    const auth = new Auth(env);
    
    const token = await auth.login(email, password);
    
    return new Response(JSON.stringify({
      success: true,
      token,
      message: 'Login successful'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDashboard(request, env, user) {
  const performanceTracker = new PerformanceTracker(env);
  const metrics = await performanceTracker.getDashboardMetrics(user.id);
  
  return new Response(JSON.stringify({
    user,
    metrics,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSignals(request, env, user) {
  const signalEngine = new SignalEngine(env);
  const signals = await signalEngine.getSignals(user.id);
  
  return new Response(JSON.stringify({
    signals,
    count: signals.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleTrade(request, env, user) {
  try {
    const { symbol, side, amount } = await request.json();
    const orderManager = new OrderManager(env);
    const riskManager = new RiskManager(env);
    
    // Check risk
    const riskAssessment = await riskManager.assessRisk({
      symbol,
      side,
      amount,
      userId: user.id
    });
    
    if (!riskAssessment.approved) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Trade rejected by risk management',
        details: riskAssessment
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Execute trade
    const trade = await orderManager.executeTrade({
      symbol,
      side,
      amount: Math.min(amount, riskAssessment.maxSize),
      userId: user.id
    });
    
    // Track revenue
    const revenueTracker = new RevenueTracker(env);
    await revenueTracker.trackRevenue('trade_execution', trade.fee || 0, user.id);
    
    return new Response(JSON.stringify({
      success: true,
      trade,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handlePortfolio(request, env, user) {
  const orderManager = new OrderManager(env);
  const portfolio = await orderManager.getPortfolio(user.id);
  
  return new Response(JSON.stringify({
    portfolio,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSubscription(request, env, user) {
  const pricing = new Pricing(env);
  const { tier } = await request.json();
  
  const session = await pricing.createCheckoutSession(user.id, tier);
  
  return new Response(JSON.stringify({
    url: session.url,
    sessionId: session.id
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleStripeWebhook(request, env) {
  const pricing = new Pricing(env);
  return pricing.handleWebhook(request);
}

async function handleAdminMetrics(request, env, user) {
  // Check admin permissions
  if (user.role !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }
  
  const performanceTracker = new PerformanceTracker(env);
  const revenueTracker = new RevenueTracker(env);
  
  const metrics = {
    performance: await performanceTracker.getAllMetrics(),
    revenue: await revenueTracker.getRevenueReport('monthly'),
    users: await env.USERS.list(),
    trades: await env.TRADES.list()
  };
  
  return new Response(JSON.stringify(metrics), {
    headers: { 'Content-Type': 'application/json' }
  });
}
