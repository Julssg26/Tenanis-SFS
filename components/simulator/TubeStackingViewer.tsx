// components/simulator/TubeStackingViewer.tsx
// Only the 3D canvas area — used inside TubeStackingPanel's right column
'use client'

import { useEffect, useRef } from 'react'

declare global { interface Window { THREE: Record<string, unknown> } }

const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'

function loadThree(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.THREE) { resolve(); return }
    if (document.querySelector('script[data-threejs]')) {
      const wait = () => window.THREE ? resolve() : setTimeout(wait, 50)
      return wait()
    }
    const s = document.createElement('script')
    s.src = THREE_CDN; s.setAttribute('data-threejs','1')
    s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function TubeStackingViewer() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false, animId = 0
    let roCleanup: (() => void) | null = null
    let evCleanup: (() => void) | null = null
    let renderer: { setSize:(w:number,h:number)=>void; render:(s:unknown,c:unknown)=>void; dispose:()=>void; domElement:HTMLCanvasElement } | null = null

    loadThree().then(() => {
      if (cancelled || !wrapRef.current) return
      const THREE = window.THREE as typeof import('three')
      const wrap  = wrapRef.current
      const W = wrap.offsetWidth || 600
      const H = wrap.offsetHeight || 550

      const cv = document.createElement('canvas')
      cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;'
      wrap.prepend(cv)

      const rnd = new THREE.WebGLRenderer({ canvas: cv, antialias: true })
      rnd.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rnd.setSize(W, H)
      rnd.shadowMap.enabled = true
      rnd.toneMapping = THREE.ACESFilmicToneMapping
      rnd.toneMappingExposure = 1.0
      renderer = rnd as typeof renderer

      const scene  = new THREE.Scene()
      scene.background = new THREE.Color(0x7a8fa0)
      scene.fog = new THREE.FogExp2(0x8899aa, 0.018)
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200)
      camera.position.set(12, 5, 18); camera.lookAt(0, 1.5, 0)

      scene.add(new THREE.AmbientLight(0xc8d4e0, 1.4))
      const sun = new THREE.DirectionalLight(0xfffaf0, 2.2)
      sun.position.set(-10,25,12); sun.castShadow=true
      sun.shadow.mapSize.width=sun.shadow.mapSize.height=2048
      sun.shadow.camera.left=-25; sun.shadow.camera.right=25
      sun.shadow.camera.top=15;   sun.shadow.camera.bottom=-10; sun.shadow.camera.far=80
      scene.add(sun)
      const fill = new THREE.DirectionalLight(0xd0e0f0, 0.7); fill.position.set(10,8,-10); scene.add(fill)

      const gnd = new THREE.Mesh(new THREE.PlaneGeometry(100,50), new THREE.MeshLambertMaterial({color:0x3a3a3a}))
      gnd.rotation.x=-Math.PI/2; gnd.position.y=-1.1; gnd.receiveShadow=true; scene.add(gnd)
      for(let i=-8;i<=8;i+=4){const rl=new THREE.Mesh(new THREE.PlaneGeometry(0.25,3),new THREE.MeshLambertMaterial({color:0xffffff}));rl.rotation.x=-Math.PI/2;rl.position.set(i,-1.09,8);scene.add(rl)}

      const root = new THREE.Group(); scene.add(root)
      const mT=new THREE.MeshStandardMaterial({color:0xb08a10,metalness:0.4,roughness:0.9})
      const mD=new THREE.MeshStandardMaterial({color:0x6a5208,metalness:0.35,roughness:0.95})
      const mS=new THREE.MeshStandardMaterial({color:0x4a4020,metalness:0.55,roughness:0.88})
      const mSR=new THREE.MeshStandardMaterial({color:0x302810,metalness:0.5,roughness:0.92})
      const mTi=new THREE.MeshStandardMaterial({color:0x111111,metalness:0.05,roughness:0.95})
      const mRi=new THREE.MeshStandardMaterial({color:0x505050,metalness:0.82,roughness:0.3})
      const mCb=new THREE.MeshStandardMaterial({color:0xd0c8b8,metalness:0.15,roughness:0.65})
      const mGl=new THREE.MeshStandardMaterial({color:0x334455,transparent:true,opacity:0.65,roughness:0.1,metalness:0.1})
      const mPE=new THREE.MeshStandardMaterial({color:0x2d6e3a,emissive:0x0a200e,emissiveIntensity:0.25,metalness:0.2,roughness:0.7})

      function bx(mat:THREE.Material,w:number,h:number,d:number,x:number,y:number,z:number){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);return m}
      function cy(mat:THREE.Material,rt:number,rb:number,h:number,seg:number,x:number,y:number,z:number,rx=0,_ry=0,rz=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);m.position.set(x,y,z);m.rotation.x=rx;m.rotation.z=rz;m.castShadow=true;m.receiveShadow=true;root.add(m);return m}

      bx(mT,14,0.22,2.8,0,0,0)
      for(let i=0;i<22;i++)bx(mD,0.52,0.07,2.74,-6.5+i*0.6,0.14,0);
      [-1.38,1.38].forEach(z=>bx(mT,14,0.1,0.1,0,0.16,z));[-0.9,0.9].forEach(z=>bx(mD,14,0.16,0.22,0,-0.1,z))
      for(let cx=-5;cx<=5;cx+=2.5)bx(mD,0.14,0.18,2.8,cx,-0.08,0);
      [-5.5,-2.5,0.3,3.0,5.5].forEach(x=>{[-1.38,1.38].forEach(z=>{const s=z<0?-1:1;bx(mS,0.12,2.05,0.30,x,1.12,z);bx(mSR,0.20,0.15,0.46,x,0.14,z);bx(mSR,0.05,1.85,0.07,x,1.05,z+s*0.17);bx(mSR,0.16,0.16,0.36,x,2.22,z)});bx(mD,0.06,0.06,2.76,x,2.32,0)})

      function wheel(x:number,z:number){cy(mTi,0.47,0.47,0.30,24,x,-0.48,z,0,0,Math.PI/2);cy(mRi,0.29,0.29,0.32,16,x,-0.48,z,0,0,Math.PI/2);cy(new THREE.MeshStandardMaterial({color:0x888888,metalness:0.9,roughness:0.2}),0.08,0.08,0.36,8,x,-0.48,z,0,0,Math.PI/2)}
      ;[-4.3,-2.9].forEach(x=>{wheel(x,-1.62);wheel(x,1.62);wheel(x,-1.96);wheel(x,1.96);cy(mRi,0.07,0.07,4.2,10,x,-0.48,0,Math.PI/2,0,Math.PI/2)});
      [-0.5,0.5].forEach(z=>bx(mD,0.14,1.8,0.14,5.5,-0.9,z));bx(mD,0.5,0.1,0.7,5.5,-1.78,0);
      [-1.1,1.1].forEach(z=>bx(mD,0.06,0.6,0.8,-4.8,-0.7,z))
      bx(mCb,2.2,2.4,2.6,8.2,1.2,0);bx(new THREE.MeshStandardMaterial({color:0xc0b8a8,metalness:0.15,roughness:0.65}),2.0,0.3,2.4,8.2,2.52,0)
      bx(mGl,0.08,1.05,2.1,7.18,1.72,0);bx(mGl,0.85,0.7,0.07,8.0,1.82,-1.32)
      bx(new THREE.MeshStandardMaterial({color:0x2a2a2a,metalness:0.3,roughness:0.55}),0.1,1.65,2.42,9.28,0.8,0)
      bx(new THREE.MeshStandardMaterial({color:0x888888,metalness:0.7,roughness:0.4}),0.16,0.3,2.62,9.32,0.02,0);
      [-0.92,0.92].forEach(z=>{const hl=new THREE.Mesh(new THREE.CircleGeometry(0.17,12),new THREE.MeshStandardMaterial({color:0xffffcc,emissive:0xffffaa,emissiveIntensity:0.6}));hl.rotation.y=-Math.PI/2;hl.position.set(9.36,0.56,z);root.add(hl)})
      cy(new THREE.MeshStandardMaterial({color:0x2a2a2a,metalness:0.8,roughness:0.4}),0.06,0.06,1.9,8,7.8,3.06,-1.0)
      cy(new THREE.MeshStandardMaterial({color:0x606060,metalness:0.9,roughness:0.3}),0.7,0.7,0.1,20,6.8,0.14,0)
      wheel(9.0,-1.42);wheel(9.0,1.42);cy(mRi,0.06,0.06,3.0,10,9.0,-0.48,0,Math.PI/2,0,Math.PI/2)

      const lvlGroups=[new THREE.Group(),new THREE.Group(),new THREE.Group(),new THREE.Group()]
      lvlGroups.forEach(g=>root.add(g))
      const PR=0.36,PR2=PR*2,PL=13.0
      const levelDefs=[[-PR*.5,PR*.5],[-PR*1.5,-PR*.5,PR*.5,PR*1.5],[-PR2,-PR*.8,0,PR*.8,PR2],[-PR2*2,-PR2,-PR*.4,PR*.4,PR2,PR2*2]]
      const yB=0.22; const yLvl=[yB+PR+PR2*.87*3,yB+PR+PR2*.87*2,yB+PR+PR2*.87,yB+PR]
      const perMats=levelDefs.map(()=>new THREE.MeshStandardMaterial({color:0x1a1a1a,metalness:0.08,roughness:0.9,transparent:true,opacity:1}))
      const pGeo=new THREE.CylinderGeometry(PR,PR,PL,28),cGeo=new THREE.CircleGeometry(PR,28),rGeo=new THREE.TorusGeometry(PR*.87,PR*.065,8,28)
      levelDefs.forEach((zArr,li)=>{const g=lvlGroups[li];zArr.forEach(z=>{const t=new THREE.Mesh(pGeo,perMats[li]);t.rotation.z=Math.PI/2;t.position.set(-0.5,yLvl[li],z);t.castShadow=true;t.receiveShadow=true;g.add(t);const cl=new THREE.Mesh(cGeo,perMats[li]);cl.rotation.y=Math.PI;cl.position.set(-0.5-PL/2,yLvl[li],z);g.add(cl);const cr=new THREE.Mesh(cGeo,mPE);cr.position.set(-0.5+PL/2,yLvl[li],z);g.add(cr);const rr=new THREE.Mesh(rGeo,mPE);rr.position.set(-0.5+PL/2,yLvl[li],z);g.add(rr)})})

      // Level buttons
      const lb=wrap.querySelector<HTMLDivElement>('.ts-lvlbtns')!
      const btnDefs=[{id:'all',label:'ALL LEVELS',c:'#f0c030'},{id:0,label:'LEVEL 1 · TOP',c:'#22dd66'},{id:1,label:'LEVEL 2',c:'#22aaff'},{id:2,label:'LEVEL 3',c:'#1166cc'},{id:3,label:'LEVEL 4 · BASE',c:'#4466bb'}] as const
      const btns:HTMLButtonElement[]=[]
      btnDefs.forEach(lv=>{const b=document.createElement('button');b.textContent=lv.label;b.style.cssText='background:rgba(0,0,0,0.75);border:1px solid rgba(100,100,0,0.3);color:#888;font-family:monospace;font-size:9px;padding:5px 10px;cursor:pointer;letter-spacing:1px;display:block;text-align:left;';b.onclick=()=>{btns.forEach(x=>{x.style.borderColor='rgba(100,100,0,0.3)';x.style.color='#888';x.style.background='rgba(0,0,0,0.75)'});b.style.borderColor=lv.c;b.style.color=lv.c;b.style.background='rgba(20,16,0,0.85)';perMats.forEach((mat,i)=>{if(lv.id==='all'){mat.opacity=1;mat.transparent=false}else if(i===lv.id){mat.opacity=1;mat.transparent=false}else{mat.opacity=0.05;mat.transparent=true}})};btns.push(b);lb.appendChild(b)})
      btns[0]?.click()

      // Orbit controls
      let drag=false,rgt=false,ox=0,oy=0
      const sph={th:0.45,ph:1.08,r:22},tgt={x:0,y:1.5,z:0}
      function updCam(){camera.position.set(tgt.x+sph.r*Math.sin(sph.ph)*Math.sin(sph.th),tgt.y+sph.r*Math.cos(sph.ph),tgt.z+sph.r*Math.sin(sph.ph)*Math.cos(sph.th));camera.lookAt(tgt.x,tgt.y,tgt.z)}
      updCam()
      const onMD=(e:MouseEvent)=>{drag=true;rgt=e.button===2;ox=e.clientX;oy=e.clientY}
      const onMU=()=>{drag=false}
      const onMM=(e:MouseEvent)=>{if(!drag)return;const dx=e.clientX-ox,dy=e.clientY-oy;if(rgt){tgt.x-=dx*.015;tgt.y+=dy*.015}else{sph.th-=dx*.007;sph.ph=Math.max(.05,Math.min(Math.PI*.85,sph.ph+dy*.007))};ox=e.clientX;oy=e.clientY;updCam()}
      const onWH=(e:WheelEvent)=>{sph.r=Math.max(7,Math.min(45,sph.r+e.deltaY*.04));updCam();e.preventDefault()}
      const onCM=(e:Event)=>e.preventDefault()
      let lt:Touch|null=null
      const onTS=(e:TouchEvent)=>{lt=e.touches[0];drag=true;e.preventDefault()}
      const onTE=()=>{drag=false;lt=null}
      const onTM=(e:TouchEvent)=>{if(!lt)return;const t=e.touches[0];sph.th-=(t.clientX-lt.clientX)*.007;sph.ph=Math.max(.05,Math.min(Math.PI*.85,sph.ph+(t.clientY-lt.clientY)*.007));lt=t;updCam();e.preventDefault()}
      cv.addEventListener('mousedown',onMD);cv.addEventListener('contextmenu',onCM);cv.addEventListener('mouseup',onMU);cv.addEventListener('mousemove',onMM);cv.addEventListener('wheel',onWH,{passive:false})
      cv.addEventListener('touchstart',onTS,{passive:false});cv.addEventListener('touchend',onTE);cv.addEventListener('touchmove',onTM,{passive:false})
      evCleanup=()=>{cv.removeEventListener('mousedown',onMD);cv.removeEventListener('contextmenu',onCM);cv.removeEventListener('mouseup',onMU);cv.removeEventListener('mousemove',onMM);cv.removeEventListener('wheel',onWH);cv.removeEventListener('touchstart',onTS);cv.removeEventListener('touchend',onTE);cv.removeEventListener('touchmove',onTM)}

      const ro=new ResizeObserver(()=>{const w=wrap.offsetWidth,h=wrap.offsetHeight;if(w<1||h<1)return;rnd.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()})
      ro.observe(wrap);roCleanup=()=>ro.disconnect()

      const loop=()=>{animId=requestAnimationFrame(loop);rnd.render(scene,camera)};loop()
    }).catch(e=>console.warn('Three.js load failed:',e))

    return ()=>{
      cancelled=true;cancelAnimationFrame(animId);roCleanup?.();evCleanup?.()
      if(renderer){renderer.dispose();if(renderer.domElement.parentNode)renderer.domElement.parentNode.removeChild(renderer.domElement)}
      if(wrapRef.current){const lb=wrapRef.current.querySelector('.ts-lvlbtns');if(lb)lb.innerHTML=''}
    }
  },[])

  return (
    <div ref={wrapRef} style={{width:'100%',height:'100%',minHeight:480,position:'relative',background:'#7a8fa0',borderRadius:'8px',overflow:'hidden'}}>
      <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,0.75)',color:'#f0c030',fontFamily:'monospace',fontSize:11,fontWeight:'bold',letterSpacing:2,padding:'5px 16px',whiteSpace:'nowrap',border:'1px solid rgba(240,192,48,0.4)',zIndex:10}}>TUBE STACKING MODEL · UNIT 25-1475</div>
      <div style={{position:'absolute',top:10,right:10,background:'rgba(0,0,0,0.75)',color:'#fff',fontFamily:'monospace',fontSize:13,fontWeight:'bold',padding:'6px 12px',textAlign:'center',zIndex:10}}>Cap. 36 tons<br/><span style={{fontSize:8,color:'#aaa',letterSpacing:1}}>CAPACITY</span></div>
      <div style={{position:'absolute',bottom:10,left:10,background:'rgba(0,0,0,0.75)',borderLeft:'3px solid #f0c030',padding:'8px 12px',fontFamily:'monospace',fontSize:10,minWidth:160,zIndex:10}}>
        <div style={{color:'#f0c030',fontSize:8,letterSpacing:2,marginBottom:6}}>SPECIFICATIONS</div>
        {[['LENGTH','25.4 m'],['WIDTH','2.8 m'],['UNIT','25-1475'],['LEVELS','4']].map(([k,v])=><div key={k} style={{color:'#aaa',margin:'2px 0'}}>{k}<span style={{color:'#fff',float:'right'}}>{v}</span></div>)}
      </div>
      <div style={{position:'absolute',bottom:10,right:10,background:'rgba(0,0,0,0.75)',padding:'8px 12px',fontFamily:'monospace',fontSize:9,color:'#888',lineHeight:2,zIndex:10}}><span style={{color:'#f0c030'}}>DRAG</span> Rotar &nbsp;<span style={{color:'#f0c030'}}>SCROLL</span> Zoom</div>
      <div className="ts-lvlbtns" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',gap:5,zIndex:10}}/>
    </div>
  )
}
