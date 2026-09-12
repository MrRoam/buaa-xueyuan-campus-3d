import {startXueyuan} from './app.js';
import {startCampus} from './new-campuses.js';
const q=new URLSearchParams(location.search),key=['shahe','hangzhou'].includes(q.get('campus'))?q.get('campus'):'xueyuan';
const nav=document.createElement('nav');nav.className='campus-switch';nav.setAttribute('aria-label','切换校区');
for(const [id,name]of [['xueyuan','学院路'],['shahe','沙河'],['hangzhou','杭州']]){const a=document.createElement('a'),u=new URL(location.href);u.search='';u.searchParams.set('campus',id);a.href=u.href;a.textContent=name;if(id===key)a.setAttribute('aria-current','page');nav.append(a);}
document.querySelector('.intro').prepend(nav);
if(key==='xueyuan')startXueyuan();else startCampus(key);
