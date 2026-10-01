"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard, ReceiptText, WalletCards, BarChart3, Target,
  Bot, Settings, LogOut, Plus, ArrowUpRight, ArrowDownRight,
  Search, Bell, Sparkles, Trash2, X, CheckCircle2, UserRound
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

type Transaction = {
  id:number; title:string; category:string; type:"income"|"expense"; amount:number; date:string;
};

const seed:Transaction[]=[
  {id:1,title:"Monthly allowance",category:"Income",type:"income",amount:25000,date:"29 Sep"},
  {id:2,title:"Hostel & bills",category:"Bills",type:"expense",amount:6500,date:"28 Sep"},
  {id:3,title:"Food delivery",category:"Food",type:"expense",amount:820,date:"27 Sep"},
  {id:4,title:"Metro / Bus",category:"Transport",type:"expense",amount:540,date:"26 Sep"},
  {id:5,title:"Course materials",category:"Education",type:"expense",amount:1200,date:"24 Sep"},
  {id:6,title:"Shopping",category:"Shopping",type:"expense",amount:1850,date:"22 Sep"}
];

const monthly=[
  {name:"Apr",income:21000,expense:14200},{name:"May",income:23000,expense:15100},
  {name:"Jun",income:25000,expense:16300},{name:"Jul",income:25000,expense:14800},
  {name:"Aug",income:26000,expense:17100},{name:"Sep",income:25000,expense:10910}
];

const categories=[
  {name:"Bills",value:6500},{name:"Shopping",value:1850},{name:"Education",value:1200},
  {name:"Food",value:820},{name:"Transport",value:540}
];

const budgets=[
  {name:"Food",spent:820,limit:2500},
  {name:"Transport",spent:540,limit:1800},
  {name:"Shopping",spent:1850,limit:3000},
  {name:"Bills",spent:6500,limit:8000}
];

const money=(n:number)=>`₹${n.toLocaleString("en-IN")}`;

export default function PocketApp(){
  const [page,setPage]=useState("Dashboard");
  const [transactions,setTransactions]=useState(seed);
  const [showAdd,setShowAdd]=useState(false);
  const [query,setQuery]=useState("");
  const [loggedIn,setLoggedIn]=useState(true);
  const [form,setForm]=useState({title:"",category:"Food",amount:"",type:"expense" as "expense"|"income"});

  const income=transactions.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
  const expenses=transactions.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0);
  const balance=income-expenses;
  const filtered=transactions.filter(t=>(t.title+" "+t.category).toLowerCase().includes(query.toLowerCase()));

  function addTransaction(){
    if(!form.title || !form.amount || Number(form.amount)<=0)return;
    setTransactions([{id:Date.now(),title:form.title,category:form.category,type:form.type,amount:Number(form.amount),date:"Today"},...transactions]);
    setForm({title:"",category:"Food",amount:"",type:"expense"});setShowAdd(false);
  }
  function remove(id:number){setTransactions(transactions.filter(t=>t.id!==id))}
  function nav(name:string){setPage(name)}

  if(!loggedIn) return <Login onLogin={()=>setLoggedIn(true)}/>;

  return <div className="shell">
    <aside className="sidebar">
      <div className="logo">POCKET<span>.AI</span></div>
      <nav className="nav">
        {[
          ["Dashboard",LayoutDashboard],["Transactions",ReceiptText],["Budgets",WalletCards],
          ["Analytics",BarChart3],["Savings Goals",Target],["POCKET AI",Bot]
        ].map(([name,Icon]:any)=><button key={name as string} className={page===name?"active":""} onClick={()=>nav(name as string)}><Icon size={17}/>{name as string}</button>)}
      </nav>
      <div className="sidebarBottom">
        <button className="nav" style={{width:"100%",background:"transparent",border:0,color:"var(--muted)",padding:"10px"}} onClick={()=>nav("Settings")}><Settings size={17}/>Settings</button>
        <button className="nav" style={{width:"100%",background:"transparent",border:0,color:"var(--muted)",padding:"10px"}} onClick={()=>setLoggedIn(false)}><LogOut size={17}/>Logout</button>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div>
          <div className="eyebrow">Personal finance OS</div>
          <strong>{page}</strong>
        </div>
        <div className="row">
          <Bell size={18} className="muted"/>
          <div className="avatar">V</div>
        </div>
      </header>

      <div className="page">
        {page==="Dashboard" && <Dashboard balance={balance} income={income} expenses={expenses} transactions={transactions} onAdd={()=>setShowAdd(true)} onNav={nav}/>}
        {page==="Transactions" && <Transactions data={filtered} query={query} setQuery={setQuery} onAdd={()=>setShowAdd(true)} onDelete={remove}/>}
        {page==="Budgets" && <Budgets/>}
        {page==="Analytics" && <Analytics/>}
        {page==="Savings Goals" && <Goals/>}
        {page==="POCKET AI" && <AI/>}
        {page==="Settings" && <SettingsPage onLogout={()=>setLoggedIn(false)}/>}
      </div>
    </main>

    <nav className="mobileNav">
      {[
        ["Dashboard",LayoutDashboard],["Analytics",BarChart3],["POCKET AI",Bot],["Savings Goals",Target],["Settings",Settings]
      ].map(([name,Icon]:any)=><button key={name} className={page===name?"active":""} onClick={()=>nav(name)}><Icon size={18}/>{name==="POCKET AI"?"AI":name.split(" ")[0]}</button>)}
    </nav>

    {showAdd && <Modal onClose={()=>setShowAdd(false)}>
      <div className="sectionHead"><h2>Add Transaction</h2><button className="btn" onClick={()=>setShowAdd(false)}><X size={16}/></button></div>
      <div className="form">
        <div className="formGrid">
          <div><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})}><option value="expense">Expense</option><option value="income">Income</option></select></div>
          <div><label>Amount</label><input type="number" placeholder="₹ 0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
        </div>
        <div><label>Description</label><input placeholder="e.g. Lunch" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
        <div><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Food</option><option>Transport</option><option>Shopping</option><option>Bills</option><option>Education</option><option>Entertainment</option><option>Other</option></select></div>
        <button className="btn primary" onClick={addTransaction}><Plus size={16}/> Add Transaction</button>
      </div>
    </Modal>}
  </div>
}

function Dashboard({balance,income,expenses,transactions,onAdd,onNav}:any){
  return <><div className="row"><div><div className="eyebrow">29 September 2026</div><h1>Good evening, Vasan.</h1><p className="muted">Your money, simplified.</p></div><button className="btn primary" onClick={onAdd}><Plus size={16}/> Add transaction</button></div>
    <div className="grid stats">
      <Metric title="Total Balance" value={money(balance)} meta="+8.4% vs last month" positive/>
      <Metric title="Monthly Income" value={money(income)} meta="6 income records" positive/>
      <Metric title="Monthly Expenses" value={money(expenses)} meta="72% of budget used"/>
      <Metric title="Savings Rate" value={`${income?Math.round((balance/income)*100):0}%`} meta="Target: 25%" positive/>
    </div>
    <div className="grid two">
      <div className="card"><div className="sectionHead"><div><div className="eyebrow">Cashflow</div><h2>Income vs spending</h2></div><span className="pill">6 months</span></div><div className="chartBox"><Cashflow/></div></div>
      <div className="card ai"><div className="sectionHead"><div><div className="eyebrow">POCKET AI</div><h2><Sparkles size={17} style={{verticalAlign:"-3px"}}/> Today's insight</h2></div></div><p className="aiText">Your current spending is within the planned monthly range. <b className="positive">Shopping</b> is your fastest-growing discretionary category. Reducing it by 15% could free roughly ₹450 this month.</p><button className="btn" onClick={()=>onNav("POCKET AI")}>Open AI assistant →</button></div>
    </div>
    <div className="grid two" style={{marginTop:16}}>
      <div className="card"><div className="sectionHead"><h2>Recent transactions</h2><button className="btn" onClick={()=>onNav("Transactions")}>View all</button></div><TxList data={transactions.slice(0,5)}/></div>
      <div className="card"><div className="sectionHead"><h2>Budget pulse</h2><span className="pill">September</span></div>{budgets.slice(0,3).map(b=><BudgetMini key={b.name} {...b}/>)}</div>
    </div>
  </>
}

function Metric({title,value,meta,positive}:any){return <div className="card"><div className="muted" style={{fontSize:12}}>{title}</div><div className="statValue">{value}</div><div className={positive?"positive":"statMeta"} style={{fontSize:12,marginTop:8}}>{positive&&"↗ "}{meta}</div></div>}

function TxList({data,onDelete}:any){return <div className="txList">{data.length?data.map((t:Transaction)=><div className="tx row" key={t.id}><div className="row" style={{justifyContent:"flex-start"}}><div className="iconBox">{t.type==="income"?<ArrowDownRight size={17} className="positive"/>:<ArrowUpRight size={17} className="negative"/>}</div><div><b>{t.title}</b><div className="muted" style={{fontSize:11}}>{t.category} · {t.date}</div></div></div><div className="row"><b className={t.type==="income"?"positive":"negative"}>{t.type==="income"?"+":"-"}{money(t.amount)}</b>{onDelete&&<button className="btn danger" style={{padding:6}} onClick={()=>onDelete(t.id)}><Trash2 size={14}/></button>}</div></div>):<div className="empty">No transactions found.</div>}</div>}

function Transactions({data,query,setQuery,onAdd,onDelete}:any){return <><div className="row"><div><div className="eyebrow">Ledger</div><h1>Transactions</h1><p className="muted">Every rupee, accounted for.</p></div><button className="btn primary" onClick={onAdd}><Plus size={16}/> Add transaction</button></div><div className="card" style={{marginTop:22}}><div className="row"><div style={{position:"relative",flex:1}}><Search size={16} style={{position:"absolute",left:12,top:12,color:"var(--muted)"}}/><input style={{paddingLeft:36}} placeholder="Search transactions..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div style={{overflowX:"auto",marginTop:18}}><table className="table"><thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Amount</th><th></th></tr></thead><tbody>{data.map((t:Transaction)=><tr key={t.id}><td><b>{t.title}</b></td><td>{t.category}</td><td>{t.date}</td><td className={t.type==="income"?"positive":"negative"}>{t.type==="income"?"+":"-"}{money(t.amount)}</td><td><button className="btn danger" style={{padding:6}} onClick={()=>onDelete(t.id)}><Trash2 size={14}/></button></td></tr>)}</tbody></table></div></div></>}

function Budgets(){return <><div><div className="eyebrow">Control center</div><h1>Monthly budgets</h1><p className="muted">Keep spending intentional.</p></div><div className="grid two" style={{marginTop:22}}><div className="card"><div className="sectionHead"><h2>September limits</h2><button className="btn primary"><Plus size={16}/> New budget</button></div>{budgets.map(b=><BudgetMini key={b.name} {...b}/>)}</div><div className="card"><div className="eyebrow">Budget health</div><h2 style={{marginTop:5}}>72% utilized</h2><p className="aiText">You have <b className="positive">₹3,590</b> of planned discretionary spending remaining across active budgets.</p><div className="progress"><div style={{width:"72%"}}/></div></div></div></>}

function BudgetMini({name,spent,limit}:any){let p=Math.min(100,Math.round(spent/limit*100));return <div className="budget"><div className="row"><b>{name}</b><span className="muted">{money(spent)} / {money(limit)}</span></div><div className="progress"><div style={{width:`${p}%`}}/></div><div className="row" style={{fontSize:11,marginTop:6}}><span className="muted">{p}% used</span><span className={p>85?"warning":"positive"}>{p>85?"Near limit":"On track"}</span></div></div>}

function Analytics(){return <><div><div className="eyebrow">Financial intelligence</div><h1>Analytics</h1><p className="muted">See the shape of your spending.</p></div><div className="grid two" style={{marginTop:22}}><div className="card"><div className="sectionHead"><h2>Cashflow trend</h2><span className="pill">2026</span></div><div className="chartBox"><Cashflow/></div></div><div className="card"><div className="sectionHead"><h2>Expense mix</h2></div><div className="chartBox"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>{categories.map((_,i)=><Cell key={i} fill={["#00ff9b","#68ffc0","#b4ffdc","#5aa98a","#2b604c"][i]}/>)}</Pie><Tooltip contentStyle={{background:"#0b0d0c",border:"1px solid #333"}}/><text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="16">₹10.9K</text></PieChart></ResponsiveContainer></div></div></div></>}

function Cashflow(){return <ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ff9b" stopOpacity=".28"/><stop offset="100%" stopColor="#00ff9b" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false}/><XAxis dataKey="name" stroke="#69716d" fontSize={11}/><YAxis stroke="#69716d" fontSize={11}/><Tooltip contentStyle={{background:"#0b0d0c",border:"1px solid #333"}}/><Area type="monotone" dataKey="income" stroke="#00ff9b" fill="url(#g)" strokeWidth={2}/><Area type="monotone" dataKey="expense" stroke="#ff5964" fill="none" strokeWidth={2}/></AreaChart></ResponsiveContainer>}

function Goals(){return <><div className="row"><div><div className="eyebrow">Future fund</div><h1>Savings goals</h1><p className="muted">Give your money somewhere to go.</p></div><button className="btn primary"><Plus size={16}/> New goal</button></div><div className="grid three" style={{marginTop:22}}>{[{name:"New Laptop",saved:24000,target:60000,days:84},{name:"Emergency Fund",saved:18000,target:30000,days:120},{name:"Course Fee",saved:8500,target:15000,days:48}].map(g=><div className="card" key={g.name}><div className="row"><div className="iconBox"><Target size={17} className="positive"/></div><span className="pill">{g.days} days</span></div><h2 style={{marginTop:18}}>{g.name}</h2><div className="statValue">{money(g.saved)}</div><div className="muted">of {money(g.target)}</div><div className="progress"><div style={{width:`${g.saved/g.target*100}%`}}/></div><div className="row" style={{fontSize:12,marginTop:8}}><span className="positive">{Math.round(g.saved/g.target*100)}% complete</span><span className="muted">{money(g.target-g.saved)} left</span></div></div>)}</div></>}

function AI(){return <><div><div className="eyebrow">Intelligent finance layer</div><h1>POCKET AI</h1><p className="muted">Ask questions about your spending and get actionable insights.</p></div><div className="grid two" style={{marginTop:22}}><div className="card ai"><div className="sectionHead"><h2><Bot size={18}/> Financial copilot</h2><span className="pill">Demo AI</span></div><div className="aiText"><p><b>Here&apos;s what I found:</b></p><p>• Your September spending is concentrated in <b>Bills</b>, followed by Shopping.</p><p>• Your savings rate is currently healthy relative to your income.</p><p>• Cutting shopping by 15% would save approximately <b className="positive">₹450</b> this month.</p><p>• Your New Laptop goal is 40% funded.</p></div><div className="row"><input placeholder="Ask: How can I save ₹2,000 this month?"/><button className="btn primary"><Sparkles size={16}/></button></div></div><div className="card"><div className="eyebrow">Quick intelligence</div><h2 style={{marginTop:5}}>Recommendations</h2>{["Reduce discretionary shopping","Set a ₹2,500 food ceiling","Automate laptop goal savings"].map((x,i)=><div className="tx row" key={x}><div className="row" style={{justifyContent:"flex-start"}}><CheckCircle2 size={17} className="positive"/><span>{x}</span></div><span className="pill">#{i+1}</span></div>)}</div></div></>}

function SettingsPage({onLogout}:any){return <><div className="eyebrow">Account</div><h1>Settings</h1><div className="card" style={{marginTop:22,maxWidth:700}}><div className="row"><div className="row" style={{justifyContent:"flex-start"}}><div className="avatar">V</div><div><b>Vasan</b><div className="muted">Demo account · Google-ready</div></div></div><button className="btn danger" onClick={onLogout}><LogOut size={15}/> Logout</button></div><hr style={{border:0,borderTop:"1px solid var(--line)",margin:"22px 0"}}/><div className="formGrid"><div><label>Currency</label><select defaultValue="INR"><option>INR — ₹</option><option>USD — $</option></select></div><div><label>Monthly income</label><input defaultValue="25000"/></div></div><p className="muted" style={{fontSize:12,marginTop:18}}>For the one-hour submission build, authentication is represented by a local demo session. Supabase Google OAuth can be connected using the included environment placeholders.</p></div></>}

function Modal({children,onClose}:any){return <div style={{position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,.72)",display:"grid",placeItems:"center",padding:16}}><div className="card" style={{width:"min(520px,100%)",maxHeight:"90vh",overflow:"auto"}}>{children}</div></div>}

function Login({onLogin}:any){return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20,background:"radial-gradient(circle at 50% 0,rgba(0,255,155,.12),transparent 35%),#050505"}}><div className="card" style={{width:"min(440px,100%)",textAlign:"center",padding:38}}><div className="logo">POCKET<span>.AI</span></div><div className="eyebrow">Smart finance assistant</div><h1 style={{marginTop:12}}>Your money, simplified.</h1><p className="muted" style={{lineHeight:1.7}}>Track spending, build budgets, and get intelligent recommendations.</p><button className="btn primary" style={{width:"100%",marginTop:18}} onClick={onLogin}><UserRound size={17}/> Continue with Google</button><p className="muted" style={{fontSize:11,marginTop:16}}>Demo mode · No real financial credentials are collected.</p></div></main>}
