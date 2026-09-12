import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// 模型尺寸以局部米为单位。确知尺寸写入数据；未公布的高度、格栅间距为照片比例估算。
export function buildDetail(f,api){
 const {mat,box,solid,curve,mesh}=api,p=f.properties,kind=p.model;
 if(!kind)return null;
 const theta=api.key==='shahe'?.31:0,co=Math.cos(theta),si=Math.sin(theta);
 const rr=f.rings[0].map(([x,z])=>[co*x-si*z,si*x+co*z]);
 const lo=[Math.min(...rr.map(v=>v[0])),Math.min(...rr.map(v=>v[1]))],hi=[Math.max(...rr.map(v=>v[0])),Math.max(...rr.map(v=>v[1]))];
 const c=[(lo[0]+hi[0])/2,(lo[1]+hi[1])/2],w=hi[0]-lo[0],d=hi[1]-lo[1];
 const group=new T.Group();group.rotation.y=theta;group.position.set(co*c[0]+si*c[1],1,-si*c[0]+co*c[1]);
 const stone=mat('#ddd7c5'),white=mat('#e9ece3'),glass=mat('#557a82',{metalness:.3,roughness:.34,emissive:'#efbc75',emissiveIntensity:0}),dark=mat('#647579'),grass=mat('#91aa73');
 const B=(x,y,z,a,b,c,m=stone)=>box(a,b,c,x,y,z,m,group);
 const rect=(x,z,a,b)=>[[x-a/2,z-b/2],[x+a/2,z-b/2],[x+a/2,z+b/2],[x-a/2,z+b/2],[x-a/2,z-b/2]];
 const sub=[];let roofGroup=null;
 function bands(x,z,a,b,h,levels=6,m=stone){B(x,0,z,a,h,b,m);for(let n=0;n<levels;n++){const y=2+n*(h/levels);for(const sign of [-1,1]){B(x,y,z+sign*(b/2+.06),a-1.2,1.8,.16,glass);B(x+sign*(a/2+.06),y,z,.16,1.8,b-1.2,glass);}}B(x,h,z,a+.6,.55,b+.6,white);}
 function fins(x,z,a,b,h,spacing=3){for(let v=-a/2+1;v<a/2;v+=spacing)B(x+v,0,z+b/2+.2,.35,h,.6,white);for(let v=-b/2+1;v<b/2;v+=spacing)B(x+a/2+.2,0,z+v,.6,h,.35,white);}
 function ringBuilding(a,b,h,t){bands(0,-(b-t)/2,a,t,h);bands(0,(b-t)/2,a,t,h);bands(-(a-t)/2,0,t,b-2*t,h);bands((a-t)/2,0,t,b-2*t,h);}
 function surface(fn,nu,nv,m,parent=group){const vs=[],ix=[];for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++)vs.push(...fn(i/nu,j/nv));for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const k=i*(nv+1)+j;ix.push(k,k+1,k+nv+1,k+1,k+nv+2,k+nv+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vs,3));g.setIndex(ix);g.computeVertexNormals();return mesh(g,m,parent);}
 function line(points,r=.22,m=white,parent=group){return curve(points,r,m,parent);}
 const h=+p.height||p.displayHeight||24;
 if(kind==='shahe-library'){
  const t=Math.min(w,d)*.21;
  // 底层柱廊留空，外圈楼体抬高，顶层保留中庭和下沉屋顶花园。
  for(const x of [-w/2+t/2,w/2-t/2])for(let z=-d/2+3;z<=d/2-3;z+=8)B(x,0,z,1.8,5,1.8);
  for(const z of [-d/2+t/2,d/2-t/2])for(let x=-w/2+3;x<=w/2-3;x+=8)B(x,0,z,1.8,5,1.8);
  const yy=group.children.length;ringBuilding(w,d,26,t);for(const o of group.children.slice(yy))o.position.y+=5;
  for(const x of [-w/2,w/2]){B(x,6,0,.35,23,d-12,glass);for(let z=-d/2+6;z<d/2-5;z+=3)B(x,6,z,1.15,24,.48,stone);}
  B(0,23,0,w-2*t,.5,d-2*t,grass);
  const dome=new T.Mesh(new T.SphereGeometry(12.6,40,18,0,Math.PI*2,0,Math.PI/2),glass);dome.scale.y=.23;dome.position.y=25;group.add(dome);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;line(Array.from({length:17},(_,j)=>{let t=j/16*Math.PI/2;return[12.6*Math.sin(t)*Math.cos(a),25+2.9*Math.cos(t),12.6*Math.sin(t)*Math.sin(a)]}),.1,white);}
  for(const z of [-d*.31,d*.31]){B(0,31,z,w*.48,.3,10,dark);for(let x=-w*.22;x<w*.23;x+=4)B(x,31.35,z,.1,.05,10,white);}
  for(let z=-d*.4;z<d*.41;z+=7)B(0,30.7,z,w-2*t,.45,.6,stone);
 }else if(kind==='flying-roof'){
  // 全长与跨度来自设计方。南北两端上扬，中部悬垂；中央下方是开放广场。
  const W=168,D=395,y=z=>24+18*Math.pow(2*z/D,2);
  B(0,0,0,W,1.5,D,stone);
  const specs=[['C1 会议中心／行政中心',-48,132,57,72,33],['C2 图书馆',48,142,57,69,34],['C3 教学一号楼',-49,65,58,30,23],['C4 教学二号楼',49,67,58,32,24],['C5 科教美育中心',0,0,48,47,11],['C6 教学三号楼／档案馆',-49,-63,58,29,23],['C7 教学四号楼／校史馆',49,-65,58,30,24],['C8 音乐厅',-48,-137,57,77,33],['C9 教学五号楼／医疗中心',48,-138,57,75,34]];
  for(const [name,x,z,a,b,h]of specs){const start=group.children.length;bands(x,z,a,b,h,Math.round(h/5));fins(x,z,a,b,h,3.5);if(name.startsWith('C5'))surface((u,v)=>[x+(u-.5)*a,11+12*(1-v),z+(v-.5)*b],1,1,white);sub.push({name,children:group.children.slice(start),local:[x,h/2,z],height:h});}
  roofGroup=new T.Group();group.add(roofGroup);const skin=mat('#e8e5d6',{side:T.DoubleSide,roughness:.65});
  for(const sign of [-1,1])surface((u,v)=>{const z=sign*(D*.17+v*D*.33);return[(u-.5)*W,y(z),z]},20,36,skin,roofGroup);
  // 透空格栅呈现中央通廊，避免整片封实遮住下方公共空间。
  for(let x=-W/2;x<W/2;x+=4.8){surface((u,v)=>{const z=(v-.5)*D;return[x+u*.95,y(z)+.15,z]},1,72,skin,roofGroup);}
  for(const x of [-W/2,W/2])line(Array.from({length:81},(_,i)=>{const z=(i/80-.5)*D;return[x,y(z),z]}),.7,white,roofGroup);
  for(const sign of [-1,1])for(const x of [-54,0,54])for(const z0 of [95,147]){const z=sign*z0;surface((u,v)=>{const zz=z+(v-.5)*28;return[x+(u-.5)*34,y(zz)+.18,zz]},1,8,glass,roofGroup);for(let dx=-16;dx<18;dx+=4)line(Array.from({length:12},(_,i)=>{let zz=z-14+i/11*28;return[x+dx,y(zz)+.25,zz]}),.10,white,roofGroup);}
  for(const z of [-D/2,D/2])for(let i=0;i<10;i++)B(0,.15*i,z+Math.sign(z)*(10-i),W*.75,.15*(i+1),1.7,stone);
 }else if(kind==='hangzhou-sport'){
  B(0,0,0,w*.83,17,d*.88,glass);
  // 曲面屋面与分层波纹裙边，南高北低的体量对应篮球、训练、泳馆。
  const skin=mat('#edf0e9',{side:T.DoubleSide,roughness:.63});
  const fheight=(x,z)=>20+4*Math.sin((z/d+.5)*Math.PI)+2*Math.cos(x/w*Math.PI);
  surface((u,v)=>{let x=(u-.5)*w*1.08,z=(v-.5)*d;return[x,fheight(x,z),z]},28,64,skin);
  for(const side of [-1,1])for(let n=0;n<7;n++){surface((u,v)=>{const z=(u-.5)*d,phase=Math.sin(z/d*5+n*.3),x=side*(w*.47+phase*1.4+v*.6);return[x,7+n*2+v*1.6+Math.cos(z/d*4)*1.4,z]},60,1,skin);}
  // 建成照片中的波纹从长边绕过圆角，延续至端部。
  const perimeter=(t)=>{const a=t*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);return[Math.sign(ca)*Math.pow(Math.abs(ca),.28)*w*.49,Math.sign(sa)*Math.pow(Math.abs(sa),.28)*d*.485];};
  for(let n=0;n<6;n++)surface((u,v)=>{const [x,z]=perimeter(u),wave=1.7*Math.sin(z/d*5+n*.32);return[x*(1+wave/w),7+n*2+v*1.2+wave*.55,z]},144,1,skin);
  for(const side of [-1,1])for(const k of [.25,.34,.42])line(Array.from({length:61},(_,i)=>{const z=(i/60-.5)*d,x=side*(w*k+Math.sin(z/d*5)*1.8);return[x,fheight(x,z)+.07,z]}),.17,dark);
  for(let x=-w*.45;x<w*.46;x+=5)B(x,0,0,.3,18,d*.92,dark);
  for(let i=0;i<12;i++)B(0,0,d/2+12-i,w*.9,(i+1)*.42,1.4,white);
  for(const z of [-d*.3,0,d*.3])B(0,17.1,z,w*.8,.2,.4,white);
  sub.push({name:'游泳馆 · 50米泳池所在北部',children:[],local:[0,8,-d*.3],height:17});
 }else if(kind==='courtyard'){
  const t=Math.min(w,d)*.21;ringBuilding(w,d,h,t);bands(0,0,w-t*2,t,h-3,5);
  for(const z of [-d*.24,d*.24])B(0,.1,z,w-2*t,.3,d*.28,grass);
  for(const sign of [-1,1])for(let i=0;i<8;i++)B(sign*(w/2+i),0,d*.2,t*1.2,(8-i)*.35,1.2,white);
 }else if(kind==='south-labs'){
  ringBuilding(w,d,h,Math.min(w,d)*.22);B(0,1,0,w*.35,1,d*.4,grass);
 }else if(kind==='dorm'){
  bands(0,0,w,d,h,Math.round(h/3.4));
  const tone=mat(/^D[89]|^D1[0-4]/.test(p.name)?'#b26d58':'#5287a0');
  for(const side of [-1,1]){B(side*(w/2-4),0,0,5,h,d+.2,white);B(0,1,side*(d/2+.18),w-13,h-3,.25,tone);for(let y=3;y<h-2;y+=3.4)B(0,y,side*(d/2+.4),w-14,1.5,.25,glass);}
  B(w*.3,h,0,5,2.3,d*.65,white);
 }else if(kind==='membrane'){
  for(let z=-d/2;z<d/2;z+=17){B(0,0,z,.5,10,.5,white);surface((u,v)=>[(u-.5)*Math.max(w,12),8+3*Math.pow(2*u-1,2)+2*Math.cos(v*Math.PI*2),z+v*17],8,12,white);}
 }else if(kind==='gate'){
  for(const x of [-w*.4,0,w*.4])B(x,0,0,2,8,d,stone);B(0,8,0,w,1.3,d+2,white);
 }else if(kind==='shahe-gym'){
  bands(0,0,w,d,17,3);B(w*.27,17,-d*.21,w*.35,7,d*.40,white);B(-w*.12,17,0,w*.65,.5,d*.9,white);
  for(let i=0;i<8;i++)B(0,0,d/2+i,w*.5,(8-i)*.35,1.2,white);
 }else if(kind==='shahe-main'||kind==='wind'){
  const rings=f.rings.map(r=>r.map(([x,z])=>[co*x-si*z-c[0],si*x+co*z-c[1]]));solid(rings,h,0,stone,group);
  for(const ring of rings)for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);for(let j=2;j<len-1;j+=3.6)for(let y=2;y<h-1;y+=3.8){const g=new T.Mesh(new T.BoxGeometry(2.1,2,.22),glass);g.rotation.y=-Math.atan2(dz,dx);g.position.set(a[0]+dx*j/len,y,a[1]+dz*j/len);group.add(g);}}
  const top=solid(rings,.6,h,white,group);top.receiveShadow=true;
 }else return null;
 // 合并不需要独立点选的细节，保留屋顶分组以供隐藏查看。
 const merge=parent=>{const batches=new Map();for(const ch of [...parent.children])if(ch.isMesh&&!sub.some(s=>s.children.includes(ch))){ch.updateMatrix();const g=ch.geometry.clone().applyMatrix4(ch.matrix);g.deleteAttribute('uv');const a=batches.get(ch.material)||[];a.push(g.index?g.toNonIndexed():g);batches.set(ch.material,a);parent.remove(ch);ch.geometry.dispose();}for(const [m,gg]of batches){const g=mergeGeometries(gg,false);if(!g)throw new Error('地标几何合并失败：'+kind);mesh(g,m,parent);gg.forEach(v=>v.dispose());}};
 merge(group);if(roofGroup)merge(roofGroup);
 return {mesh:group,height:h,glass,roofGroup,sub,center:[group.position.x,group.position.z]};
}
