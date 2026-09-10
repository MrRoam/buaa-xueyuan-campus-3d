import * as THREE from 'three';

// 地图约束平面范围；曲率、幕墙分缝和平台尺寸由照片解释重建，非测绘数据。
export function createLandmark(name,rings){
 if(!['体育馆','游泳馆'].includes(name))return null;
 const root=new THREE.Group(), points=rings[0];
 const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minZ=Math.min(...points.map(p=>p[1])),maxZ=Math.max(...points.map(p=>p[1]));
 root.position.set((minX+maxX)/2,1,(minZ+maxZ)/2);root.rotation.y=.04;
 const w=maxX-minX,d=maxZ-minZ;
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.65,...extra});
 const metal=material('#b7bfc0',{metalness:.45}),stone=material('#b6ae99'),glass=material('#294b5e',{metalness:.3,roughness:.25,emissive:'#58859c',emissiveIntensity:0}),frame=material('#8d9697'),dark=material('#667174');
 const mesh=(g,m,parent=root)=>{const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const box=(a,b,c,x,y,z,m=stone,parent=root)=>{const o=mesh(new THREE.BoxGeometry(a,b,c),m,parent);o.position.set(x,y+b/2,z);return o;};
 function line(points,m=frame,parent=root,r=.065){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,Math.max(1,points.length*2),r,4,false),m,parent);}
 function rail(x1,x2,z,y,parent=root){for(let x=x1;x<=x2;x+=3)box(.12,1.1,.12,x,y,z,frame,parent);for(const h of [.35,.7,1.1])line([[x1,y+h,z],[x2,y+h,z]],frame,parent);}
 let height,description,source;
 if(name==='体育馆'){
  height=19.5;
  box(w*.76,3,d*.77,0,0,0);box(w*.96,.5,d*.86,0,3,0);
  box(w*.53,13,d*.74,0,3,0,glass);box(w*.86,12,d*.40,0,3,0,glass);
  // 四翼沿地图十字轮廓展开。剖面分出卷边、窗带和内收下壳。
  function wing(width,length,angle){const group=new THREE.Group();group.rotation.y=angle;root.add(group);
   const profile=[[0,17.7],[length*.83,19.5],[length*.98,19.5],[length*1.005,19.1],[length*1.015,18.2],[length*.998,17.2],[length*.965,16.1],[length*.935,15],[length*.78,6],[0,6]];
   const shape=new THREE.Shape(profile.map(([r,y])=>new THREE.Vector2(-r,y)));
   const g=new THREE.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,steps:1});g.rotateY(-Math.PI/2);g.translate(width/2,0,0);mesh(g,metal,group);
   // 窗带贴合下斜壳面；细竖肋与金属板分缝保留照片里的水平比例。
   const r1=length*.984,r2=length*.951,y1=16.8,y2=15.5;
   const vertices=[-width*.46,y1,-r1,width*.46,y1,-r1,width*.46,y2,-r2,-width*.46,y2,-r2];
   const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));gg.setIndex([0,2,1,0,3,2]);gg.computeVertexNormals();const window=mesh(gg,glass,group);window.material.side=THREE.DoubleSide;
   for(let x=-width/2+1;x<width/2;x+=5.2){line([[x,19.55,-length*.83],[x,19.55,-length*.98],[x,18.2,-length*1.02],[x,15,-length*.94],[x,6,-length*.785]],frame,group,.055);}
   for(const t of [.25,.5,.75]){const r=length*(.78+.155*t),y=6+9*t;line([[-width/2,y,-r-.08],[width/2,y,-r-.08]],frame,group,.035);}
   // 底层玻璃门及侧翼的三角玻璃。
   for(let x=-width*.44;x<=width*.44;x+=2.7)box(.12,3,.18,x,3,-length*.78-.15,frame,group);
   for(const side of [-1,1]){const s=new THREE.Shape([new THREE.Vector2(-length*.78,7.5),new THREE.Vector2(-length*.93,15),new THREE.Vector2(-length*.35,15.7)]);const geo=new THREE.ShapeGeometry(s);geo.rotateY(-Math.PI/2);geo.translate(side*(width/2+.08),0,0);mesh(geo,glass,group);}
  }
  wing(w*.56,d*.5,0);wing(w*.56,d*.5,Math.PI);wing(d*.44,w*.5,Math.PI/2);wing(d*.44,w*.5,-Math.PI/2);
  for(let i=0;i<15;i++)box(w*.82,.2*(i+1),.72,0,0,-d*.43-10.8+i*.72);
  for(const x of [-w*.42,0,w*.42])line([[x,.8,-d*.43-10.8],[x,3.8,-d*.43]],frame,root,.08);
  rail(-w*.47,-w*.3,-d*.43,3.5);rail(w*.3,w*.47,-d*.43,3.5);
  description='依据场馆照片重建四翼外挑壳体、狭长高窗、玻璃底层与入口台阶；屋顶曲率及细节仍为近似。';
  source='主馆檐高 19.5 m：2001 年报道；平面来自 OSM，壳体与平台按照片估算';
 }else{
  height=13;
  box(w*.97,3,d*.98,0,0,0);box(w*.99,.35,d*1.02,0,3,0);
  // 西侧高弧、东侧低檐；沿南北长轴延伸的非对称机翼剖面。
  const curve=new THREE.CubicBezierCurve(new THREE.Vector2(-w*.5,8),new THREE.Vector2(-w*.52,19),new THREE.Vector2(-w*.18,12),new THREE.Vector2(w*.5,4.4));
  const top=curve.getPoints(48),verts=[],indices=[];
  top.forEach(p=>verts.push(p.x,p.y,-d/2,p.x,p.y,d/2));for(let i=0;i<top.length-1;i++){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();metal.side=THREE.DoubleSide;mesh(geo,metal);
  const shape=new THREE.Shape([new THREE.Vector2(-w*.5,3.3),...top,new THREE.Vector2(w*.5,3.3)]);
  for(const z of [-d/2,d/2]){const g=new THREE.ShapeGeometry(shape);g.translate(0,0,z);glass.side=THREE.DoubleSide;mesh(g,glass);
   line(top.map(p=>[p.x,p.y,z]),metal,root,.22);
   for(let i=1;i<top.length-1;i+=3){const p=top[i];box(.12,p.y-3.3,.16,p.x,3.3,z,frame);}
   for(const y of [5.5,8]){const active=top.filter(p=>p.y>=y);line([[active[0].x,y,z-.08],[active.at(-1).x,y,z-.08]],frame);}
  }
  box(.3,4,d,-w*.5,3,0,metal);box(.3,1.1,d,w*.5,3,0,metal);
  for(let z=-d/2;z<=d/2;z+=4)line(top.map(p=>[p.x,p.y+.035,z]),frame,root,.035);
  box(w,.35,4,0,3.05,-d/2-2);rail(-w*.48,w*.48,-d/2-4,3.4);
  for(let i=0;i<15;i++)box(7,.22*(i+1),.65,w*.25,0,-d/2-13.5+i*.65);
  description='依据外景及室内照片重建西高东低的机翼状曲顶、玻璃端面和入口平台；不再使用办公楼式窗格。';
  source='OSM 平面定位；高度约 13 m、曲率与入口尺寸均为照片估算，待图纸校核';
 }
 return {mesh:root,height,description,source,center:[root.position.x,root.position.z],landmark:true,glass};
}

