// Loader timing: first visit = 3 seconds, next visits/pages = 1 second
const loader=document.querySelector('.loader');
window.addEventListener('load',()=>{
  const firstVisit=!localStorage.getItem('stacklyFashionVisited');
  const loaderTime=firstVisit?3000:1000;
  if(loader){
    loader.classList.add(firstVisit?'first-load':'return-load');
    const progress=loader.querySelector('.loader-line span');
    if(progress) progress.style.animationDuration=(loaderTime/1000)+'s';
    setTimeout(()=>{
      loader.classList.add('hide');
      setTimeout(()=>{loader.style.display='none';},700);
    },loaderTime);
  }
  localStorage.setItem('stacklyFashionVisited','true');
});
const glow=document.createElement('div');glow.className='cursor-glow';document.body.appendChild(glow);document.addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.14});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
const loginForm=document.querySelector('#loginForm');loginForm?.addEventListener('submit',e=>{e.preventDefault();const role=(document.querySelector('#role')?.value||'user').toLowerCase();const email=(document.querySelector('#loginEmail')?.value||document.querySelector('#loginForm input[type="email"]')?.value||'customer@stacklyfashion.com').trim();sessionStorage.setItem('stacklyRole',role);sessionStorage.setItem('stacklyEmail',email);const userName=(email.split('@')[0]||'customer').toUpperCase();alert('Login successful! Opening '+(role==='admin'?'Admin Fashion Dashboard':userName+' Fashion Dashboard'));location.href=role==='admin'?'admin-dashboard.html':'user-dashboard.html'});
const signupForm=document.querySelector('#signupForm');signupForm?.addEventListener('submit',e=>{e.preventDefault();const p=document.querySelector('#signupPassword')?.value;const c=document.querySelector('#confirmPassword')?.value;if(p!==c){alert('Password and Confirm Password must match');return;}alert('Signup completed successfully! Please login.');location.href='login.html'});
document.querySelectorAll('.dash-link').forEach(link=>{link.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('.dash-link').forEach(l=>l.classList.remove('active'));link.classList.add('active');const id=link.dataset.panel;document.querySelectorAll('.dash-card').forEach(p=>p.classList.remove('active'));const panel=document.querySelector('#panel-'+id);panel?.classList.add('active');const title=document.querySelector('#dashTitle'),desc=document.querySelector('#dashDesc');if(title)title.textContent=link.textContent.trim()==='Dashboard'?'Store Overview':link.textContent.trim();if(desc){const p=panel?.querySelector('p')?.textContent||'Manage your Stackly Fashion store details here.';desc.textContent=p;}});});
const firstPanel=document.querySelector('.dash-card');if(firstPanel)firstPanel.classList.add('active');
document.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{btn.textContent='Added ✓';setTimeout(()=>btn.textContent='Add Cart',1200)}));
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();


// Role based navigation and dashboard protection
(function(){
  const role = sessionStorage.getItem('stacklyRole');
  const page = location.pathname.split('/').pop() || 'index.html';

  function dashboardUrl(r){
    return r === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  }

  // Protect dashboards: admin can only see admin dashboard, user can only see user dashboard
  if(page === 'admin-dashboard.html' && role !== 'admin'){
    location.replace('login.html');
    return;
  }
  if(page === 'user-dashboard.html' && role !== 'user'){
    location.replace('login.html');
    return;
  }

  // Header button behavior:
  // Before login -> Login
  // After login on normal pages -> Dashboard
  // Dashboard pages -> Logout
  document.querySelectorAll('.login-btn').forEach(btn=>{
    if(page === 'admin-dashboard.html' || page === 'user-dashboard.html'){
      btn.textContent = 'Logout';
      btn.href = 'index.html';
      btn.addEventListener('click', function(e){
        e.preventDefault();
        sessionStorage.removeItem('stacklyRole');
        location.href = 'index.html';
      });
    }else if(role){
      btn.textContent = 'Dashboard';
      btn.href = dashboardUrl(role);
      btn.classList.add('dashboard-visible');
    }else{
      btn.textContent = 'Login';
      btn.href = 'login.html';
      btn.classList.remove('dashboard-visible');
    }
  });

  // Sidebar logout clears login session
  document.querySelectorAll('aside.side a').forEach(a=>{
    if(a.textContent.trim().toLowerCase()==='logout'){
      a.addEventListener('click', function(e){
        e.preventDefault();
        sessionStorage.removeItem('stacklyRole');
        location.href='index.html';
      });
    }
  });
})();


// Refresh current page when user clicks Stackly logo/company name
(function(){
  document.querySelectorAll('.refresh-brand').forEach(el=>{
    el.style.cursor='pointer';
    el.addEventListener('click',function(e){
      e.preventDefault();
      location.reload();
    });
  });
})();

// Dynamic user dashboard title from login email before @
(function(){
  const heading=document.querySelector('#userDashHeading');
  if(!heading) return;
  const email=sessionStorage.getItem('stacklyEmail') || 'customer@stacklyfashion.com';
  const name=(email.split('@')[0] || 'customer').replace(/[^a-zA-Z0-9]/g,' ').trim().toUpperCase();
  heading.textContent = name + ' Fashion Dashboard';
})();


// Final fixes: active page highlight, full-screen mobile menu, dashboard mobile menu
(function(){
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.links a[href]').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('#')[0].toLowerCase();
    if(href && href===current){
      a.classList.add('active-page');
      a.setAttribute('aria-current','page');
    }
  });

  const hamb = document.querySelector('.hamb');
  const navLinks = document.querySelector('.links');
  if(hamb && navLinks){
    hamb.setAttribute('aria-label','Open fashion menu');
    hamb.setAttribute('aria-expanded','false');
    hamb.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      const open = navLinks.classList.toggle('open');
      document.body.classList.toggle('no-scroll',open);
      hamb.setAttribute('aria-expanded',String(open));
      hamb.textContent = open ? '×' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      navLinks.classList.remove('open');
      document.body.classList.remove('no-scroll');
      hamb.setAttribute('aria-expanded','false');
      hamb.textContent='☰';
    }));
  }

  if(document.body.classList.contains('dashboard-page')){
    const btn=document.createElement('button');
    btn.className='dash-menu-btn';
    btn.type='button';
    btn.setAttribute('aria-label','Open dashboard menu');
    btn.setAttribute('aria-expanded','false');
    btn.textContent='☰';
    document.body.appendChild(btn);
    const closeDash=()=>{
      document.body.classList.remove('dash-menu-open','no-scroll');
      btn.textContent='☰';
      btn.setAttribute('aria-expanded','false');
    };
    btn.addEventListener('click',()=>{
      const open=document.body.classList.toggle('dash-menu-open');
      document.body.classList.toggle('no-scroll',open);
      btn.textContent=open?'×':'☰';
      btn.setAttribute('aria-expanded',String(open));
    });
    document.querySelectorAll('.side a').forEach(a=>a.addEventListener('click',()=>{
      if(window.innerWidth<=900) closeDash();
    }));
    document.addEventListener('click',(e)=>{
      if(document.body.classList.contains('dash-menu-open') && !e.target.closest('.side') && !e.target.closest('.dash-menu-btn')) closeDash();
    });
  }
})();


// Premium page interactions: slider, counters, modal and tilt cards
(function(){
  const reviews=[...document.querySelectorAll('.review-slider article')];
  if(reviews.length){let i=0;setInterval(()=>{reviews[i].classList.remove('active');i=(i+1)%reviews.length;reviews[i].classList.add('active');},3600);}

  const countEls=[...document.querySelectorAll('[data-count]')];
  if(countEls.length){
    const counterObs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done='true';
      const end=parseInt(entry.target.dataset.count,10);let cur=0;const step=Math.max(1,Math.ceil(end/48));
      const timer=setInterval(()=>{cur+=step;if(cur>=end){cur=end;clearInterval(timer);}entry.target.textContent=cur+(end===25?'K+':end===850?'+':end===40?'+':'');},28);
    }),{threshold:.4});
    countEls.forEach(el=>counterObs.observe(el));
  }

  const modal=document.querySelector('.fashion-modal');
  if(modal){
    const title=modal.querySelector('h2'),copy=modal.querySelector('p');
    document.querySelectorAll('.open-fashion-modal').forEach(btn=>btn.addEventListener('click',()=>{
      title.textContent=btn.dataset.title||'Stackly Fashion';copy.textContent=btn.dataset.copy||'Premium fashion story.';modal.classList.add('open');modal.setAttribute('aria-hidden','false');
    }));
    modal.querySelector('.close-fashion-modal')?.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');});
    modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}});
  }

  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*8;
      const y=((e.clientY-r.top)/r.height-.5)*-8;
      card.style.transform=`perspective(900px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
})();
