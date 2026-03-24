// frontend/src/pages/HomePage.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../Components/NavBar'
import Footer from '../Components/Footer'

const STATS = [{ value:'50K+',label:'Freelancers'},{value:'12K+',label:'Active Jobs'},{value:'8K+',label:'Courses'},{value:'98%',label:'Satisfaction'}]
const CATS = [{icon:'💻',title:'Web Development',jobs:1240},{icon:'🎨',title:'UI/UX Design',jobs:875},{icon:'📱',title:'Mobile Apps',jobs:634},{icon:'✍️',title:'Content Writing',jobs:920},{icon:'📊',title:'Data Science',jobs:412},{icon:'🎬',title:'Video Editing',jobs:560}]
const JOBS = [
  {title:'Full Stack MERN Developer',company:'TechNova Inc.',budget:'$800–$1,200',tags:['React','Node.js','MongoDB'],img:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',proposals:14,type:'Fixed Price'},
  {title:'UI/UX Designer for SaaS App',company:'CloudBase Ltd.',budget:'$500–$900',tags:['Figma','Prototyping','Wireframe'],img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',proposals:9,type:'Hourly'},
  {title:'Mobile App Developer',company:'AppSprint',budget:'$1,000–$2,000',tags:['React Native','Firebase','iOS'],img:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',proposals:22,type:'Fixed Price'},
]
const COURSES = [
  {title:'Complete MERN Stack Bootcamp',instructor:'Sarah Johnson',rating:4.9,students:'12.4K',price:'$49',level:'Beginner',img:'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&q=80'},
  {title:'Freelancing Mastery',instructor:'Mike Chen',rating:4.8,students:'8.1K',price:'$39',level:'All Levels',img:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80'},
  {title:'Advanced UI/UX Design',instructor:'Priya Nair',rating:4.7,students:'5.6K',price:'$59',level:'Intermediate',img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80'},
]
const FREELANCERS = [
  {name:'Alex Rivera',role:'Full Stack Developer',rate:'$45/hr',rating:5.0,jobs:134,img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',skills:['React','Node.js','AWS']},
  {name:'Zara Ahmed',role:'UI/UX Designer',rate:'$38/hr',rating:4.9,jobs:98,img:'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80',skills:['Figma','Adobe XD','Sketch']},
  {name:'James Park',role:'Data Scientist',rate:'$55/hr',rating:4.9,jobs:76,img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',skills:['Python','TensorFlow','SQL']},
]
const TESTI = [
  {q:'Found an amazing developer in under 24 hours. The quality of talent here is unmatched!',name:'Emily Watson',role:'Product Manager, StartupX',img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'},
  {q:'The courses helped me level up my skills and land a $70/hr freelance gig. Life-changing!',name:'David Okafor',role:'Freelance Developer',img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'},
  {q:'As a client, I love how easy it is to post jobs and review applicants. Hired 5 freelancers!',name:'Sophia Lin',role:'CEO, DigitalCraft',img:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80'},
]

const GT = {background:'linear-gradient(135deg,#6d1fa0,#c0396b,#f4622a)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}
const PF = {fontFamily:"'Playfair Display',serif"}
const CARD = {background:'white',borderRadius:20,border:'1px solid #ede0f7',overflow:'hidden',cursor:'pointer',transition:'all .3s cubic-bezier(.4,0,.2,1)'}
const SL = {display:'inline-block',background:'rgba(192,57,107,.08)',color:'#c0396b',border:'1px solid rgba(192,57,107,.25)',borderRadius:999,padding:'5px 16px',fontSize:13,fontWeight:600,marginBottom:12,letterSpacing:'.02em'}
const CHIP = {background:'#f3eeff',color:'#6d1fa0',borderRadius:999,padding:'3px 12px',fontSize:12,fontWeight:500}
const TAG  = {background:'#fff0f8',color:'#c0396b',border:'1px solid rgba(192,57,107,.25)',borderRadius:999,padding:'3px 12px',fontSize:12,fontWeight:600}
const DIV  = {height:1,background:'linear-gradient(90deg,transparent,rgba(192,57,107,.2),transparent)',maxWidth:1200,margin:'0 auto'}

function HomePage(){
  const [tab,setTab]=useState('hire')
  const [q,setQ]=useState('')
  const ph={hire:'e.g. React developer, UI designer...',work:'e.g. Web development, writing...',learn:'e.g. MERN stack, Python, Figma...'}

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .sc-page{font-family:'Plus Jakarta Sans',sans-serif;background:#f8f5ff;color:#1a0530;overflow-x:hidden}
        .sc-ch:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(109,31,160,.12);border-color:rgba(192,57,107,.3)!important}
        .sc-cath:hover{border-color:#c0396b!important;box-shadow:0 10px 30px rgba(192,57,107,.12);transform:translateY(-4px)}
        .sc-fh:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(109,31,160,.12);border-color:rgba(192,57,107,.3)!important}
        .sc-th:hover{box-shadow:0 16px 40px rgba(109,31,160,.1);transform:translateY(-4px)}
        .sc-sh:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(109,31,160,.1)}
        .sc-bp{background:linear-gradient(135deg,#6d1fa0,#c0396b,#f4622a);color:white;border:none;cursor:pointer;font-family:inherit;font-weight:700;border-radius:14px;transition:all .3s ease}
        .sc-bp:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(192,57,107,.4)}
        .sc-la{color:#c0396b;font-size:14px;font-weight:600;text-decoration:none}
        input:focus{outline:none!important;border-color:#c0396b!important;box-shadow:0 0 0 3px rgba(192,57,107,.12)!important}
        @media(max-width:900px){.g3{grid-template-columns:1fr 1fr!important}.g6{grid-template-columns:repeat(3,1fr)!important}.g4{grid-template-columns:repeat(2,1fr)!important}.hi{display:none!important}.hg{grid-template-columns:1fr!important}}
        @media(max-width:580px){.g3{grid-template-columns:1fr!important}.g6{grid-template-columns:repeat(2,1fr)!important}.g4{grid-template-columns:1fr!important}}
      `}</style>
      <div className="sc-page">
        <NavBar/>

        {/* HERO */}
        <section style={{minHeight:'100vh',display:'flex',alignItems:'center',paddingTop:80,paddingBottom:60,backgroundImage:"url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed',position:'relative'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,rgba(248,245,255,.96) 0%,rgba(245,228,255,.92) 40%,rgba(255,228,242,.82) 100%)'}}/>
          <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',position:'relative',width:'100%'}}>
            <div className="hg" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
              <div>
                <span style={SL}>✨ 50,000+ Active Members</span>
                <h1 style={{...PF,fontSize:'clamp(2.4rem,5vw,4.2rem)',fontWeight:900,lineHeight:1.12,marginBottom:20,color:'#1a0530'}}>
                  Hire Talent.<br/><span style={GT}>Learn Skills.</span><br/>Build Futures.
                </h1>
                <p style={{color:'#6b4a80',fontSize:17,lineHeight:1.75,marginBottom:32,maxWidth:460}}>
                  The all-in-one platform where clients post jobs, freelancers grow careers, and everyone learns through world-class courses.
                </p>
                <div style={{background:'#f0e8fa',borderRadius:16,padding:5,display:'inline-flex',gap:4,marginBottom:14}}>
                  {[{id:'hire',l:'🔍 Hire Talent'},{id:'work',l:'💼 Find Work'},{id:'learn',l:'🎓 Learn'}].map(t=>(
                    <button key={t.id} onClick={()=>setTab(t.id)} style={{borderRadius:12,padding:'10px 20px',fontSize:14,fontWeight:700,cursor:'pointer',border:'none',fontFamily:'inherit',transition:'all .25s ease',background:tab===t.id?'linear-gradient(135deg,#6d1fa0,#c0396b,#f4622a)':'transparent',color:tab===t.id?'white':'#8b5ab0',boxShadow:tab===t.id?'0 4px 14px rgba(192,57,107,.35)':'none'}}>{t.l}</button>
                  ))}
                </div>
                <div style={{display:'flex',gap:10}}>
                  <input type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder={ph[tab]} style={{flex:1,background:'white',border:'1.5px solid #e0d0f0',borderRadius:14,padding:'14px 18px',fontSize:14,color:'#1a0530',fontFamily:'inherit',transition:'border-color .2s'}}/>
                  <button className="sc-bp" style={{padding:'14px 24px',fontSize:14,whiteSpace:'nowrap'}}>Search →</button>
                </div>
                <div style={{display:'flex',gap:14,marginTop:14,flexWrap:'wrap'}}>
                  {['React Developer','UI/UX Designer','Content Writer','Data Analyst'].map(tg=>(
                    <span key={tg} style={{fontSize:12,color:'#a080c0',cursor:'pointer',transition:'color .2s'}} onMouseEnter={e=>e.target.style.color='#c0396b'} onMouseLeave={e=>e.target.style.color='#a080c0'}>#{tg}</span>
                  ))}
                </div>
              </div>
              <div className="hi" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,position:'relative'}}>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{borderRadius:20,overflow:'hidden',height:200,boxShadow:'0 16px 40px rgba(109,31,160,.15)'}}><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                  <div style={{borderRadius:20,overflow:'hidden',height:130,boxShadow:'0 16px 40px rgba(109,31,160,.15)'}}><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:14,marginTop:28}}>
                  <div style={{borderRadius:20,overflow:'hidden',height:130,boxShadow:'0 16px 40px rgba(109,31,160,.15)'}}><img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                  <div style={{borderRadius:20,overflow:'hidden',height:200,boxShadow:'0 16px 40px rgba(109,31,160,.15)'}}><img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                </div>
                <div style={{position:'absolute',bottom:-12,left:-20,background:'white',borderRadius:16,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 10px 30px rgba(109,31,160,.14)',border:'1px solid #ede0f7'}}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80" alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}}/>
                  <div><div style={{fontSize:12,fontWeight:700,color:'#1a0530'}}>Alex hired! 🎉</div><div style={{fontSize:11,color:'#9ca3af'}}>Full Stack Dev · $1,200</div></div>
                  <div style={{width:22,height:22,borderRadius:'50%',background:'#dcfce7',color:'#16a34a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>✓</div>
                </div>
              </div>
            </div>
            <div className="g4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:64}}>
              {STATS.map(s=>(
                <div key={s.label} className="sc-sh" style={{background:'white',borderRadius:18,border:'1px solid #ede0f7',padding:'22px 16px',textAlign:'center',transition:'all .3s ease'}}>
                  <div style={{...PF,...GT,fontSize:32,fontWeight:800,marginBottom:4}}>{s.value}</div>
                  <div style={{color:'#9ca3af',fontSize:13}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={DIV}/>

        {/* CATEGORIES */}
        <section style={{padding:'80px 24px',background:'#f8f5ff'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <span style={SL}>Browse Categories</span>
              <h2 style={{...PF,fontSize:'2.4rem',fontWeight:800,color:'#1a0530'}}>Find work in your <span style={GT}>expertise</span></h2>
            </div>
            <div className="g6" style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:14}}>
              {CATS.map(c=>(
                <div key={c.title} className="sc-cath" style={{background:'white',borderRadius:18,padding:'22px 14px',textAlign:'center',border:'1.5px solid #ede0f7',cursor:'pointer',transition:'all .3s ease'}}>
                  <div style={{fontSize:32,marginBottom:10}}>{c.icon}</div>
                  <div style={{fontWeight:700,fontSize:13,color:'#1a0530',marginBottom:4}}>{c.title}</div>
                  <div style={{fontSize:12,color:'#9ca3af'}}>{c.jobs} jobs</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={DIV}/>

        {/* JOBS */}
        <section style={{padding:'80px 24px',background:'white'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48}}>
              <div><span style={SL}>Latest Opportunities</span><br/><h2 style={{...PF,fontSize:'2.4rem',fontWeight:800,color:'#1a0530'}}>Featured <span style={GT}>Jobs</span></h2></div>
              <Link to="/jobs" className="sc-la">View all jobs →</Link>
            </div>
            <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
              {JOBS.map((j,i)=>(
                <div key={i} className="sc-ch" style={CARD}>
                  <div style={{height:160,overflow:'hidden'}}><img src={j.img} alt={j.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                  <div style={{padding:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><span style={TAG}>{j.type}</span><span style={{color:'#16a34a',fontWeight:700,fontSize:14}}>{j.budget}</span></div>
                    <h3 style={{...PF,fontSize:17,fontWeight:700,marginBottom:4,color:'#1a0530'}}>{j.title}</h3>
                    <p style={{color:'#9ca3af',fontSize:13,marginBottom:14}}>{j.company}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>{j.tags.map(t=><span key={t} style={CHIP}>{t}</span>)}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:14,borderTop:'1px solid #f3eeff'}}>
                      <span style={{fontSize:12,color:'#9ca3af'}}>{j.proposals} proposals</span>
                      <button className="sc-bp" style={{padding:'8px 18px',fontSize:13}}>Apply Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={DIV}/>

        {/* COURSES */}
        <section style={{padding:'80px 24px',position:'relative',backgroundImage:"url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1800&q=85')",backgroundSize:'cover',backgroundPosition:'center top'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(248,240,255,.96) 0%,rgba(255,255,255,.98) 100%)'}}/>
          <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48}}>
              <div><span style={SL}>🎓 Learn & Grow</span><br/><h2 style={{...PF,fontSize:'2.4rem',fontWeight:800,color:'#1a0530'}}>Top <span style={GT}>Courses</span></h2><p style={{color:'#6b4a80',marginTop:8}}>Learn from industry experts</p></div>
              <Link to="/courses" className="sc-la">Browse all →</Link>
            </div>
            <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
              {COURSES.map((c,i)=>(
                <div key={i} className="sc-ch" style={CARD}>
                  <div style={{height:176,overflow:'hidden',position:'relative'}}>
                    <img src={c.img} alt={c.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <div style={{position:'absolute',top:12,left:12,background:'white',borderRadius:999,padding:'4px 12px',fontSize:11,fontWeight:700,color:'#c0396b'}}>{c.level}</div>
                  </div>
                  <div style={{padding:20}}>
                    <h3 style={{...PF,fontSize:16,fontWeight:700,marginBottom:6,color:'#1a0530',lineHeight:1.4}}>{c.title}</h3>
                    <p style={{color:'#9ca3af',fontSize:13,marginBottom:12}}>by {c.instructor}</p>
                    <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:16}}>
                      {[...Array(5)].map((_,j)=><span key={j} style={{color:'#f59e0b',fontSize:13}}>★</span>)}
                      <span style={{fontSize:13,fontWeight:700}}>{c.rating}</span>
                      <span style={{fontSize:12,color:'#9ca3af'}}>({c.students})</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:14,borderTop:'1px solid #f3eeff'}}>
                      <span style={{...PF,...GT,fontSize:22,fontWeight:800}}>{c.price}</span>
                      <button className="sc-bp" style={{padding:'8px 18px',fontSize:13}}>Enroll Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={DIV}/>

        {/* FREELANCERS */}
        <section style={{padding:'80px 24px',background:'#f8f5ff'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48}}>
              <div><span style={SL}>⭐ Verified Talent</span><br/><h2 style={{...PF,fontSize:'2.4rem',fontWeight:800,color:'#1a0530'}}>Top <span style={GT}>Freelancers</span></h2></div>
              <Link to="/freelancers" className="sc-la">See all →</Link>
            </div>
            <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
              {FREELANCERS.map((f,i)=>(
                <div key={i} className="sc-fh" style={{background:'white',borderRadius:20,border:'1px solid #ede0f7',padding:24,cursor:'pointer',transition:'all .3s ease'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:16}}>
                    <img src={f.img} alt={f.name} style={{width:60,height:60,borderRadius:16,objectFit:'cover',border:'3px solid #f3eeff',boxShadow:'0 4px 12px rgba(109,31,160,.15)'}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:16,color:'#1a0530'}}>{f.name}</div>
                      <div style={{fontSize:13,color:'#9ca3af',marginBottom:4}}>{f.role}</div>
                      <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{color:'#f59e0b',fontSize:13}}>★</span><span style={{fontSize:13,fontWeight:700}}>{f.rating}</span><span style={{fontSize:12,color:'#9ca3af'}}>· {f.jobs} jobs</span></div>
                    </div>
                    <span style={{color:'#16a34a',fontWeight:700,fontSize:14}}>{f.rate}</span>
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:18}}>{f.skills.map(s=><span key={s} style={CHIP}>{s}</span>)}</div>
                  <button className="sc-bp" style={{width:'100%',padding:11,fontSize:14}}>View Profile</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={DIV}/>

        {/* TESTIMONIALS */}
        <section style={{padding:'80px 24px',background:'white'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <span style={SL}>💬 Community Love</span>
              <h2 style={{...PF,fontSize:'2.4rem',fontWeight:800,color:'#1a0530'}}>What people <span style={GT}>say</span></h2>
            </div>
            <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
              {TESTI.map((t,i)=>(
                <div key={i} className="sc-th" style={{background:'white',borderRadius:20,padding:28,border:'1px solid #ede0f7',transition:'all .3s ease'}}>
                  <div style={{...PF,...GT,fontSize:52,lineHeight:1,marginBottom:14}}>"</div>
                  <p style={{color:'#4b2060',fontSize:14,lineHeight:1.8,marginBottom:20}}>{t.q}</p>
                  <div style={{display:'flex',alignItems:'center',gap:12,paddingTop:16,borderTop:'1px solid #f3eeff'}}>
                    <img src={t.img} alt={t.name} style={{width:40,height:40,borderRadius:'50%',objectFit:'cover'}}/>
                    <div><div style={{fontWeight:700,fontSize:13,color:'#1a0530'}}>{t.name}</div><div style={{fontSize:12,color:'#9ca3af'}}>{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding:'80px 24px',background:'#f8f5ff'}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <div style={{borderRadius:28,overflow:'hidden',position:'relative',backgroundImage:"url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1600&q=85')",backgroundSize:'cover',backgroundPosition:'center'}}>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(109,31,160,.92),rgba(192,57,107,.88),rgba(244,98,42,.85))'}}/>
              <div style={{position:'relative',padding:'72px 48px',textAlign:'center'}}>
                <h2 style={{...PF,fontSize:'2.8rem',fontWeight:900,color:'white',marginBottom:14}}>Ready to get started?</h2>
                <p style={{color:'rgba(255,255,255,.85)',fontSize:17,marginBottom:36,maxWidth:460,margin:'0 auto 36px'}}>Join thousands of freelancers and clients building the future of work together.</p>
                <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
                  <Link to="/post-job" style={{background:'white',color:'#6d1fa0',borderRadius:14,padding:'15px 32px',fontWeight:700,fontSize:15,textDecoration:'none',boxShadow:'0 8px 24px rgba(0,0,0,.15)',display:'inline-block'}}>Post a Job Free</Link>
                  <Link to="/courses" style={{background:'rgba(255,255,255,.15)',color:'white',border:'1.5px solid rgba(255,255,255,.4)',borderRadius:14,padding:'15px 32px',fontWeight:700,fontSize:15,textDecoration:'none',backdropFilter:'blur(10px)',display:'inline-block'}}>Browse Courses</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer/>
      </div>
    </>
  )
}

export default HomePage