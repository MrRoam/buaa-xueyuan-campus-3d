// 标签避让真实界面范围，避免继续为旧侧栏预留大片空白。
export function getInterfaceBounds(){
 return [...document.querySelectorAll('header,.intro,#selection,.toolbar,.map-controls,footer,[popover]:popover-open')]
  .filter(el=>!el.hidden).map(el=>el.getBoundingClientRect());
}
export function labelOverlapsInterface(x,y,el,bounds){
 const half=el.offsetWidth/2+8,height=el.offsetHeight+8;
 return bounds.some(r=>x+half>r.left&&x-half<r.right&&y>r.top&&y-height<r.bottom);
}
export function onInterfaceChange(callback){
 document.querySelectorAll('#selection,[popover]').forEach(el=>el.addEventListener('toggle',callback));
}
