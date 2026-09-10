import * as THREE from 'three';

// 正面形态依据北航官方照片；高度、进深分配与不可见屋面仍为展示估算。
export function createCulturalLandmark(name,rings){
 const music=name==='晨兴音乐厅';
 if(!music&&name!=='北京航空航天博物馆')return null;
 const pts=rings[0],xs=pts.map(p=>p[0]),zs=pts.map(p=>p[1]);
 const x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),w=x1-x0,d=z1-z0;
 const root=new THREE.Group();root.position.set((x0+x1)/2,1,(z0+z1)/2);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.8,...extra});
 const stone=mat('#d2c5aa'),trim=mat('#e6dac0'),roof=mat('#aaa697'),bronze=mat('#80634c',{metalness:.35}),glass=mat('#344a53',{roughness:.3,metalness:.2,emissive:'#849ca0',emissiveIntensity:0});
 function mesh(g,m){const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;root.add(o);return o;}
 function box(a,b,c,x,y,z,m=stone){const o=mesh(new THREE.BoxGeometry(a,b,c),m);o.position.set(x,y+b/2,z);return o;}
 function arch(x,y,z,width,total,m=glass){const r=width/2,stem=total-r,s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,stem);s.absarc(0,stem,r,0,Math.PI,false);s.lineTo(-r,0);const g=new THREE.ShapeGeometry(s,24);g.translate(x,y,z);mesh(g,m);
  const path=[];path.push(new THREE.Vector3(x-r,y,z+.1),new THREE.Vector3(x-r,y+stem,z+.1));for(let i=0;i<=24;i++){const a=Math.PI-i*Math.PI/24;path.push(new THREE.Vector3(x+r*Math.cos(a),y+stem+r*Math.sin(a),z+.1));}path.push(new THREE.Vector3(x+r,y,z+.1));
  for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],delta=b.clone().sub(a);if(delta.length()<.001)continue;const o=mesh(new THREE.CylinderGeometry(.16,.16,delta.length(),6),trim);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());}
  return {r,stem};
 }
 const front=d/2;
 let height,description,source;
 if(music){
  height=24;const cw=w*.48;
  box(w,17,d,0,0,0);box(w*.7,1,d*.7,0,17,-d*.12,roof);
  box(cw,21,8,0,0,front-4);
  // 南立面的三层中央构图：三拱门、三高拱窗、五小拱窗与三角山花。
  for(const x of [-cw*.19,0,cw*.19]){arch(x,1,front+.06,cw*.13,6);arch(x,9,front+.06,cw*.13,6.3);box(.10,4,.12,x,9,front+.22,bronze);for(const y of [10.8,12.8])box(cw*.12,.1,.12,x,y,front+.22,bronze);}
  for(let i=-2;i<=2;i++)arch(i*cw*.135,18,front+.06,cw*.085,2.7);
  for(const y of [7.7,16.5,21])box(cw+1,.38,8.5,0,y,front-3.85,trim);
  for(const x of [-cw*.46,-cw*.32,cw*.32,cw*.46]){box(.55,16.3,.45,x,.5,front+.25,trim);for(const y of [8,16.3])box(.95,.4,.65,x,y,front+.3,trim);}
  const ped=new THREE.Shape([new THREE.Vector2(-cw/2-.6,21.4),new THREE.Vector2(cw/2+.6,21.4),new THREE.Vector2(0,24)]);
  const pg=new THREE.ExtrudeGeometry(ped,{depth:8.5,bevelEnabled:false});pg.translate(0,0,front-8.1);mesh(pg,trim);
  // 两侧低翼、横向腰线及克制的开窗；不沿用整面办公窗格。
  for(const side of [-1,1])for(let i=0;i<3;i++){const x=side*(cw/2+3+i*4.1);if(Math.abs(x)>w/2-1.5)continue;for(const y of [2,10])box(1.6,3.4,.16,x,y,front+.1,glass);}
  for(const y of [1,8,16.7])box(w+.3,.35,d+.3,0,y,0,trim);
  for(let i=0;i<5;i++)box(cw*.8,.2*(i+1),.65,0,0,front+3.25-i*.65,trim);
  description='参考北航官方照片，重建南立面的三角山花、三拱入口、上下层拱窗及分层檐线。侧后部与屋顶暂保留简化体量。';
  source='地图定位＋官方照片参考；最高约 24 m、各层高度与进深为展示估算，未取得施工图';
 }else{
  height=24;
  box(w,22,d,0,0,0);box(w+.4,.6,d+.4,0,22,0,trim);box(w*.94,.35,d*.94,0,22.6,0,roof);
  // 正面入口有直接照片依据；展厅侧后立面缺少连续照片，保持素面。
  const ew=w*.29;box(ew+4,24,2.8,0,0,front-1.4);
  const {r,stem}=arch(0,.6,front+.06,ew,20);
  for(const x of [-r*.67,-r*.33,0,r*.33,r*.67])box(.16,stem,.24,x,.6,front+.2,bronze);
  for(const y of [4.2,7.3,10.4,13.5])box(ew,.18,.24,0,y,front+.22,bronze);
  for(let i=1;i<6;i++){const a=i*Math.PI/6;const a1=new THREE.Vector3(0,.6+stem,front+.22),b=new THREE.Vector3(Math.cos(a)*r,.6+stem+Math.sin(a)*r,front+.22),v=b.clone().sub(a1);const o=mesh(new THREE.CylinderGeometry(.10,.10,v.length(),5),bronze);o.position.copy(a1).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());}
  box(ew*.78,.85,1.4,0,4.3,front+.4,bronze);
  for(const y of [.5,5,22.8])box(w+.6,.3,1.1,0,y,front-.1,trim);
  for(const side of [-1,1]){box(.65,21,.55,side*(ew/2+2),.5,front+.18,trim);for(let i=0;i<3;i++)box(2,4,.16,side*(ew/2+6+i*4),8,front+.1,glass);}
  for(let i=0;i<5;i++)box(ew+5,.16*(i+1),.7,0,0,front+3.5-i*.7,trim);
  description='依据官方入口特写重建高拱玻璃门厅、放射状窗框与铜色门楣。展厅侧后部和屋面仍为基础体量。';
  source='地图轮廓＋官方入口照片；楼高约 24 m、门厅比例为估算，非整栋精细复原';
 }
 return {mesh:root,height,description,source,center:[root.position.x,root.position.z],landmark:true,glass,viewFromSouth:true};
}
