// Bleu One v8.1.2 — Planificación, aprobación 85% y roles claros
(function(){
  const root=document.getElementById('planificacion');
  if(!root) return;
  const q=id=>document.getElementById(id);
  const RATE=3132.42;
  const TICKET=1200;
  const WEEKS=4;
  const NAMES_DIVISOR=200;
  const ROLE_RATE={emprendedor:.162,junior:.38,distribuidor:.47};
  const fmtNum=new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
  const fmtCop=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  const clean=v=>Number(String(v??'').replace(/[^0-9]/g,''))||0;
  const usd=v=>'US$ '+fmtNum.format(Math.round(v||0));
  const cop=v=>fmtCop.format(Math.round(v||0)).replace('COP','').trim();
  const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));
  function bindMoney(el,fn){
    if(!el) return;
    el.addEventListener('input',()=>{const val=clean(el.value); el.value=val?fmtNum.format(val):''; fn();});
  }
  function funnelFromNames(namesWeek){
    const namesMonth=Math.max(0,namesWeek)*WEEKS;
    const appointments=namesMonth*.30;
    const demos=appointments/2;
    const sales=demos/3;
    const approvedSales=sales*.85;
    const volume=approvedSales*TICKET;
    return {namesWeek,namesMonth,appointments,demos,sales,approvedSales,volume};
  }
  function scenarioFromGoal(goal){
    const namesWeek=goal>0?goal/NAMES_DIVISOR:0;
    return funnelFromNames(namesWeek);
  }
  function income(volume,role){return volume*(ROLE_RATE[role]||ROLE_RATE.emprendedor)}
  function setText(id,text){const el=q(id);if(el)el.textContent=text}
  function renderWeek(total){
    const box=q('planWeeklyGrid'); if(!box)return;
    const target=Math.max(0,Math.ceil(total)); const base=Math.floor(target/6), rem=target%6;
    const days=['Lun','Mar','Mié','Jue','Vie','Sáb'];
    box.innerHTML=days.map((d,i)=>`<div class="planning-day"><span>${d}</span><strong>${base+(i<rem?1:0)}</strong></div>`).join('');
  }
  function progressMessage(p){
    if(p>=100)return '🎉 Meta cumplida. Ahora demuestra cuánto más puedes crecer.';
    if(p>=81)return '⭐ Estás a pocas decisiones de lograrlo.';
    if(p>=51)return '🔥 Estás más cerca de lo que parece. No bajes el ritmo.';
    if(p>=21)return '🚀 Ya estás en movimiento. Protege tu actividad diaria.';
    return '🌱 La meta todavía se construye. Empieza por los nombres.';
  }
  function statusClass(p){return p>=90?'green':p>=65?'yellow':''}
  function statusLabel(p){return p>=100?'Meta lograda':p>=90?'Excelente':p>=65?'Buen ritmo':p>=35?'En marcha':'Por reforzar'}
  function radarCard(label,p){const val=clamp(p);return `<div class="radar-card ${statusClass(val)}"><div class="radar-head"><span>${label}</span><strong>${statusLabel(val)}</strong></div><div class="radar-track"><div class="radar-fill" style="width:${val}%"></div></div></div>`}
  function adminData(role,monthlyIncome){
    if(role==='emprendedor') return {
      reserve:monthlyIncome*.25, available:monthlyIncome*.75,
      intro:'En esta etapa, cada ingreso debe ayudarte a generar la siguiente demostración.',
      reserveLabel:'Reserva para actividad y demostraciones', availableLabel:'Disponible después de separar',
      advice:['Separa el dinero del negocio antes de gastar.','Prioriza transporte, ingredientes, muestras y seguimiento.','Construye una reserva para no detener tu actividad.','Evita aumentar gastos personales con un solo buen mes.']
    };
    if(role==='junior') return {
      reserve:monthlyIncome*.70, available:monthlyIncome*.30,
      intro:'Tu ingreso ya debe sostener actividad, telemercadeo y desarrollo de equipo.',
      reserveLabel:'Protección para operación y crecimiento', availableLabel:'Disponible personal sugerido',
      advice:['Protege capital para telemercadeo y desarrollo.','Separa una reserva para impuestos y obligaciones.','No gastes como Distribuidor antes de tener estructura estable.','Invierte en actividades que produzcan nombres y demostraciones.']
    };
    return {
      reserve:monthlyIncome*.65, available:monthlyIncome*.35,
      intro:'Administra como empresa: primero estructura, flujo de caja y desarrollo; después consumo personal.',
      reserveLabel:'Protección para empresa y expansión', availableLabel:'Disponible personal sugerido',
      advice:['Separa nómina, operación y dinero personal.','Protege flujo de caja para semanas de menor recaudo.','Invierte en líderes y sistemas duplicables.','Planea con visión anual, no solo con el resultado del mes.']
    };
  }
  const ROLE_LABEL={emprendedor:'Emprendedor',junior:'Distribuidor Junior',distribuidor:'Distribuidor'};
  let state={};
  function calculate(){
    const goal=clean(q('planMetaUsd')?.value);
    const sold=clean(q('planVendidoActual')?.value);
    const role=q('planRol')?.value||'emprendedor';
    const customNames=Math.max(0,clean(q('planNombresSemanaSim')?.value));
    const desiredIncomeCop=clean(q('planIngresoDeseadoCop')?.value);
    const incomeRole=q('planIngresoRol')?.value||role;
    const goalFunnel=scenarioFromGoal(goal);
    const custom=funnelFromNames(customNames);
    const recommended=funnelFromNames(goalFunnel.namesWeek*1.15);
    const goalIncomeUsd=income(goal,role);
    const goalIncomeCop=goalIncomeUsd*RATE;
    const customIncomeCop=income(custom.volume,role)*RATE;
    const requiredVolumeUsd=desiredIncomeCop>0?desiredIncomeCop/RATE/(ROLE_RATE[incomeRole]||ROLE_RATE.emprendedor):0;
    const requiredFunnel=scenarioFromGoal(requiredVolumeUsd);
    state={goal,sold,role,incomeRole,customNames,goalFunnel,custom,recommended,goalIncomeCop,customIncomeCop,desiredIncomeCop,requiredVolumeUsd,requiredFunnel};

    const pct=goal?clamp(sold/goal*100):0;
    setText('planMetaPct',pct>=100?'Meta cumplida':pct>=70?'Muy cerca':pct>=35?'En marcha':'En inicio');
    const bar=q('planMetaBar');if(bar)bar.style.width=pct+'%';
    setText('planMetaMessage',progressMessage(pct));
    setText('planNombresSemanaMeta',fmtNum.format(Math.ceil(goalFunnel.namesWeek)));
    setText('planNombresMesMeta',fmtNum.format(Math.ceil(goalFunnel.namesMonth)));
    setText('planNombresDiaMeta',fmtNum.format(Math.ceil(goalFunnel.namesWeek/6))+' por día de trabajo');
    setText('planCitasMeta',fmtNum.format(Math.ceil(goalFunnel.appointments)));
    setText('planDemosMeta',fmtNum.format(Math.ceil(goalFunnel.demos)));
    setText('planVentasMeta',fmtNum.format(Math.ceil(goalFunnel.sales)));
    setText('planAprobadasMeta',fmtNum.format(Math.ceil(goalFunnel.approvedSales)));
    setText('planVolumenMeta',usd(goalFunnel.volume));
    setText('planIngresoEmbudoOut',cop(income(goalFunnel.volume,role)*RATE));

    const remain=Math.max(0,goal-sold); const remainFunnel=scenarioFromGoal(remain);
    setText('planFaltanteUsd',usd(remain));
    setText('planVentasFaltantes',fmtNum.format(Math.ceil(remain/TICKET)));
    setText('planNombresFaltantes',fmtNum.format(Math.ceil(remainFunnel.namesWeek)));
    renderWeek(goalFunnel.namesWeek);

    setText('planScenarioBadge',fmtNum.format(customNames)+' nombres / semana');
    setText('planNombresSimMes',fmtNum.format(Math.ceil(custom.namesMonth)));
    setText('planCitasSim',fmtNum.format(Math.ceil(custom.appointments)));
    setText('planDemosSim',fmtNum.format(Math.ceil(custom.demos)));
    setText('planVentasSim',fmtNum.format(Math.ceil(custom.sales)));
    setText('planAprobadasSim',fmtNum.format(Math.ceil(custom.approvedSales)));
    setText('planVolumenSim',usd(custom.volume));
    setText('planIngresoSimCop',cop(customIncomeCop));

    renderComparison(goalFunnel,recommended,custom,role);
    const radar=q('planRadar');if(radar){radar.innerHTML=[
      radarCard('Nombres',goalFunnel.namesWeek?custom.namesWeek/goalFunnel.namesWeek*100:0),
      radarCard('Citas',goalFunnel.appointments?custom.appointments/goalFunnel.appointments*100:0),
      radarCard('Demos',goalFunnel.demos?custom.demos/goalFunnel.demos*100:0),
      radarCard('Meta',goal?custom.volume/goal*100:0)
    ].join('')}

    setText('planIngresoMetaUsd',usd(goal));
    setText('planIngresoMetaCop',cop(goalIncomeCop));
    setText('planIngresoAnualCop',cop(goalIncomeCop*12));
    setText('planIngresoDeseadoOut',cop(desiredIncomeCop));
    setText('planIngresoRoleNote','Proyección de VENTA PERSONAL para '+(ROLE_LABEL[incomeRole]||'Emprendedor')+'.');
    setText('planVolumenRequeridoOut',usd(requiredVolumeUsd));
    setText('planNombresIngresoOut',fmtNum.format(Math.ceil(requiredFunnel.namesWeek)));
    setText('planCitasIngresoOut',fmtNum.format(Math.ceil(requiredFunnel.appointments)));
    setText('planDemosIngresoOut',fmtNum.format(Math.ceil(requiredFunnel.demos)));
    setText('planVentasIngresoOut',fmtNum.format(Math.ceil(requiredFunnel.sales)));
    setText('planAprobadasIngresoOut',fmtNum.format(Math.ceil(requiredFunnel.approvedSales)));
    const adm=adminData(role,goalIncomeCop);
    setText('planAdminRoleLabel',ROLE_LABEL[role]||'Emprendedor');
    setText('planAdminAdviceTitle','Consejos para '+(ROLE_LABEL[role]||'Emprendedor'));
    setText('planAdminIntro',adm.intro);setText('planAdminReserve',cop(adm.reserve));setText('planAdminAvailable',cop(adm.available));
    setText('planAdminReserveLabel',adm.reserveLabel);setText('planAdminAvailableLabel',adm.availableLabel);
    const advice=q('planAdminAdvice');if(advice)advice.innerHTML=adm.advice.map(x=>`<div class="planning-advice-item">${x}</div>`).join('');
  }
  function renderComparison(minimum,recommended,custom,role){
    const rows=[
      ['Nombres por semana',Math.ceil(minimum.namesWeek),Math.ceil(recommended.namesWeek),Math.ceil(custom.namesWeek)],
      ['Citas al mes',Math.ceil(minimum.appointments),Math.ceil(recommended.appointments),Math.ceil(custom.appointments)],
      ['Demos al mes',Math.ceil(minimum.demos),Math.ceil(recommended.demos),Math.ceil(custom.demos)],
      ['Ventas generadas',Math.ceil(minimum.sales),Math.ceil(recommended.sales),Math.ceil(custom.sales)],
      ['Ventas aprobadas estimadas',Math.ceil(minimum.approvedSales),Math.ceil(recommended.approvedSales),Math.ceil(custom.approvedSales)],
      ['Volumen mensual',usd(minimum.volume),usd(recommended.volume),usd(custom.volume)],
      ['Ingreso aproximado',cop(income(minimum.volume,role)*RATE),cop(income(recommended.volume,role)*RATE),cop(income(custom.volume,role)*RATE)]
    ];
    const body=q('planComparisonBody');if(body)body.innerHTML=rows.map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="highlight">${r[3]}</td></tr>`).join('');
    const delta=income(custom.volume,role)*RATE-income(minimum.volume,role)*RATE;
    const tip=delta>=0?`Al aumentar tu actividad, tu ingreso proyectado podría crecer aproximadamente ${cop(delta)} frente al ritmo mínimo.`:`Con este ritmo quedarías aproximadamente ${cop(Math.abs(delta))} por debajo del ingreso proyectado para tu meta.`;
    setText('planComparisonTip',tip+' Recuerda: es una proyección de VENTA PERSONAL.');
  }

  function activatePlanningTab(tabName){
    document.querySelectorAll('.planning-tab').forEach(btn=>{
      const active=btn.dataset.planningTab===tabName;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
      btn.tabIndex=active?0:-1;
    });
    document.querySelectorAll('.planning-pane').forEach(pane=>{
      const active=pane.dataset.planningPane===tabName;
      pane.classList.toggle('active',active);
      pane.hidden=!active;
    });
    try{sessionStorage.setItem('bleuPlanningTab',tabName)}catch(e){}
  }
  document.querySelectorAll('.planning-tab').forEach(btn=>btn.addEventListener('click',()=>activatePlanningTab(btn.dataset.planningTab)));
  const savedTab=(()=>{try{return sessionStorage.getItem('bleuPlanningTab')}catch(e){return null}})();
  activatePlanningTab(['meta','embudo','ingreso','admin'].includes(savedTab)?savedTab:'meta');
  bindMoney(q('planMetaUsd'),calculate);bindMoney(q('planVendidoActual'),calculate);bindMoney(q('planIngresoDeseadoCop'),calculate);
  q('planRol')?.addEventListener('change',()=>{if(q('planIngresoRol'))q('planIngresoRol').value=q('planRol').value;calculate();});
  q('planIngresoRol')?.addEventListener('change',calculate);
  q('planNombresSemanaSim')?.addEventListener('input',calculate);
  const phrases=['Las metas no se alcanzan con motivación, sino con actividad organizada.','Tu agenda siempre revela tu próximo cheque.','No persigas ventas: construye nombres trabajados.','El ingreso nunca supera por mucho tiempo el nivel de actividad.','Una semana extraordinaria casi siempre fue preparada con nombres días antes.','La claridad convierte una meta grande en una acción de hoy.','Sin nombres no hay paraíso; con nombres trabajados hay futuro.','No midas únicamente ventas: mide las acciones que las producen.','La constancia semanal vence a la intensidad ocasional.','Tu próxima venta comienza mucho antes de tocar una puerta.','La planificación protege tu enfoque cuando la emoción cambia.','Lo que no se agenda, casi siempre se posterga.','Un gran mes se construye una semana a la vez.','El sistema no limita: protege la repetición correcta.','Cada nombre trabajado es una posibilidad que ayer no existía.'];
  let phrase=0;q('planAdnNext')?.addEventListener('click',()=>{phrase=(phrase+1)%phrases.length;setText('planAdnText',phrases[phrase]);});
  calculate();
})();
