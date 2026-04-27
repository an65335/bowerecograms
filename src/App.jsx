import { useState, useRef } from "react";

const W = 920, H = 640, GAP = 42;

const CATS = [
  { id: 'family-immediate',        label: 'Family – Immediate',             color: '#2563EB' },
  { id: 'family-extended',         label: 'Family – Extended / Biological', color: '#7C3AED' },
  { id: 'family-step',             label: 'Family – Step',                  color: '#DB2777' },
  { id: 'family-adoptive',         label: 'Family – Adoptive',              color: '#92400E' },
  { id: 'peers',                   label: 'Peers',                          color: '#D97706' },
  { id: 'professional-school',     label: 'Professional – School',          color: '#059669' },
  { id: 'professional-healthcare', label: 'Professional – Healthcare',      color: '#0891B2' },
  { id: 'professional-other',      label: 'Professional – Other',           color: '#4F46E5' },
  { id: 'family-friends',          label: 'Family Friends',                 color: '#EA580C' },
  { id: 'other',                   label: 'Other',                          color: '#6B7280' },
];

const REL_TYPES = [
  { id: 'strong',    label: 'Strong',    color: '#16A34A', width: 3 },
  { id: 'neutral',   label: 'Neutral',   color: '#2563EB', width: 2 },
  { id: 'fractured', label: 'Fractured', color: '#DC2626', width: 2 },
  { id: 'complex',   label: 'Complex',   tramColor: '#16A34A', zigColor: '#DC2626' },
];

const CONN_TYPES = [
  { id: 'none',      label: 'No connection line' },
  { id: 'connected', label: 'Connected'           },
  { id: 'separated', label: 'Separated'           },
  { id: 'divorced',  label: 'Divorced'            },
];

const catCol = id => CATS.find(c => c.id === id)?.color || '#6B7280';
const uid = () => Math.random().toString(36).slice(2, 9);
const RP = 5;

function zigzag(x1, y1, x2, y2, amp = 7) {
  const dx = x2-x1, dy = y2-y1, len = Math.sqrt(dx*dx+dy*dy);
  if (len < 2) return '';
  const ux = dx/len, uy = dy/len, px = -uy, py = ux;
  const n = Math.max(4, Math.round(len / 11)) * 2;
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), s = i % 2 === 0 ? -1 : 1;
    d += ` L ${x1 + ux*len*t + px*amp*s} ${y1 + uy*len*t + py*amp*s}`;
  }
  return d + ` L ${x2} ${y2}`;
}

function NodeShape({ p, cc, selected }) {
  const { x, y, gender, deceased, isChild, name, role } = p;
  const S = isChild ? 32 : 26;
  const selP = { fill: 'none', stroke: '#2563EB', strokeWidth: 2, strokeDasharray: '5 3' };

  if (gender === 'male') {
    const labelY = y + S + RP + 15;
    return <>
      {selected && <rect x={x-S-RP-8} y={y-S-RP-8} width={(S+RP+8)*2} height={(S+RP+8)*2} rx="5" {...selP}/>}
      {isChild  && <rect x={x-S-RP-9} y={y-S-RP-9} width={(S+RP+9)*2} height={(S+RP+9)*2} rx="6" fill="none" stroke={cc} strokeWidth="1" strokeDasharray="3 2"/>}
      <rect x={x-S-RP} y={y-S-RP} width={(S+RP)*2} height={(S+RP)*2} fill={cc} rx="4"/>
      <rect x={x-S} y={y-S} width={S*2} height={S*2} fill="white" stroke={cc} strokeWidth="1.5" rx="2"/>
      {deceased && <g stroke="#111" strokeWidth="2.5" strokeLinecap="round">
        <line x1={x-S*.65} y1={y-S*.65} x2={x+S*.65} y2={y+S*.65}/>
        <line x1={x+S*.65} y1={y-S*.65} x2={x-S*.65} y2={y+S*.65}/>
      </g>}
      <text x={x} y={labelY} textAnchor="middle" fontSize="11" fill="#111827" fontWeight={isChild?700:500} style={{pointerEvents:'none'}}>{name}</text>
      {role && <text x={x} y={labelY+13} textAnchor="middle" fontSize="9" fill="#6B7280" style={{pointerEvents:'none'}}>{role}</text>}
    </>;
  }

  if (gender === 'female') {
    const labelY = y + S + RP + 15;
    return <>
      {selected && <circle cx={x} cy={y} r={S+RP+8} {...selP}/>}
      {isChild  && <circle cx={x} cy={y} r={S+RP+9} fill="none" stroke={cc} strokeWidth="1" strokeDasharray="3 2"/>}
      <circle cx={x} cy={y} r={S+RP} fill={cc}/>
      <circle cx={x} cy={y} r={S} fill="white" stroke={cc} strokeWidth="1.5"/>
      {deceased && <g stroke="#111" strokeWidth="2.5" strokeLinecap="round">
        <line x1={x-S*.65} y1={y-S*.65} x2={x+S*.65} y2={y+S*.65}/>
        <line x1={x+S*.65} y1={y-S*.65} x2={x-S*.65} y2={y+S*.65}/>
      </g>}
      <text x={x} y={labelY} textAnchor="middle" fontSize="11" fill="#111827" fontWeight={isChild?700:500} style={{pointerEvents:'none'}}>{name}</text>
      {role && <text x={x} y={labelY+13} textAnchor="middle" fontSize="9" fill="#6B7280" style={{pointerEvents:'none'}}>{role}</text>}
    </>;
  }

  if (gender === 'nonbinary') {
    const labelY = y + S + RP + 15;
    return <>
      {selected && <rect x={x-S-RP-8} y={y-S-RP-8} width={(S+RP+8)*2} height={(S+RP+8)*2} rx="5" {...selP}/>}
      {isChild  && <rect x={x-S-RP-9} y={y-S-RP-9} width={(S+RP+9)*2} height={(S+RP+9)*2} rx="6" fill="none" stroke={cc} strokeWidth="1" strokeDasharray="3 2"/>}
      <rect x={x-S-RP} y={y-S-RP} width={(S+RP)*2} height={(S+RP)*2} fill={cc} rx="4"/>
      <rect x={x-S} y={y-S} width={S*2} height={S*2} fill="white" stroke={cc} strokeWidth="1.5" rx="2"/>
      <circle cx={x} cy={y} r={S*0.55} fill="none" stroke={cc} strokeWidth="1.5"/>
      {deceased && <g stroke="#111" strokeWidth="2.5" strokeLinecap="round">
        <line x1={x-S*.65} y1={y-S*.65} x2={x+S*.65} y2={y+S*.65}/>
        <line x1={x+S*.65} y1={y-S*.65} x2={x-S*.65} y2={y+S*.65}/>
      </g>}
      <text x={x} y={labelY} textAnchor="middle" fontSize="11" fill="#111827" fontWeight={isChild?700:500} style={{pointerEvents:'none'}}>{name}</text>
      {role && <text x={x} y={labelY+13} textAnchor="middle" fontSize="9" fill="#6B7280" style={{pointerEvents:'none'}}>{role}</text>}
    </>;
  }

  if (gender === 'unborn') {
    const th = S * 1.9, hw = S * 1.1;
    const tipY = y - th * 0.6, baseY = y + th * 0.4;
    const sc = 1 + RP / S;
    const rTipY = y - th * sc * 0.6, rBaseY = y + th * sc * 0.4, rHw = hw * sc;
    const labelY = baseY + RP + 15;
    return <>
      {selected && <polygon points={`${x},${rTipY-8} ${x-rHw-6},${rBaseY+6} ${x+rHw+6},${rBaseY+6}`} {...selP}/>}
      <polygon points={`${x},${rTipY} ${x-rHw},${rBaseY} ${x+rHw},${rBaseY}`} fill={cc}/>
      <polygon points={`${x},${tipY} ${x-hw},${baseY} ${x+hw},${baseY}`} fill="white" stroke={cc} strokeWidth="1.5"/>
      {deceased && <g stroke="#111" strokeWidth="2.5" strokeLinecap="round">
        <line x1={x-hw*.5} y1={y+th*.05} x2={x+hw*.5} y2={y+th*.25}/>
        <line x1={x+hw*.5} y1={y+th*.05} x2={x-hw*.5} y2={y+th*.25}/>
      </g>}
      <text x={x} y={labelY} textAnchor="middle" fontSize="11" fill="#111827" fontWeight={isChild?700:500} style={{pointerEvents:'none'}}>{name}</text>
      {role && <text x={x} y={labelY+13} textAnchor="middle" fontSize="9" fill="#6B7280" style={{pointerEvents:'none'}}>{role}</text>}
    </>;
  }
  return null;
}

function ConnLine({ conn, persons, hidRel, onEdit }) {
  const from = persons.find(p => p.id === conn.from);
  const to   = persons.find(p => p.id === conn.to);
  if (!from || !to) return null;
  const dx = to.x-from.x, dy = to.y-from.y, len = Math.sqrt(dx*dx+dy*dy);
  if (len < 2) return null;
  const ux = dx/len, uy = dy/len, px = -uy, py = ux;
  const x1 = from.x+ux*GAP, y1 = from.y+uy*GAP;
  const x2 = to.x-ux*GAP,   y2 = to.y-uy*GAP;
  const mx = (x1+x2)/2, my = (y1+y2)/2;
  const cl = 11, tram = 8;
  const rt = REL_TYPES.find(r => r.id === conn.relType);
  const showRel = rt && !hidRel.has(conn.relType);

  return (
    <g onClick={onEdit} style={{cursor:'pointer'}}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="20"/>
      {conn.connType !== 'none' && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5"/>}
      {conn.connType === 'separated' && (
        <line x1={mx-px*cl} y1={my-py*cl} x2={mx+px*cl} y2={my+py*cl} stroke="#374151" strokeWidth="2.5"/>
      )}
      {conn.connType === 'divorced' && (<>
        <line x1={mx-px*cl-ux*7} y1={my-py*cl-uy*7} x2={mx+px*cl-ux*7} y2={my+py*cl-uy*7} stroke="#374151" strokeWidth="2.5"/>
        <line x1={mx-px*cl+ux*7} y1={my-py*cl+uy*7} x2={mx+px*cl+ux*7} y2={my+py*cl+uy*7} stroke="#374151" strokeWidth="2.5"/>
      </>)}
      {showRel && (conn.relType==='strong' || conn.relType==='neutral') && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={rt.color} strokeWidth={rt.width} opacity="0.85"/>
      )}
      {showRel && conn.relType==='fractured' && (
        <path d={zigzag(x1,y1,x2,y2,7)} stroke={rt.color} strokeWidth="2" fill="none"/>
      )}
      {showRel && conn.relType==='complex' && (<>
        <line x1={x1+px*tram} y1={y1+py*tram} x2={x2+px*tram} y2={y2+py*tram} stroke={rt.tramColor} strokeWidth="1.5"/>
        <line x1={x1-px*tram} y1={y1-py*tram} x2={x2-px*tram} y2={y2-py*tram} stroke={rt.tramColor} strokeWidth="1.5"/>
        <path d={zigzag(x1,y1,x2,y2,5)} stroke={rt.zigColor} strokeWidth="1.5" fill="none"/>
      </>)}
      <circle cx={mx} cy={my} r="6" fill="white" stroke="#D1D5DB" strokeWidth="1.5"/>
      <text x={mx} y={my+3.5} textAnchor="middle" fontSize="8" fill="#6B7280" style={{pointerEvents:'none',userSelect:'none'}}>✎</text>
    </g>
  );
}

const IS = {width:'100%',padding:'7px 10px',border:'1px solid #D1D5DB',borderRadius:6,fontSize:13,marginBottom:12,boxSizing:'border-box',fontFamily:'inherit',outline:'none'};
const LS = {display:'block',fontSize:11,fontWeight:600,color:'#374151',marginBottom:4};
const BT = {border:'none',borderRadius:6,fontSize:13,cursor:'pointer',padding:'8px 12px'};

export default function App() {
  const [persons, setPersons] = useState([
    {id:'child',name:'Child',gender:'female',category:'family-immediate',role:'',deceased:false,x:W/2,y:H/2,isChild:true}
  ]);
  const [conns, setConns]       = useState([]);
  const [mode, setMode]         = useState('drag');
  const [first, setFirst]       = useState(null);
  const [drag, setDrag]         = useState(null);
  const [modal, setModal]       = useState(null);
  const [editId, setEditId]     = useState(null);
  const [connData, setConnData] = useState(null);
  const [hidCat, setHidCat]     = useState(new Set());
  const [hidRel, setHidRel]     = useState(new Set());
  const [pForm, setPForm]       = useState({name:'',gender:'male',category:'family-immediate',role:'',deceased:false});
  const [cForm, setCForm]       = useState({connType:'connected',relType:'none'});
  const svgRef = useRef();
  const animationRef = useRef(null);
  const exportPNG = () => {
  const svg = svgRef.current;
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "bower-ecogram.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  img.src = url;
};
  const svgPos = e => {
    const r = svgRef.current.getBoundingClientRect();
    return {x:(e.clientX-r.left)*(W/r.width), y:(e.clientY-r.top)*(H/r.height)};
  };

  const onNodeMD = (e, id) => {
  if (mode !== 'drag') return;
  e.stopPropagation();

  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }

  const p = persons.find(x => x.id === id);
  if (p.isChild) return;

  const pos = svgPos(e);

  setDrag({
    id,
    ox: pos.x - p.x,
    oy: pos.y - p.y,
    lastX: p.x,
    lastY: p.y,
    vx: 0,
    vy: 0
  });
};

  const onMM = e => {
  if (!drag) return;

  const pos = svgPos(e);
  const newX = Math.max(55, Math.min(W - 55, pos.x - drag.ox));
  const newY = Math.max(55, Math.min(H - 55, pos.y - drag.oy));

  const vx = newX - drag.lastX;
  const vy = newY - drag.lastY;

  setDrag(d => ({
    ...d,
    lastX: newX,
    lastY: newY,
    vx,
    vy
  }));

  setPersons(prev => prev.map(p =>
    p.id === drag.id
      ? { ...p, x: newX, y: newY }
      : p
  ));
};
  const releaseDrag = () => {
  if (!drag) return;

  let vx = drag.vx || 0;
  let vy = drag.vy || 0;
  const id = drag.id;

  setDrag(null);

  const animate = () => {
    vx *= -0.55;
    vy *= -0.55;

    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
      animationRef.current = null;
      return;
    }

    setPersons(prev => prev.map(p => {
      if (p.id !== id) return p;

      return {
        ...p,
        x: Math.max(55, Math.min(W - 55, p.x + vx)),
        y: Math.max(55, Math.min(H - 55, p.y + vy))
      };
    }));

    animationRef.current = requestAnimationFrame(animate);
  };

  animationRef.current = requestAnimationFrame(animate);
};

  const onNodeClick = (e, id) => {
    if (mode !== 'connect') return;
    e.stopPropagation();
    if (!first) { setFirst(id); return; }
    if (first===id) { setFirst(null); return; }
    const ex = conns.find(c => (c.from===first&&c.to===id)||(c.from===id&&c.to===first));
    setConnData({fromId:first,toId:id,existing:ex});
    setCForm(ex ? {connType:ex.connType,relType:ex.relType} : {connType:'connected',relType:'none'});
    setModal('conn');
    setFirst(null);
  };

  const openEditConn = c => {
    setConnData({fromId:c.from,toId:c.to,existing:c});
    setCForm({connType:c.connType,relType:c.relType});
    setModal('conn');
  };

  const openAdd = () => { setPForm({name:'',gender:'male',category:'family-immediate',role:'',deceased:false}); setEditId(null); setModal('person'); };
  const openEdit = p => { setPForm({name:p.name,gender:p.gender,category:p.category,role:p.role||'',deceased:p.deceased||false}); setEditId(p.id); setModal('person'); };

  const savePerson = () => {
    if (!pForm.name.trim()) return;
    if (editId) {
      setPersons(prev => prev.map(p => p.id===editId ? {...p,...pForm} : p));
    } else {
      const a = Math.random()*Math.PI*2, d = 160+Math.random()*90;
      setPersons(prev => [...prev, {id:uid(),...pForm,x:W/2+Math.cos(a)*d,y:H/2+Math.sin(a)*d,isChild:false}]);
    }
    setModal(null); setEditId(null);
  };

  const delPerson = () => {
    setPersons(prev => prev.filter(p => p.id!==editId));
    setConns(prev => prev.filter(c => c.from!==editId&&c.to!==editId));
    setModal(null); setEditId(null);
  };

  const saveConn = () => {
    const {fromId,toId,existing} = connData;
    if (cForm.connType==='none'&&cForm.relType==='none') {
      setConns(prev => prev.filter(c => !((c.from===fromId&&c.to===toId)||(c.from===toId&&c.to===fromId))));
    } else if (existing) {
      setConns(prev => prev.map(c => ((c.from===fromId&&c.to===toId)||(c.from===toId&&c.to===fromId)) ? {...c,...cForm} : c));
    } else {
      setConns(prev => [...prev, {id:uid(),from:fromId,to:toId,...cForm}]);
    }
    setModal(null); setConnData(null);
  };

  const delConn = () => { setConns(prev => prev.filter(c => c.id!==connData.existing.id)); setModal(null); setConnData(null); };
  const tog = (setter, key) => setter(p => { const s=new Set(p); s.has(key)?s.delete(key):s.add(key); return s; });

  const visP   = persons.filter(p => p.isChild||!hidCat.has(p.category));
  const visIds = new Set(visP.map(p=>p.id));
  const visC   = conns.filter(c => visIds.has(c.from)&&visIds.has(c.to));
  const nm     = id => persons.find(p=>p.id===id)?.name||'';

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'system-ui,-apple-system,sans-serif',fontSize:13}}>
      <div style={{width:228,background:'#fff',borderRight:'1px solid #E5E7EB',padding:'14px 12px',overflowY:'auto',flexShrink:0,display:'flex',flexDirection:'column'}}>
        <div style={{fontWeight:700,fontSize:14,color:'#111827',marginBottom:14}}>Bower Ecogram Builder</div>
        <div style={{display:'flex',gap:4,marginBottom:10}}>
          {[['drag','Move'],['connect','Connect']].map(([m,lbl])=>(
            <button key={m} onClick={()=>{setMode(m);setFirst(null);}}
              style={{flex:1,padding:'6px 0',borderRadius:5,border:'1px solid #E5E7EB',background:mode===m?'#1F2937':'#fff',color:mode===m?'#fff':'#374151',fontSize:12,cursor:'pointer'}}>
              {lbl}
            </button>
          ))}
        </div>
        <button onClick={openAdd} style={{width:'100%',padding:'7px 0',background:'#2563EB',color:'#fff',border:'none',borderRadius:5,fontSize:12,cursor:'pointer',marginBottom:8}}>
  + Add Person
</button>

<button
  onClick={exportPNG}
  style={{
    width:'100%',
    padding:'7px 0',
    background:'#059669',
    color:'#fff',
    border:'none',
    borderRadius:5,
    fontSize:12,
    cursor:'pointer',
    marginBottom:18
  }}
>
  Export as PNG
</button>
        <Sec label="Categories">
          {CATS.map(cat=>(
            <FRow key={cat.id} checked={!hidCat.has(cat.id)} onChange={()=>tog(setHidCat,cat.id)}>
              <span style={{width:9,height:9,borderRadius:'50%',background:cat.color,display:'inline-block',flexShrink:0}}/>
              <span style={{fontSize:11,color:'#374151',lineHeight:1.3}}>{cat.label}</span>
            </FRow>
          ))}
        </Sec>
        <Sec label="Relationship Quality">
          {REL_TYPES.map(rt=>(
            <FRow key={rt.id} checked={!hidRel.has(rt.id)} onChange={()=>tog(setHidRel,rt.id)}>
              <svg width="30" height="18" style={{flexShrink:0}}>
                {rt.id==='strong'    && <line x1="0" y1="9" x2="30" y2="9" stroke={rt.color} strokeWidth="3"/>}
                {rt.id==='neutral'   && <line x1="0" y1="9" x2="30" y2="9" stroke={rt.color} strokeWidth="2"/>}
                {rt.id==='fractured' && <path d="M0,9 L3,3 L6,15 L9,3 L12,15 L15,3 L18,15 L21,3 L24,15 L27,3 L30,9" stroke={rt.color} strokeWidth="1.5" fill="none"/>}
                {rt.id==='complex'   && <>
                  <line x1="0" y1="5"  x2="30" y2="5"  stroke={rt.tramColor} strokeWidth="1.5"/>
                  <line x1="0" y1="13" x2="30" y2="13" stroke={rt.tramColor} strokeWidth="1.5"/>
                  <path d="M0,9 L4,5 L8,13 L12,5 L16,13 L20,5 L24,13 L28,5 L30,9" stroke={rt.zigColor} strokeWidth="1.5" fill="none"/>
                </>}
              </svg>
              <span style={{fontSize:11,color:'#374151'}}>{rt.label}</span>
            </FRow>
          ))}
        </Sec>
        <Sec label="Legend">
          <div style={{fontSize:10,color:'#6B7280',lineHeight:2.2}}>
            {[
              ['Male',       <svg width="14" height="14"><rect x="1" y="1" width="12" height="12" fill="none" stroke="#374151" strokeWidth="1.5" rx="1"/></svg>],
              ['Female',     <svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="none" stroke="#374151" strokeWidth="1.5"/></svg>],
              ['Non-binary', <svg width="14" height="14"><rect x="1" y="1" width="12" height="12" fill="none" stroke="#374151" strokeWidth="1.5" rx="1"/><circle cx="7" cy="7" r="3.8" fill="none" stroke="#374151" strokeWidth="1.2"/></svg>],
              ['Unborn',     <svg width="14" height="14"><polygon points="7,1 1,13 13,13" fill="none" stroke="#374151" strokeWidth="1.5"/></svg>],
            ].map(([lbl,icon])=>(
              <div key={lbl} style={{display:'flex',alignItems:'center',gap:6}}>{icon}{lbl}</div>
            ))}
            <div style={{marginTop:4,borderTop:'1px solid #F3F4F6',paddingTop:6}}>
              {[
                ['Connected', <svg width="26" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#374151" strokeWidth="1.5"/></svg>],
                ['Separated', <svg width="26" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#374151" strokeWidth="1.5"/><line x1="13" y1="0" x2="13" y2="10" stroke="#374151" strokeWidth="2.5"/></svg>],
                ['Divorced',  <svg width="26" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#374151" strokeWidth="1.5"/><line x1="9" y1="0" x2="9" y2="10" stroke="#374151" strokeWidth="2.5"/><line x1="17" y1="0" x2="17" y2="10" stroke="#374151" strokeWidth="2.5"/></svg>],
              ].map(([lbl,icon])=>(
                <div key={lbl} style={{display:'flex',alignItems:'center',gap:6}}>{icon}{lbl}</div>
              ))}
              <div style={{marginTop:2}}>✕ Deceased</div>
            </div>
          </div>
        </Sec>
        <div style={{fontSize:10,color:'#9CA3AF',marginTop:'auto',paddingTop:10,lineHeight:1.7,borderTop:'1px solid #F3F4F6'}}>
          <b>Move mode:</b> drag nodes.<br/>
          <b>Connect mode:</b> click two nodes to link.<br/>
          Click ✎ on any line to edit it.
        </div>
      </div>

      <div style={{flex:1,overflow:'hidden',position:'relative',background:'#FAFAFA'}}>
        {mode==='connect' && (
          <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',background:'#1F2937',color:'#fff',padding:'5px 16px',borderRadius:20,fontSize:11,zIndex:10,whiteSpace:'nowrap',pointerEvents:'none'}}>
            {first ? 'Now click a second person to connect' : 'Click a person to begin connecting'}
          </div>
        )}
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%"
          onMouseMove={onMM} onMouseUp={releaseDrag} onMouseLeave={releaseDrag}
          style={{display:'block',cursor:mode==='connect'?'crosshair':'default'}}>
          <rect width={W} height={H} fill="white"/>
          <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="1" fill="#E5E7EB"/>
          </pattern>
          <rect width={W} height={H} fill="url(#dots)"/>
          {visC.map(c=>(
            <ConnLine key={c.id} conn={c} persons={persons} hidRel={hidRel} onEdit={()=>openEditConn(c)}/>
          ))}
          {visP.map(p=>(
            <g key={p.id}
              onMouseDown={e=>onNodeMD(e,p.id)}
              onClick={e=>onNodeClick(e,p.id)}
              onDoubleClick={e=>{e.stopPropagation();openEdit(p);}}
              style={{cursor:mode==='connect'?'pointer':(p.isChild?'default':'grab'),userSelect:'none'}}>
              <NodeShape p={p} cc={catCol(p.category)} selected={first===p.id}/>
            </g>
          ))}
        </svg>
      </div>

      {modal==='person' && (
        <Overlay>
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>{editId?'Edit Person':'Add Person'}</div>
          <label style={LS}>Name</label>
          <input value={pForm.name} onChange={e=>setPForm(f=>({...f,name:e.target.value}))} style={IS} placeholder="First name" autoFocus/>
          <label style={LS}>Role / Place in child's life</label>
          <input value={pForm.role} onChange={e=>setPForm(f=>({...f,role:e.target.value}))} style={IS} placeholder="e.g. Teacher, GP, Grandmother"/>
          <label style={LS}>Gender / Status</label>
          <select value={pForm.gender} onChange={e=>setPForm(f=>({...f,gender:e.target.value}))} style={IS}>
            <option value="male">Male ■</option>
            <option value="female">Female ●</option>
            <option value="nonbinary">Non-binary ◎</option>
            <option value="unborn">Unborn / Pregnancy ▲</option>
          </select>
          <label style={LS}>Category</label>
          <select value={pForm.category} onChange={e=>setPForm(f=>({...f,category:e.target.value}))} style={IS}>
            {CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          {editId && editId!=='child' && (
            <label style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,cursor:'pointer',fontSize:13}}>
              <input type="checkbox" checked={pForm.deceased} onChange={e=>setPForm(f=>({...f,deceased:e.target.checked}))}/>
              Mark as deceased
            </label>
          )}
          <div style={{display:'flex',gap:8}}>
            <button onClick={savePerson} style={{...BT,flex:1,background:'#2563EB',color:'#fff'}}>{editId?'Save':'Add'}</button>
            {editId && editId!=='child' && <button onClick={delPerson} style={{...BT,background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA'}}>Delete</button>}
            <button onClick={()=>{setModal(null);setEditId(null);}} style={{...BT,background:'#F3F4F6'}}>Cancel</button>
          </div>
        </Overlay>
      )}

      {modal==='conn' && connData && (
        <Overlay narrow>
          <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Edit Connection</div>
          <div style={{fontSize:12,color:'#6B7280',marginBottom:16}}>{nm(connData.fromId)} ↔ {nm(connData.toId)}</div>
          <label style={LS}>Connection Line</label>
          <select value={cForm.connType} onChange={e=>setCForm(f=>({...f,connType:e.target.value}))} style={IS}>
            {CONN_TYPES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <label style={LS}>Relationship Quality</label>
          <select value={cForm.relType} onChange={e=>setCForm(f=>({...f,relType:e.target.value}))} style={IS}>
            <option value="none">None</option>
            {REL_TYPES.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <div style={{display:'flex',gap:8,marginTop:4}}>
            <button onClick={saveConn} style={{...BT,flex:1,background:'#2563EB',color:'#fff'}}>Save</button>
            {connData.existing && <button onClick={delConn} style={{...BT,background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA'}}>Remove</button>}
            <button onClick={()=>{setModal(null);setConnData(null);}} style={{...BT,background:'#F3F4F6'}}>Cancel</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({children,narrow}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.22)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}>
      <div style={{background:'#fff',borderRadius:12,padding:24,width:narrow?330:370,boxShadow:'0 25px 60px rgba(0,0,0,0.15)'}}>
        {children}
      </div>
    </div>
  );
}
function Sec({label,children}) {
  return <div style={{marginBottom:16}}>
    <div style={{fontSize:10,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8}}>{label}</div>
    {children}
  </div>;
}
function FRow({checked,onChange,children}) {
  return <label style={{display:'flex',alignItems:'center',gap:6,marginBottom:5,cursor:'pointer'}}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{margin:0,flexShrink:0}}/>
    {children}
  </label>;
}
