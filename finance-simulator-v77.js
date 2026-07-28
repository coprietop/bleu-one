(()=>{
  'use strict';
  const rates={2:51.63,3:34.79,4:26.38,5:21.33,6:17.96,7:15.56,8:13.76,9:12.36,10:11.24,11:10.33,12:9.56,13:8.92,14:8.37,15:7.89,16:7.47,17:7.11,18:6.78,19:6.49,20:6.22,21:5.99,22:5.77,23:5.58,24:5.40,25:5.18,26:5.03,27:5.00};
  const monthlyRate=.021;
  const el=id=>document.getElementById(id);
  const number=v=>Number(String(v??'').replace(/[^0-9]/g,''))||0;
  const cop=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  const nf=new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
  const money=v=>cop.format(Math.round(v)).replace('COP','').trim();
  const pct=v=>`${v.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})}%`;

  function bindMoney(id){const x=el(id);if(!x)return;x.addEventListener('input',()=>{const v=number(x.value);x.value=v?nf.format(v):'';calculate();});}
  function buildSchedule(principal,months,payment,extraMonth=0,extraAmount=0){
    let balance=principal,totalInterest=0,totalPaid=0,rows=[];
    const safety=months+60;
    for(let m=1;m<=safety && balance>.5;m++){
      const initial=balance;
      const interest=initial*monthlyRate;
      const normal=Math.min(payment,initial+interest);
      let capital=Math.max(0,normal-interest);
      balance=Math.max(0,initial-capital);
      let extra=0;
      if(m===extraMonth && extraAmount>0 && balance>0){extra=Math.min(extraAmount,balance);balance-=extra;capital+=extra;}
      totalInterest+=interest;totalPaid+=normal+extra;
      rows.push({month:m,initial,normal,interest,capital:normal-interest,extra,balance});
      if(m>=months && extraMonth===0 && balance>0 && m===months){
        // La tabla interna está diseñada para cerrar dentro del plazo; cualquier residuo por redondeo se liquida en la última cuota.
        const residual=balance;
        rows[rows.length-1].normal+=residual;
        rows[rows.length-1].capital+=residual;
        rows[rows.length-1].balance=0;
        totalPaid+=residual;balance=0;
      }
    }
    return {rows,totalInterest,totalPaid,duration:rows.length,lastPayment:rows.length?rows.at(-1).normal+rows.at(-1).extra:0};
  }
  function fillMonths(){
    const months=el('finMeses'); if(!months)return;
    for(let i=2;i<=27;i++){const o=document.createElement('option');o.value=i;o.textContent=`${i} meses`;if(i===27)o.selected=true;months.appendChild(o)}
    months.addEventListener('change',()=>{fillExtraMonths();calculate();});
    fillExtraMonths();
  }
  function fillExtraMonths(){
    const months=Number(el('finMeses')?.value||27), select=el('finMesExtra'); if(!select)return;
    const old=Number(select.value)||0; select.innerHTML='<option value="0">Sin abono adicional</option>';
    for(let i=1;i<=months;i++){const o=document.createElement('option');o.value=i;o.textContent=`Mes ${i}`;if(i===old)o.selected=true;select.appendChild(o)}
  }
  function renderRows(rows,extraMonth){
    const body=el('finTablaBody'); if(!body)return;
    body.innerHTML=rows.map(r=>`<tr class="${r.month===extraMonth?'extra-row':''}"><td>${r.month}</td><td>${money(r.initial)}</td><td>${money(r.normal)}</td><td>${money(r.interest)}</td><td>${money(r.capital)}</td><td>${r.extra?`<strong>+ ${money(r.extra)}</strong>`:'—'}</td><td>${money(r.balance)}</td></tr>`).join('');
  }
  function calculate(){
    if(!el('finCompra'))return;
    const purchase=number(el('finCompra').value),deposit=number(el('finDeposito').value),months=Number(el('finMeses').value||27);
    const principal=Math.max(0,purchase-deposit),factor=(rates[months]||0)/100,payment=principal*factor;
    const extraMonth=Number(el('finMesExtra').value||0),extraAmount=number(el('finExtra').value);
    const base=buildSchedule(principal,months,payment,0,0);
    const withExtra=(extraMonth&&extraAmount)?buildSchedule(principal,months,payment,extraMonth,extraAmount):base;
    const savedMonths=Math.max(0,base.duration-withExtra.duration),savedInterest=Math.max(0,base.totalInterest-withExtra.totalInterest);
    const totalBase=principal+base.totalInterest;
    const fixedRate=principal&&months?base.totalInterest/principal/months*100:0;
    el('finSaldo').textContent=money(principal);el('finCuota').textContent=money(payment);el('finInteresBase').textContent=money(base.totalInterest);el('finUltima').textContent=money(base.lastPayment);
    el('finMesesAhorro').textContent=`${savedMonths} ${savedMonths===1?'mes':'meses'}`;el('finAhorroInteres').textContent=money(savedInterest);el('finNuevaDuracion').textContent=`${withExtra.duration} ${withExtra.duration===1?'mes':'meses'}`;
    el('finTablaBadge').textContent=`${withExtra.duration} meses`;el('finTasaFija').textContent=`${pct(fixedRate)} fijo mensual`;
    el('finTotalMv').textContent=money(totalBase);el('finTotalFijo').textContent=money(totalBase);
    const capitalShare=totalBase?principal/totalBase*100:0,interestShare=100-capitalShare;
    el('finCapitalBar').style.width=`${capitalShare}%`;el('finInterestBar').style.width=`${interestShare}%`;el('finCapitalPct').textContent=`${capitalShare.toFixed(1)}%`;el('finInterestPct').textContent=`${interestShare.toFixed(1)}%`;
    el('finImpacto').classList.toggle('active',Boolean(extraMonth&&extraAmount));
    renderRows(withExtra.rows,extraMonth);
  }
  fillMonths();bindMoney('finCompra');bindMoney('finDeposito');bindMoney('finExtra');el('finMesExtra')?.addEventListener('change',calculate);calculate();
})();
