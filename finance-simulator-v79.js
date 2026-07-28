(()=>{
  'use strict';
  const rates={2:51.63,3:34.79,4:26.38,5:21.33,6:17.96,7:15.56,8:13.76,9:12.36,10:11.24,11:10.33,12:9.56,13:8.92,14:8.37,15:7.89,16:7.47,17:7.11,18:6.78,19:6.49,20:6.22,21:5.99,22:5.77,23:5.58,24:5.40,25:5.18,26:5.03,27:5.00};
  const monthlyRate=.021;
  const el=id=>document.getElementById(id);
  const number=v=>Number(String(v??'').replace(/[^0-9]/g,''))||0;
  const cop=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  const nf=new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
  const money=v=>cop.format(Math.round(v||0)).replace('COP','').trim();
  const pct=v=>`${Number(v||0).toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})}%`;
  const monthsText=n=>`${n} ${n===1?'mes':'meses'}`;

  function bindMoney(id){const x=el(id);if(!x)return;x.addEventListener('input',()=>{const v=number(x.value);x.value=v?nf.format(v):'';calculate();});}

  function buildSchedule(principal,months,payment,extraMonth=0,extraAmount=0){
    if(principal<=0||payment<=0)return {rows:[],totalInterest:0,totalPaid:0,duration:0,lastPayment:0,totalNormal:0,totalExtra:0};
    let balance=principal,totalInterest=0,totalPaid=0,totalNormal=0,totalExtra=0,rows=[];
    const maxMonths=Math.max(months+72,120);
    for(let m=1;m<=maxMonths && balance>.5;m++){
      const initial=balance;
      const interest=initial*monthlyRate;
      let normal=Math.min(payment,initial+interest);
      let principalPart=Math.max(0,normal-interest);
      balance=Math.max(0,initial-principalPart);
      let extra=0;
      if(m===extraMonth&&extraAmount>0&&balance>0){extra=Math.min(extraAmount,balance);balance-=extra;}
      totalInterest+=interest;totalNormal+=normal;totalExtra+=extra;totalPaid+=normal+extra;
      rows.push({month:m,initial,normal,interest,capital:principalPart,extra,balance});
      if(!extraMonth && m===months && balance>0){
        const residual=balance;
        rows[rows.length-1].normal+=residual;
        rows[rows.length-1].capital+=residual;
        rows[rows.length-1].balance=0;
        totalNormal+=residual;totalPaid+=residual;balance=0;
      }
    }
    return {rows,totalInterest,totalPaid,duration:rows.length,lastPayment:rows.length?rows.at(-1).normal+rows.at(-1).extra:0,totalNormal,totalExtra};
  }

  function fillMonths(){
    const months=el('finMeses');if(!months)return;
    for(let i=2;i<=27;i++){const o=document.createElement('option');o.value=i;o.textContent=`${i} meses`;if(i===27)o.selected=true;months.appendChild(o)}
    months.addEventListener('change',()=>{fillExtraMonths();calculate();});fillExtraMonths();
  }
  function fillExtraMonths(){
    const months=Number(el('finMeses')?.value||27),select=el('finMesExtra');if(!select)return;
    const old=Number(select.value)||0;select.innerHTML='<option value="0">Sin abono adicional</option>';
    for(let i=1;i<=months;i++){const o=document.createElement('option');o.value=i;o.textContent=`Mes ${i}`;if(i===old)o.selected=true;select.appendChild(o)}
  }

  function renderRows(rows,extraMonth){
    const body=el('finTablaBody');if(!body)return;
    body.innerHTML=rows.map(r=>`<tr class="${r.month===extraMonth?'extra-row':''}"><td>${r.month}${r.month===extraMonth?'<small>ABONO</small>':''}</td><td>${money(r.initial)}</td><td>${money(r.normal)}</td><td>${money(r.interest)}</td><td>${money(r.capital)}</td><td>${r.extra?`<strong>+ ${money(r.extra)}</strong>`:'—'}</td><td>${money(r.balance)}</td></tr>`).join('');
  }

  function setupCanvas(canvas){
    if(!canvas)return null;const dpr=window.devicePixelRatio||1;const rect=canvas.getBoundingClientRect();
    canvas.width=Math.max(320,rect.width)*dpr;canvas.height=Number(canvas.getAttribute('height')||280)*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);return {ctx,w:canvas.width/dpr,h:canvas.height/dpr};
  }
  function drawChart(canvasId,series,opts={}){
    const c=setupCanvas(el(canvasId));if(!c)return;const {ctx,w,h}=c,p={l:54,r:18,t:24,b:42};
    ctx.clearRect(0,0,w,h);const all=series.flatMap(s=>s.data).filter(Number.isFinite),max=Math.max(1,...all)*1.08;
    ctx.font='11px system-ui';ctx.fillStyle='rgba(202,216,236,.7)';ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;
    for(let i=0;i<=4;i++){const y=p.t+(h-p.t-p.b)*i/4;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();const val=max*(1-i/4);ctx.fillText(compact(val),4,y+4)}
    const n=Math.max(1,...series.map(s=>s.data.length));
    const x=i=>p.l+(w-p.l-p.r)*(n<=1?0:i/(n-1));const y=v=>p.t+(h-p.t-p.b)*(1-v/max);
    const labels=[0,Math.floor((n-1)/2),n-1].filter((v,i,a)=>a.indexOf(v)===i);
    labels.forEach(i=>{ctx.fillStyle='rgba(202,216,236,.7)';ctx.fillText(`Mes ${i+1}`,Math.min(w-54,Math.max(p.l-10,x(i)-14)),h-14)});
    series.forEach((s,idx)=>{if(!s.data.length)return;ctx.beginPath();s.data.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle=s.color;ctx.lineWidth=2.5;ctx.stroke();if(s.fill){ctx.lineTo(x(s.data.length-1),h-p.b);ctx.lineTo(x(0),h-p.b);ctx.closePath();const g=ctx.createLinearGradient(0,p.t,0,h-p.b);g.addColorStop(0,s.fill);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fill()}});
    if(opts.marker&&opts.marker<=n){const mx=x(opts.marker-1);ctx.save();ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(240,207,115,.85)';ctx.beginPath();ctx.moveTo(mx,p.t);ctx.lineTo(mx,h-p.b);ctx.stroke();ctx.restore();ctx.fillStyle='#f0cf73';ctx.font='bold 10px system-ui';ctx.fillText('ABONO',Math.min(mx+6,w-56),p.t+12)}
  }
  function compact(v){if(v>=1e6)return `$${(v/1e6).toLocaleString('es-CO',{maximumFractionDigits:1})}M`;if(v>=1e3)return `$${Math.round(v/1e3)}k`;return `$${Math.round(v)}`}

  function updateCharts(base,current,extraMonth){
    drawChart('finChartCapital',[{data:current.rows.map(r=>r.capital),color:'#e6bd55',fill:'rgba(230,189,85,.2)'},{data:current.rows.map(r=>r.interest),color:'#6f9bd0',fill:'rgba(111,155,208,.12)'}],{marker:extraMonth});
    drawChart('finChartSaldo',[{data:[...(current.rows[0]?[current.rows[0].initial]:[]),...current.rows.map(r=>r.balance)],color:'#e6bd55',fill:'rgba(230,189,85,.18)'}],{marker:extraMonth?extraMonth+1:0});
    drawChart('finChartComparativo',[{data:[...(base.rows[0]?[base.rows[0].initial]:[]),...base.rows.map(r=>r.balance)],color:'#788aa4'},{data:[...(current.rows[0]?[current.rows[0].initial]:[]),...current.rows.map(r=>r.balance)],color:'#e6bd55',fill:'rgba(230,189,85,.12)'}],{marker:extraMonth?extraMonth+1:0});
  }

  function calculate(){
    if(!el('finCompra'))return;
    const purchase=number(el('finCompra').value),deposit=number(el('finDeposito').value),months=Number(el('finMeses').value||27);
    const principal=Math.max(0,purchase-deposit),payment=principal*((rates[months]||0)/100);
    const extraMonth=Number(el('finMesExtra').value||0),extraAmount=number(el('finExtra').value),hasExtra=Boolean(extraMonth&&extraAmount);
    const base=buildSchedule(principal,months,payment,0,0),current=hasExtra?buildSchedule(principal,months,payment,extraMonth,extraAmount):base;
    const savedMonths=Math.max(0,base.duration-current.duration),savedInterest=Math.max(0,base.totalInterest-current.totalInterest);
    const interestPct=principal?current.totalInterest/principal*100:0,totalCurrent=principal+current.totalInterest;
    const capitalShare=totalCurrent?principal/totalCurrent*100:0,interestShare=100-capitalShare;
    const fixedRate=principal&&current.duration?current.totalInterest/principal/current.duration*100:0;

    el('finSaldo').textContent=money(principal);el('finCuota').textContent=money(payment);el('finInteresBase').textContent=money(base.totalInterest);
    el('finInteresConExtra').textContent=money(current.totalInterest);el('finInteresActual').textContent=money(current.totalInterest);el('finInteresPctTotal').textContent=`${pct(interestPct)} del capital`;
    el('finInteresActualLabel').textContent=hasExtra?'Intereses con abono':'Intereses totales';el('finTotalPagado').textContent=money(totalCurrent);el('finUltima').textContent=money(current.lastPayment);
    el('finMesesAhorro').textContent=monthsText(savedMonths);el('finAhorroInteres').textContent=money(savedInterest);el('finNuevaDuracion').textContent=monthsText(current.duration);
    el('finImpacto').classList.toggle('active',hasExtra);el('finTablaBadge').textContent=monthsText(current.duration);
    el('finCapitalBar').style.width=`${capitalShare}%`;el('finInterestBar').style.width=`${interestShare}%`;el('finCapitalPct').textContent=`${capitalShare.toFixed(1)}%`;el('finInterestPct').textContent=`${interestShare.toFixed(1)}%`;

    const ref27Payment=principal*(rates[27]/100),ref27=buildSchedule(principal,27,ref27Payment,0,0),termSave=Math.max(0,ref27.totalInterest-base.totalInterest);
    if(principal){
      if(months<27){el('finTipPlazo').textContent=`Ahorras ${money(termSave)}`;el('finTipPlazoTexto').textContent=`Al elegir ${months} meses en lugar de 27, terminarías ${27-months} meses antes y pagarías aproximadamente ${money(termSave)} menos en intereses.`}
      else{el('finTipPlazo').textContent='Plazo máximo seleccionado';el('finTipPlazoTexto').textContent=`A 27 meses pagarías aproximadamente ${money(base.totalInterest)} en intereses. Elegir un plazo menor reduce el costo total.`}
      if(hasExtra){el('finTipExtra').textContent=`Ahorras ${money(savedInterest)}`;el('finTipExtraTexto').textContent=`El abono de ${money(extraAmount)} en el mes ${extraMonth} reduce el plazo en ${monthsText(savedMonths)} y los intereses de ${money(base.totalInterest)} a ${money(current.totalInterest)}.`}
      else{el('finTipExtra').textContent='Sin abono extraordinario';el('finTipExtraTexto').textContent='Agrega un abono para calcular automáticamente cuánto tiempo e intereses podrías ahorrar.'}
    } else {el('finTipPlazo').textContent='—';el('finTipExtra').textContent='—'}

    el('finTasaFija').textContent=`${pct(fixedRate)} fija`;
    ['finCmpCapitalMv','finCmpCapitalFijo'].forEach(id=>el(id).textContent=money(principal));
    ['finCmpPlazoMv','finCmpPlazoFijo'].forEach(id=>el(id).textContent=monthsText(current.duration));
    ['finCmpCuotaMv','finCmpCuotaFijo'].forEach(id=>el(id).textContent=money(payment));
    ['finCmpInteresMv','finCmpInteresFijo'].forEach(id=>el(id).textContent=money(current.totalInterest));
    ['finTotalMv','finTotalFijo'].forEach(id=>el(id).textContent=money(totalCurrent));

    renderRows(current.rows,extraMonth);
    el('finTablaCuotas').textContent=money(current.totalNormal);el('finTablaIntereses').textContent=money(current.totalInterest);el('finTablaCapital').textContent=money(principal-current.totalExtra);el('finTablaExtras').textContent=money(current.totalExtra);
    el('finChartNote').textContent=hasExtra?`Desde el mes ${extraMonth}, el saldo con abono disminuye más rápido. Ahorro estimado: ${money(savedInterest)} y ${monthsText(savedMonths)}.`:'Las dos proyecciones coinciden mientras no exista un abono extraordinario.';
    requestAnimationFrame(()=>updateCharts(base,current,hasExtra?extraMonth:0));
  }

  fillMonths();bindMoney('finCompra');bindMoney('finDeposito');bindMoney('finExtra');el('finMesExtra')?.addEventListener('change',calculate);window.addEventListener('resize',()=>{clearTimeout(window.__finResize);window.__finResize=setTimeout(calculate,120)});calculate();
})();
