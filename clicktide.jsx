import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ─── Supabase Client ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://hmihfncvahsdlmefyxyg.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtaWhmbmN2YWhzZGxtZWZ5eHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTgzNDksImV4cCI6MjA5NjE3NDM0OX0.GP-4tYnKlNP9iSklJyXCSatz3I7gtQQJz7xOUQdXKWk";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const S = {
  navy: "#0A1628",
  teal: "#0EA5E9",
  seafoam: "#34D399",
  slate: "#1E2D45",
  muted: "#6B8CAE",
  light: "#E8F4FD",
  white: "#FFFFFF",
  danger: "#F87171",
  warn: "#FBBF24",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:${S.navy};color:${S.white};min-height:100vh}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${S.slate}}::-webkit-scrollbar-thumb{background:${S.teal};border-radius:2px}
  .syne{font-family:'Syne',sans-serif}
  input,textarea,select{font-family:'DM Sans',sans-serif;outline:none}
  button{cursor:pointer;font-family:'DM Sans',sans-serif}

  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes tide{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .fade-up{animation:fadeUp .4s ease forwards}
  .pulse{animation:pulse 2s infinite}
  .spin{animation:spin 1s linear infinite}
  .tide{animation:tide 3s ease-in-out infinite}

  .btn-primary{background:linear-gradient(135deg,${S.teal},${S.seafoam});color:${S.navy};border:none;padding:10px 22px;border-radius:8px;font-weight:600;font-size:14px;transition:all .2s;letter-spacing:.3px}
  .btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,165,233,.35)}
  .btn-ghost{background:transparent;color:${S.teal};border:1.5px solid rgba(14,165,233,.35);padding:9px 20px;border-radius:8px;font-size:13px;font-weight:500;transition:all .2s}
  .btn-ghost:hover{border-color:${S.teal};background:rgba(14,165,233,.08)}
  .btn-danger{background:rgba(248,113,113,.15);color:${S.danger};border:1.5px solid rgba(248,113,113,.3);padding:8px 16px;border-radius:7px;font-size:13px;font-weight:500;transition:all .2s}
  .btn-danger:hover{background:rgba(248,113,113,.25)}

  .card{background:${S.slate};border:1px solid rgba(14,165,233,.12);border-radius:14px;padding:22px}
  .card-hover:hover{border-color:rgba(14,165,233,.3);transform:translateY(-2px);transition:all .2s}

  .input{background:rgba(255,255,255,.06);border:1.5px solid rgba(14,165,233,.2);border-radius:8px;padding:10px 14px;color:${S.white};font-size:14px;width:100%;transition:border .2s}
  .input:focus{border-color:${S.teal};background:rgba(14,165,233,.06)}
  .input::placeholder{color:${S.muted}}
  .label{font-size:12px;color:${S.muted};font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;display:block}

  .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px}
  .badge-green{background:rgba(52,211,153,.15);color:${S.seafoam}}
  .badge-blue{background:rgba(14,165,233,.15);color:${S.teal}}
  .badge-yellow{background:rgba(251,191,36,.15);color:${S.warn}}
  .badge-red{background:rgba(248,113,113,.15);color:${S.danger}}

  .sidebar-link{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:9px;font-size:13.5px;font-weight:500;color:${S.muted};cursor:pointer;transition:all .2s;border:none;background:none;width:100%;text-align:left}
  .sidebar-link:hover{background:rgba(14,165,233,.08);color:${S.light}}
  .sidebar-link.active{background:rgba(14,165,233,.15);color:${S.teal}}

  .stat-card{background:linear-gradient(135deg,${S.slate},rgba(14,165,233,.06));border:1px solid rgba(14,165,233,.15);border-radius:14px;padding:20px 22px}
  .stat-num{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;background:linear-gradient(135deg,${S.white},${S.teal});-webkit-background-clip:text;-webkit-text-fill-color:transparent}

  .table-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:10px 14px;font-size:11px;color:${S.muted};font-weight:600;letter-spacing:.6px;text-transform:uppercase;border-bottom:1px solid rgba(14,165,233,.1)}
  td{padding:13px 14px;font-size:13.5px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle}
  tr:hover td{background:rgba(14,165,233,.04)}
  tr:last-child td{border-bottom:none}

  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:${S.slate};border:1px solid rgba(14,165,233,.2);border-radius:18px;padding:28px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto}

  .toast{position:fixed;bottom:24px;right:24px;background:${S.slate};border:1px solid rgba(52,211,153,.4);color:${S.white};padding:12px 18px;border-radius:10px;font-size:13.5px;z-index:200;animation:fadeUp .3s ease}
  .toast.err{border-color:rgba(248,113,113,.4)}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n ?? 0);
const money = (n) => `$${Number(n ?? 0).toFixed(2)}`;
const ago = (d) => {
  if (!d) return "—";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className={`toast ${type === "err" ? "err" : ""}`}>
    {type === "err" ? "✗ " : "✓ "}{msg}
  </div>;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return <div style={{ width: 18, height: 18, border: `2px solid rgba(14,165,233,.2)`, borderTopColor: S.teal, borderRadius: "50%" }} className="spin" />;
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function Empty({ icon, title, sub, action }) {
  return <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <div className="syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 13, color: S.muted, marginBottom: 20 }}>{sub}</div>
    {action}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── AUTH ────────────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", business_name: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email: form.email, password: form.password });
        if (error) throw error;
        if (data.user) {
          await sb.from("clicktide").insert({ id: data.user.id, email: form.email, business_name: form.business_name, plan: "starter" });
          onAuth(data.user);
        }
      } else {
        const { data, error } = await sb.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: `radial-gradient(ellipse at 30% 20%, rgba(14,165,233,.12) 0%, transparent 60%), ${S.navy}` }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="fade-up">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="syne tide" style={{ fontSize: 32, fontWeight: 800, background: `linear-gradient(135deg, ${S.teal}, ${S.seafoam})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
            Clicktide
          </div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: 6 }}>Send a gift. Start a tide.</div>
        </div>

        <div className="card">
          <div style={{ display: "flex", marginBottom: 24, background: "rgba(0,0,0,.2)", borderRadius: 9, padding: 3 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 7, border: "none", background: mode === m ? S.teal : "transparent", color: mode === m ? S.navy : S.muted, fontWeight: 600, fontSize: 13, transition: "all .2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <label className="label">Business Name</label>
              <input className="input" placeholder="Pete's Gym" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@business.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>

          {err && <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", color: S.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{err}</div>}

          <button className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: 15 }} onClick={submit} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Spinner /> {mode === "login" ? "Signing in…" : "Creating account…"}</span> : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: S.muted }}>
          🔒 Secured by Supabase · Your data stays private
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function Overview({ userId, toast }) {
  const [stats, setStats] = useState({ campaigns: 0, shipments: 0, customers: 0, wallet: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [cam, ship, cust, wall] = await Promise.all([
        sb.from("campaigns").select("id", { count: "exact" }).eq("business_id", userId),
        sb.from("shipments").select("id", { count: "exact" }).eq("business_id", userId),
        sb.from("customers").select("id", { count: "exact" }).eq("business_id", userId),
        sb.from("wallet").select("balance").eq("business_id", userId).single(),
      ]);
      const recentShip = await sb.from("shipments").select("*").eq("business_id", userId).order("created_at", { ascending: false }).limit(5);
      setStats({ campaigns: cam.count ?? 0, shipments: ship.count ?? 0, customers: cust.count ?? 0, wallet: wall.data?.balance ?? 0 });
      setRecent(recentShip.data ?? []);
      setLoading(false);
    })();
  }, [userId]);

  const statItems = [
    { label: "Active Campaigns", value: fmt(stats.campaigns), icon: "🎯", color: S.teal },
    { label: "Gifts Shipped", value: fmt(stats.shipments), icon: "📦", color: S.seafoam },
    { label: "Customers", value: fmt(stats.customers), icon: "👥", color: S.warn },
    { label: "Wallet Balance", value: money(stats.wallet), icon: "💳", color: "#C084FC" },
  ];

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}><Spinner /></div>;

  return (
    <div className="fade-up">
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Overview</div>
      <div style={{ fontSize: 13, color: S.muted, marginBottom: 24 }}>Your retention engine at a glance</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statItems.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div className="stat-num">{s.value}</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recent Shipments</div>
        {recent.length === 0
          ? <Empty icon="📦" title="No shipments yet" sub="Set up a campaign to start sending gifts automatically" />
          : <div className="table-wrap">
              <table>
                <thead><tr><th>Customer</th><th>Gift</th><th>Campaign</th><th>Status</th><th>Sent</th></tr></thead>
                <tbody>
                  {recent.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500 }}>{r.customer_name || "—"}</td>
                      <td style={{ color: S.muted }}>{r.gift || "—"}</td>
                      <td style={{ color: S.muted }}>{r.campaign || "—"}</td>
                      <td><span className={`badge badge-${r.status === "delivered" ? "green" : r.status === "shipped" ? "blue" : "yellow"}`}>● {r.status || "pending"}</span></td>
                      <td style={{ color: S.muted, fontSize: 12 }}>{ago(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────
function Customers({ userId, toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", total_spent: "", status: "active" });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from("customers").select("*").eq("business_id", userId).order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const { error } = await sb.from("customers").insert({ ...form, business_id: userId, total_spent: parseFloat(form.total_spent) || 0 });
    if (error) { toast(error.message, "err"); return; }
    toast("Customer added!"); setShowAdd(false); setForm({ name: "", email: "", total_spent: "", status: "active" }); load();
  };

  const del = async (id) => {
    await sb.from("customers").delete().eq("id", id);
    toast("Customer removed"); load();
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Customers</div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: 3 }}>{rows.length} total customers</div>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add Customer</button>
      </div>

      <div className="card">
        {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
          : rows.length === 0
            ? <Empty icon="👥" title="No customers yet" sub="Add your first customer to start tracking retention" action={<button className="btn-primary" onClick={() => setShowAdd(true)}>Add Customer</button>} />
            : <div className="table-wrap"><table>
                <thead><tr><th>Name</th><th>Email</th><th>Total Spent</th><th>Status</th><th>Added</th><th></th></tr></thead>
                <tbody>{rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td style={{ color: S.muted }}>{r.email}</td>
                    <td style={{ color: S.seafoam, fontWeight: 600 }}>{money(r.total_spent)}</td>
                    <td><span className={`badge badge-${r.status === "active" ? "green" : r.status === "at-risk" ? "yellow" : "red"}`}>● {r.status}</span></td>
                    <td style={{ color: S.muted, fontSize: 12 }}>{ago(r.created_at)}</td>
                    <td><button className="btn-danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => del(r.id)}>Remove</button></td>
                  </tr>
                ))}</tbody>
              </table></div>
        }
      </div>

      {showAdd && <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
        <div className="modal fade-up">
          <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add Customer</div>
          {[["name","Name","e.g. Sarah Johnson"],["email","Email","sarah@example.com"],["total_spent","Total Spent","0.00"]].map(([k,l,p]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label className="label">{l}</label>
              <input className="input" placeholder={p} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="at-risk">At Risk</option>
              <option value="churned">Churned</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save Customer</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
function Campaigns({ userId, toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", trigger: "30-day inactive", gift_name: "", gift_cost: "", status: "active", platform: "Square" });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from("campaigns").select("*").eq("business_id", userId).order("created_at", { ascending: false });
    setRows(data ?? []); setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name || !form.gift_name) { toast("Fill in all fields", "err"); return; }
    const { error } = await sb.from("campaigns").insert({ ...form, business_id: userId, gift_cost: parseFloat(form.gift_cost) || 0 });
    if (error) { toast(error.message, "err"); return; }
    toast("Campaign created! 🎯"); setShowAdd(false); setForm({ name: "", trigger: "30-day inactive", gift_name: "", gift_cost: "", status: "active", platform: "Square" }); load();
  };

  const toggle = async (id, cur) => {
    await sb.from("campaigns").update({ status: cur === "active" ? "paused" : "active" }).eq("id", id);
    load();
  };

  const del = async (id) => {
    await sb.from("campaigns").delete().eq("id", id);
    toast("Campaign deleted"); load();
  };

  const triggers = ["New signup","First purchase","30-day inactive","60-day inactive","5th visit","10th visit","Birthday","VIP milestone","Churn risk"];
  const platforms = ["Square","Shopify","Stripe","Clover","Toast","WooCommerce","Mindbody"];

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Campaigns</div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: 3 }}>Automated gift triggers</div>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ New Campaign</button>
      </div>

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
        : rows.length === 0
          ? <div className="card"><Empty icon="🎯" title="No campaigns yet" sub="Create your first campaign to start retaining customers automatically" action={<button className="btn-primary" onClick={() => setShowAdd(true)}>Create Campaign</button>} /></div>
          : <div style={{ display: "grid", gap: 12 }}>
              {rows.map(r => (
                <div key={r.id} className="card card-hover" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="badge badge-blue">⚡ {r.trigger}</span>
                      <span className="badge badge-yellow">🏪 {r.platform}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: S.muted, marginBottom: 2 }}>Gift</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.gift_name}</div>
                    <div style={{ fontSize: 12, color: S.seafoam }}>{money(r.gift_cost)} / gift</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className={`badge badge-${r.status === "active" ? "green" : "yellow"}`}>● {r.status}</span>
                    <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => toggle(r.id, r.status)}>
                      {r.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button className="btn-danger" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => del(r.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
      }

      {showAdd && <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
        <div className="modal fade-up">
          <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Campaign</div>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Campaign Name</label>
            <input className="input" placeholder="Welcome Gift" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label className="label">Trigger</label>
              <select className="input" value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}>
                {triggers.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Platform</label>
              <select className="input" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                {platforms.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <label className="label">Gift Name</label>
              <input className="input" placeholder="Water Bottle" value={form.gift_name} onChange={e => setForm(f => ({ ...f, gift_name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Gift Cost ($)</label>
              <input className="input" type="number" placeholder="7.00" value={form.gift_cost} onChange={e => setForm(f => ({ ...f, gift_cost: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Create Campaign</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── SHIPMENTS ───────────────────────────────────────────────────────────────
function Shipments({ userId, toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer_name: "", gift: "", campaign: "", status: "pending", tracking: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from("shipments").select("*").eq("business_id", userId).order("created_at", { ascending: false });
    setRows(data ?? []); setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const { error } = await sb.from("shipments").insert({ ...form, business_id: userId });
    if (error) { toast(error.message, "err"); return; }
    toast("Shipment logged! 📦"); setShowAdd(false); setForm({ customer_name: "", gift: "", campaign: "", status: "pending", tracking: "" }); load();
  };

  const statusColors = { pending: "yellow", shipped: "blue", delivered: "green", failed: "red" };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Shipments</div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: 3 }}>{rows.length} total shipments</div>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Log Shipment</button>
      </div>

      <div className="card">
        {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
          : rows.length === 0
            ? <Empty icon="📬" title="No shipments yet" sub="Shipments will appear here once your campaigns start firing" />
            : <div className="table-wrap"><table>
                <thead><tr><th>Customer</th><th>Gift</th><th>Campaign</th><th>Tracking</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>{rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.customer_name}</td>
                    <td>{r.gift}</td>
                    <td style={{ color: S.muted }}>{r.campaign || "—"}</td>
                    <td style={{ color: S.teal, fontSize: 12, fontFamily: "monospace" }}>{r.tracking || "—"}</td>
                    <td><span className={`badge badge-${statusColors[r.status] || "yellow"}`}>● {r.status}</span></td>
                    <td style={{ color: S.muted, fontSize: 12 }}>{ago(r.created_at)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
        }
      </div>

      {showAdd && <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
        <div className="modal fade-up">
          <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Log Shipment</div>
          {[["customer_name","Customer Name","Sarah Johnson"],["gift","Gift Sent","Water Bottle"],["campaign","Campaign","Welcome Gift"],["tracking","Tracking #","1Z999AA10123456784"]].map(([k,l,p]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label className="label">{l}</label>
              <input className="input" placeholder={p} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["pending","shipped","delivered","failed"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save Shipment</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── WALLET ──────────────────────────────────────────────────────────────────
function Wallet({ userId, toast }) {
  const [wallet, setWallet] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topupAmt, setTopupAmt] = useState("");
  const [showTopup, setShowTopup] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: w } = await sb.from("wallet").select("*").eq("business_id", userId).single();
    setWallet(w);
    // Show last 10 shipments as transaction log
    const { data: s } = await sb.from("shipments").select("customer_name,gift,created_at").eq("business_id", userId).order("created_at", { ascending: false }).limit(10);
    setTxns(s ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const initWallet = async () => {
    const { error } = await sb.from("wallet").insert({ business_id: userId, balance: 0 });
    if (!error) load();
  };

  const topup = async () => {
    const amt = parseFloat(topupAmt);
    if (!amt || amt <= 0) { toast("Enter a valid amount", "err"); return; }
    if (!wallet) { toast("No wallet found", "err"); return; }
    await sb.from("wallet").update({ balance: (wallet.balance || 0) + amt, last_topup: new Date().toISOString() }).eq("business_id", userId);
    toast(`+${money(amt)} added to wallet 💳`); setTopupAmt(""); setShowTopup(false); load();
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>;

  return (
    <div className="fade-up">
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Wallet & Billing</div>
      <div style={{ fontSize: 13, color: S.muted, marginBottom: 24 }}>Manage your gift budget</div>

      {!wallet
        ? <div className="card"><Empty icon="💳" title="No wallet yet" sub="Set up your wallet to start sending gifts" action={<button className="btn-primary" onClick={initWallet}>Create Wallet</button>} /></div>
        : <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
              <div className="stat-card">
                <div style={{ fontSize: 22, marginBottom: 8 }}>💰</div>
                <div className="stat-num">{money(wallet.balance)}</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Current Balance</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 22, marginBottom: 8 }}>🔄</div>
                <div className="stat-num">{txns.length}</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Gifts This Month</div>
              </div>
              <div className="stat-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <button className="btn-primary" style={{ marginBottom: 8 }} onClick={() => setShowTopup(true)}>+ Add Funds</button>
                <div style={{ fontSize: 11, color: S.muted, textAlign: "center" }}>Auto-refill when balance is low</div>
              </div>
            </div>

            <div className="card">
              <div className="syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Transaction History</div>
              {txns.length === 0
                ? <div style={{ textAlign: "center", padding: "30px 0", color: S.muted, fontSize: 13 }}>No transactions yet</div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Description</th><th>Type</th><th>Date</th></tr></thead>
                    <tbody>{txns.map((t, i) => (
                      <tr key={i}>
                        <td>Gift shipped to {t.customer_name} — {t.gift}</td>
                        <td><span className="badge badge-red">− Debit</span></td>
                        <td style={{ color: S.muted, fontSize: 12 }}>{ago(t.created_at)}</td>
                      </tr>
                    ))}</tbody>
                  </table></div>
              }
            </div>
          </>
      }

      {showTopup && <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowTopup(false)}>
        <div className="modal fade-up">
          <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Add Funds</div>
          <div style={{ fontSize: 13, color: S.muted, marginBottom: 20 }}>Funds are used to pay for gifts as they ship</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[100, 250, 500].map(a => (
              <button key={a} onClick={() => setTopupAmt(String(a))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1.5px solid ${topupAmt == a ? S.teal : "rgba(14,165,233,.2)"}`, background: topupAmt == a ? "rgba(14,165,233,.1)" : "transparent", color: topupAmt == a ? S.teal : S.muted, fontWeight: 600, fontSize: 15 }}>
                ${a}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Custom Amount</label>
            <input className="input" type="number" placeholder="0.00" value={topupAmt} onChange={e => setTopupAmt(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={topup}>Add {topupAmt ? money(topupAmt) : "Funds"}</button>
            <button className="btn-ghost" onClick={() => setShowTopup(false)}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function Settings({ userId, user, toast, onLogout }) {
  const [profile, setProfile] = useState({ business_name: "", plan: "starter", email: user?.email || "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("clicktide").select("*").eq("id", userId).single();
      if (data) setProfile(p => ({ ...p, ...data }));
      setLoading(false);
    })();
  }, [userId]);

  const save = async () => {
    setSaving(true);
    const { error } = await sb.from("clicktide").update({ business_name: profile.business_name, plan: profile.plan }).eq("id", userId);
    if (error) toast(error.message, "err");
    else toast("Settings saved!");
    setSaving(false);
  };

  const plans = [
    { key: "starter", label: "Starter", price: "$29/mo", desc: "Up to 200 customers" },
    { key: "growth", label: "Growth", price: "$99/mo", desc: "Up to 500 customers" },
    { key: "scale", label: "Scale", price: "$299/mo", desc: "Unlimited customers" },
  ];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>;

  return (
    <div className="fade-up">
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Settings</div>

      <div style={{ display: "grid", gap: 16 }}>
        <div className="card">
          <div className="syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Business Profile</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div>
              <label className="label">Business Name</label>
              <input className="input" value={profile.business_name || ""} onChange={e => setProfile(p => ({ ...p, business_name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={profile.email} disabled style={{ opacity: .6 }} />
            </div>
          </div>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Spinner />Saving…</span> : "Save Changes"}
          </button>
        </div>

        <div className="card">
          <div className="syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Plan</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {plans.map(p => (
              <div key={p.key} onClick={() => setProfile(pr => ({ ...pr, plan: p.key }))} style={{ border: `1.5px solid ${profile.plan === p.key ? S.teal : "rgba(14,165,233,.15)"}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", background: profile.plan === p.key ? "rgba(14,165,233,.08)" : "transparent", transition: "all .2s" }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
                <div style={{ color: S.teal, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 12, color: S.muted }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Account</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-danger" onClick={onLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SHELL
// ═══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "overview", icon: "◈", label: "Overview" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "campaigns", icon: "🎯", label: "Campaigns" },
  { id: "shipments", icon: "📦", label: "Shipments" },
  { id: "wallet", icon: "💳", label: "Wallet" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState({ business_name: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    sb.from("clicktide").select("business_name").eq("id", user.id).single().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, [user.id]);

  const showToast = useCallback((msg, type = "ok") => setToast({ msg, type }), []);

  const PAGES = {
    overview: <Overview userId={user.id} toast={showToast} />,
    customers: <Customers userId={user.id} toast={showToast} />,
    campaigns: <Campaigns userId={user.id} toast={showToast} />,
    shipments: <Shipments userId={user.id} toast={showToast} />,
    wallet: <Wallet userId={user.id} toast={showToast} />,
    settings: <Settings userId={user.id} user={user} toast={showToast} onLogout={onLogout} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: S.navy }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: S.slate, borderRight: "1px solid rgba(14,165,233,.1)", display: "flex", flexDirection: "column", padding: "20px 12px", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div className="syne" style={{ fontSize: 18, fontWeight: 800, padding: "0 6px", marginBottom: 6, background: `linear-gradient(135deg, ${S.teal}, ${S.seafoam})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Clicktide
        </div>
        <div style={{ fontSize: 11, color: S.muted, padding: "0 6px", marginBottom: 24 }}>{profile.business_name || user.email}</div>

        <nav style={{ flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} className={`sidebar-link ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 6px 0", borderTop: "1px solid rgba(14,165,233,.08)" }}>
          <div style={{ fontSize: 11, color: S.muted }}>Connected to Supabase</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: S.seafoam }} className="pulse" />
            <span style={{ fontSize: 11, color: S.seafoam }}>Live</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", minWidth: 0 }}>
        {PAGES[page]}
      </div>

      {toast && <Toast key={Date.now()} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await sb.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <style>{css}</style>
      {loading
        ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><Spinner /></div>
        : user
          ? <Dashboard user={user} onLogout={logout} />
          : <AuthScreen onAuth={setUser} />
      }
    </>
  );
}
