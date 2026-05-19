import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

const styles = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --blue:#1A6BF5;--blue-light:#4D8EF8;--blue-dim:rgba(26,107,245,0.12);--blue-border:rgba(26,107,245,0.3);
  --bg:#080808;--bg-card:#0f0f0f;--bg-card2:#141414;
  --border:rgba(255,255,255,0.08);--border-hover:rgba(255,255,255,0.16);
  --text:#ffffff;--text-2:#a0a0a0;--text-3:#606060;
  --green:#22c55e;--amber:#f59e0b;--red:#ef4444;
  --fh:'Inter',sans-serif;--fb:'Inter',sans-serif;
}
.inv-page{scroll-behavior:smooth}
.inv-page{background:var(--bg);color:var(--text);font-family:var(--fb);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh}
.inv-page::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");pointer-events:none;z-index:0;opacity:.6}
.inv-page .c{max-width:1180px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
.inv-page section{position:relative;z-index:1}

/* BANNER */
.inv-page .banner{position:fixed;top:0;left:0;right:0;z-index:200;background:var(--blue);padding:9px 24px;display:flex;align-items:center;justify-content:center;gap:16px;font-size:13px;font-weight:500;color:#fff}
.inv-page .banner a{color:rgba(255,255,255,.85);text-decoration:underline;text-underline-offset:2px;transition:color .2s}
.inv-page .banner a:hover{color:#fff}

/* NAV */
.inv-page nav{position:fixed;top:37px;left:0;right:0;z-index:100;border-bottom:1px solid var(--border);background:rgba(8,8,8,.88);backdrop-filter:blur(20px)}
.inv-page .ni{max-width:1180px;margin:0 auto;padding:0 24px;display:flex;align-items:center;height:64px;gap:40px}
.inv-page .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);flex-shrink:0}
.inv-page .lm{width:28px;height:22px}
.inv-page .lt{font-family:var(--fh);font-weight:700;font-size:18px;letter-spacing:-.02em}
.inv-page .nl{display:flex;gap:28px;align-items:center;flex:1}
.inv-page .nl a{text-decoration:none;color:var(--text-2);font-size:14px;font-weight:400;transition:color .2s}
.inv-page .nl a:hover{color:var(--text)}
.inv-page .nc{display:flex;gap:10px}
.inv-page .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:6px;font-size:14px;font-weight:500;font-family:var(--fb);cursor:pointer;text-decoration:none;transition:all .2s;border:1px solid transparent}
.inv-page .bg{color:var(--text-2);border-color:var(--border);background:transparent}
.inv-page .bg:hover{color:var(--text);border-color:var(--border-hover);background:rgba(255,255,255,.04)}
.inv-page .bp{background:var(--blue);color:#fff;border-color:var(--blue)}
.inv-page .bp:hover{background:var(--blue-light);border-color:var(--blue-light)}
.inv-page .bpl{padding:13px 28px;font-size:15px;border-radius:8px}
.inv-page .bgl{padding:12px 28px;font-size:15px;border-radius:8px;border-color:var(--border-hover)}

/* HERO */
.inv-page .hero{padding:200px 0 100px;text-align:center;position:relative;overflow:hidden}
.inv-page .hg1{position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:900px;height:600px;background:radial-gradient(ellipse,rgba(26,107,245,.18) 0%,transparent 70%);pointer-events:none}
.inv-page .hg2{position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:300px;background:linear-gradient(to bottom,transparent,rgba(26,107,245,.5),transparent);pointer-events:none}
.inv-page .badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;border:1px solid var(--blue-border);background:var(--blue-dim);font-size:13px;color:var(--blue-light);font-weight:500;margin-bottom:32px}
.inv-page .bd{width:6px;height:6px;background:var(--blue);border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.inv-page .hero h1{font-family:var(--fh);font-size:clamp(44px,6vw,80px);font-weight:700;line-height:1.05;letter-spacing:-.03em;margin-bottom:24px;max-width:820px;margin-left:auto;margin-right:auto}
.inv-page .hero h1 em{font-style:normal;color:var(--blue-light)}
.inv-page .hs{font-size:clamp(16px,2vw,20px);color:var(--text-2);max-width:640px;margin:0 auto 40px;font-weight:300;line-height:1.7}
.inv-page .hc{display:flex;justify-content:center;gap:12px;margin-bottom:80px;flex-wrap:wrap}

/* SECTION LABEL */
.inv-page .sl{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--blue-light);letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px}
.inv-page .sl::before{content:'';display:block;width:3px;height:14px;background:var(--blue);border-radius:2px}

/* LOGOS */
.inv-page .logos{padding:48px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden}
.inv-page .ll{text-align:center;font-size:12px;color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:28px;font-weight:500}
.inv-page .lw{position:relative;overflow:hidden}
.inv-page .lw::before,.inv-page .lw::after{content:'';position:absolute;top:0;bottom:0;width:120px;z-index:2}
.inv-page .lw::before{left:0;background:linear-gradient(to right,var(--bg),transparent)}
.inv-page .lw::after{right:0;background:linear-gradient(to left,var(--bg),transparent)}
.inv-page .lt2{display:flex;gap:48px;align-items:center;animation:scroll 24s linear infinite;width:max-content}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
.inv-page .lb{display:flex;align-items:center;gap:8px;font-family:var(--fh);font-size:15px;font-weight:600;color:var(--text-3);white-space:nowrap;flex-shrink:0}
.inv-page .li{width:20px;height:20px;opacity:.6}

/* PROBLEM */
.inv-page .problem{padding:120px 0}
.inv-page .ph{max-width:600px;margin-bottom:64px}
.inv-page .ph h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:700;line-height:1.15;letter-spacing:-.02em;margin-bottom:20px}
.inv-page .ph p{color:var(--text-2);font-size:17px;line-height:1.7}
.inv-page .pg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:64px}
.inv-page .pc{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:28px;position:relative;overflow:hidden;transition:border-color .3s}
.inv-page .pc:hover{border-color:var(--border-hover)}
.inv-page .pc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.inv-page .pc.r::before{background:linear-gradient(to right,var(--red),transparent)}
.inv-page .pc.a::before{background:linear-gradient(to right,var(--amber),transparent)}
.inv-page .pc.b::before{background:linear-gradient(to right,var(--blue),transparent)}
.inv-page .pi{font-size:24px;margin-bottom:16px}
.inv-page .ps{font-family:var(--fh);font-size:44px;font-weight:800;line-height:1;margin-bottom:8px}
.inv-page .pc.r .ps{color:var(--red)}.inv-page .pc.a .ps{color:var(--amber)}.inv-page .pc.b .ps{color:var(--blue-light)}
.inv-page .pc h3{font-family:var(--fh);font-size:17px;font-weight:700;margin-bottom:10px}
.inv-page .pc p{color:var(--text-2);font-size:14px;line-height:1.6}
.inv-page .psrc{font-size:11px;color:var(--text-3);margin-top:12px}
.inv-page .pq{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:40px;display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center}
.inv-page .pq blockquote{font-size:20px;font-weight:300;line-height:1.6;color:var(--text-2)}
.inv-page .pq blockquote strong{color:var(--text);font-weight:600}
.inv-page .pqs{text-align:right;min-width:160px}

/* MARKET */
.inv-page .market{padding:120px 0;border-top:1px solid var(--border);background:linear-gradient(to bottom,transparent,rgba(26,107,245,.03),transparent)}
.inv-page .mg{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
.inv-page .ml h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:20px}
.inv-page .ml p{color:var(--text-2);font-size:16px;line-height:1.8;margin-bottom:16px}
.inv-page .mn{display:flex;flex-direction:column;gap:12px;margin-top:32px}
.inv-page .mnr{display:flex;align-items:center;gap:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:20px 24px;transition:border-color .3s}
.inv-page .mnr:hover{border-color:var(--border-hover)}
.inv-page .mnn{font-family:var(--fh);font-size:36px;font-weight:800;color:var(--blue-light);min-width:90px;line-height:1}
.inv-page .mnl strong{color:var(--text);display:block;font-size:14px;font-weight:600;margin-bottom:2px}
.inv-page .mnl span{font-size:13px;color:var(--text-2)}
.inv-page .mstack{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.inv-page .msh{padding:20px 24px;border-bottom:1px solid var(--border)}
.inv-page .msh h3{font-family:var(--fh);font-size:15px;font-weight:700;margin-bottom:4px}
.inv-page .msh p{font-size:13px;color:var(--text-2)}
.inv-page .msr{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;border-bottom:1px solid var(--border);font-size:13px}
.inv-page .msr:last-child{border-bottom:none}
.inv-page .msrv{font-family:var(--fh);font-weight:700;font-size:14px;color:var(--blue-light)}

/* SOLUTION */
.inv-page .solution{padding:120px 0;border-top:1px solid var(--border)}
.inv-page .soh{text-align:center;max-width:640px;margin:0 auto 80px}
.inv-page .soh h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:700;line-height:1.15;letter-spacing:-.02em;margin-bottom:20px}
.inv-page .soh p{color:var(--text-2);font-size:17px}
.inv-page .sf{display:grid;grid-template-columns:1fr 48px 1fr 48px 1fr;gap:0;align-items:center;margin-bottom:80px}
.inv-page .fc{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:28px}
.inv-page .fc:nth-child(2n){background:transparent;border:none;display:flex;justify-content:center;align-items:center}
.inv-page .fa{color:var(--blue);opacity:.6}
.inv-page .fla{font-size:11px;font-weight:600;color:var(--blue-light);letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px}
.inv-page .fc h3{font-family:var(--fh);font-size:16px;font-weight:700;margin-bottom:16px}
.inv-page .fi{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-2)}
.inv-page .fi:last-child{border-bottom:none}
.inv-page .fii{width:18px;height:18px;border-radius:4px;background:var(--blue-dim);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.inv-page .foi{display:flex;flex-direction:column;gap:10px}
.inv-page .fo{background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text-2)}
.inv-page .fo strong{color:var(--text);font-size:13px;display:block;margin-bottom:2px}
.inv-page .ec{text-align:center;padding:32px 24px !important;background:rgba(26,107,245,.06) !important;border-color:var(--blue-border) !important}
.inv-page .ec h3{font-size:17px;color:var(--blue-light)}
.inv-page .eb{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.inv-page .eba{background:rgba(26,107,245,.1);border:1px solid var(--blue-border);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--blue-light);font-weight:500}

/* RESULTS */
.inv-page .results{padding:80px 0 120px}
.inv-page .rh{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px}
.inv-page .rh h2{font-family:var(--fh);font-size:clamp(28px,3.5vw,44px);font-weight:700;letter-spacing:-.02em;max-width:480px;line-height:1.1}
.inv-page .rh p{color:var(--text-2);font-size:14px;max-width:280px;text-align:right;line-height:1.6}
.inv-page .rtw{border:1px solid var(--border);border-radius:16px;overflow:hidden}
.inv-page .rt{width:100%;border-collapse:collapse}
.inv-page .rt th{padding:16px 24px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);background:var(--bg-card);border-bottom:1px solid var(--border)}
.inv-page .rt td{padding:18px 24px;font-size:14px;border-bottom:1px solid var(--border)}
.inv-page .rt tr:last-child td{border-bottom:none}
.inv-page .rt .rt2 td{background:rgba(26,107,245,.06)}
.inv-page .rt .rt2 td:first-child{position:relative}
.inv-page .rt .rt2 td:first-child::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--blue)}
.inv-page .wb{display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,.15);color:var(--green);border:1px solid rgba(34,197,94,.3);font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;margin-left:8px}
.inv-page .ah{color:var(--green);font-weight:700;font-family:var(--fh);font-size:16px}
.inv-page .am{color:var(--text-2);font-weight:600;font-family:var(--fh);font-size:16px}
.inv-page .mt{display:inline-block;background:var(--bg-card2);border:1px solid var(--border);border-radius:4px;padding:2px 8px;font-size:12px;color:var(--text-2);font-family:monospace}

/* VALUE */
.inv-page .value{padding:120px 0;border-top:1px solid var(--border)}
.inv-page .vh{text-align:center;max-width:560px;margin:0 auto 80px}
.inv-page .vh h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:16px}
.inv-page .vh p{color:var(--text-2);font-size:17px}
.inv-page .vg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.inv-page .vc{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:32px;transition:border-color .3s,transform .3s}
.inv-page .vc:hover{border-color:var(--border-hover);transform:translateY(-4px)}
.inv-page .vi{width:44px;height:44px;border-radius:10px;background:var(--blue-dim);border:1px solid var(--blue-border);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
.inv-page .vc h3{font-family:var(--fh);font-size:18px;font-weight:700;margin-bottom:10px}
.inv-page .vc p{color:var(--text-2);font-size:14px;line-height:1.7}
.inv-page .vm{margin-top:20px;padding-top:20px;border-top:1px solid var(--border);font-size:13px;color:var(--text-3)}
.inv-page .vm strong{color:var(--blue-light);font-family:var(--fh);font-size:20px;font-weight:800;display:block;margin-bottom:2px}

/* COMPETITIVE */
.inv-page .comp{padding:120px 0;border-top:1px solid var(--border);background:linear-gradient(to bottom,transparent,rgba(26,107,245,.03),transparent)}
.inv-page .comph{text-align:center;margin-bottom:64px}
.inv-page .comph h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:16px}
.inv-page .comph h2 em{font-style:normal;color:var(--blue-light)}
.inv-page .comph p{color:var(--text-2);font-size:17px;max-width:520px;margin:0 auto}
.inv-page .ctw{border:1px solid var(--border);border-radius:16px;overflow:hidden}
.inv-page .ct{width:100%;border-collapse:collapse}
.inv-page .ct th{padding:16px 28px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);background:var(--bg-card);border-bottom:1px solid var(--border)}
.inv-page .ct th.tht{color:var(--blue-light);background:rgba(26,107,245,.08)}
.inv-page .ct td{padding:20px 28px;font-size:14px;border-bottom:1px solid var(--border);vertical-align:top}
.inv-page .ct tr:last-child td{border-bottom:none}
.inv-page .ct .tdt{background:rgba(26,107,245,.04);color:var(--text);font-weight:500}
.inv-page .ln{font-weight:600;font-size:14px}.inv-page .lt3{color:var(--text-3);font-size:13px;margin-top:2px}
.inv-page .cs{color:var(--text-2)}
.inv-page .ca{display:inline-flex;align-items:center;gap:6px;color:var(--blue-light);font-weight:600}
.inv-page .ca::before{content:'\\2192';color:var(--blue)}

/* PERSONAS */
.inv-page .personas{padding:120px 0;border-top:1px solid var(--border)}
.inv-page .persh{text-align:center;max-width:560px;margin:0 auto 64px}
.inv-page .persh h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:16px}
.inv-page .persh p{color:var(--text-2);font-size:17px}
.inv-page .persg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.inv-page .persc{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:32px;transition:border-color .3s}
.inv-page .persc:hover{border-color:var(--border-hover)}
.inv-page .pt{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--blue-light);margin-bottom:20px;background:var(--blue-dim);border:1px solid var(--blue-border);padding:4px 10px;border-radius:4px}
.inv-page .persc h3{font-family:var(--fh);font-size:20px;font-weight:700;margin-bottom:12px}
.inv-page .persc p{color:var(--text-2);font-size:14px;line-height:1.7;margin-bottom:24px}
.inv-page .pf{display:flex;flex-direction:column;gap:8px}
.inv-page .pfi{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--text-2)}
.inv-page .pch{color:var(--green);flex-shrink:0;margin-top:1px;font-size:14px}

/* TEAM */
.inv-page .team{padding:80px 0 120px;border-top:1px solid var(--border)}
.inv-page .teamh{text-align:center;max-width:520px;margin:0 auto 56px}
.inv-page .teamh h2{font-family:var(--fh);font-size:clamp(28px,3.5vw,44px);font-weight:700;letter-spacing:-.02em;margin-bottom:16px}
.inv-page .teamh p{color:var(--text-2);font-size:16px}
.inv-page .teamg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.inv-page .teamc{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:32px;transition:border-color .3s}
.inv-page .teamc:hover{border-color:var(--border-hover)}
.inv-page .tav{width:56px;height:56px;border-radius:12px;background:var(--blue-dim);border:1px solid var(--blue-border);display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:18px;font-weight:800;color:var(--blue-light);margin-bottom:20px}
.inv-page .tro{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--blue-light);margin-bottom:6px}
.inv-page .tnm{font-family:var(--fh);font-size:18px;font-weight:700;margin-bottom:12px}
.inv-page .tbi{font-size:13px;color:var(--text-2);line-height:1.7}
.inv-page .ttg{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.inv-page .ttag{font-size:11px;background:var(--bg-card2);border:1px solid var(--border);border-radius:4px;padding:2px 8px;color:var(--text-3)}

/* TRACTION */
.inv-page .traction{padding:80px 0 120px;border-top:1px solid var(--border)}
.inv-page .trh{max-width:480px;margin-bottom:64px}
.inv-page .trh h2{font-family:var(--fh);font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:16px}
.inv-page .trh p{color:var(--text-2);font-size:17px}
.inv-page .trg{display:grid;grid-template-columns:2fr 1fr;gap:40px}
.inv-page .trcs{display:flex;flex-direction:column;gap:16px}
.inv-page .cc{display:flex;gap:20px;align-items:center;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:20px 24px;transition:border-color .3s}
.inv-page .cc:hover{border-color:var(--border-hover)}
.inv-page .cic{width:44px;height:44px;border-radius:10px;background:var(--blue-dim);border:1px solid var(--blue-border);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.inv-page .cnm{font-weight:600;font-size:15px;margin-bottom:4px}
.inv-page .cdt{font-size:13px;color:var(--text-2)}
.inv-page .pc2{font-family:var(--fh);font-size:56px;font-weight:800;color:var(--blue-light);line-height:1;margin-bottom:8px}
.inv-page .ptg{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.inv-page .pta{font-size:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:3px 8px;color:var(--text-3)}

/* CTA */
.inv-page .ctas{padding:120px 0;text-align:center;position:relative;overflow:hidden}
.inv-page .cgl{position:absolute;bottom:-200px;left:50%;transform:translateX(-50%);width:800px;height:500px;background:radial-gradient(ellipse,rgba(26,107,245,.14) 0%,transparent 70%);pointer-events:none}
.inv-page .ctas h2{font-family:var(--fh);font-size:clamp(36px,5vw,68px);font-weight:700;letter-spacing:-.03em;line-height:1.05;margin-bottom:24px;max-width:700px;margin-left:auto;margin-right:auto}
.inv-page .ctas h2 em{font-style:normal;color:var(--blue-light)}
.inv-page .ctas p{color:var(--text-2);font-size:18px;margin-bottom:40px;max-width:480px;margin-left:auto;margin-right:auto}
.inv-page .ctab{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:48px}
.inv-page .contacts-box{display:inline-block;text-align:left;border:1px solid var(--border);border-radius:12px;overflow:hidden}
.inv-page .cr{display:flex;align-items:baseline;gap:12px;padding:14px 28px;border-bottom:1px solid var(--border);font-size:14px}
.inv-page .cr:last-child{border-bottom:none}
.inv-page .crn{color:var(--text);font-weight:500;min-width:220px}
.inv-page .cre{color:var(--blue-light);text-decoration:none}
.inv-page .cre:hover{text-decoration:underline}

/* FOOTER */
.inv-page footer{border-top:1px solid var(--border);padding:60px 0 40px}
.inv-page .ft{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:60px}
.inv-page .fb p{color:var(--text-3);font-size:14px;margin-top:12px;max-width:260px;line-height:1.7}
.inv-page .fcl h4{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:16px}
.inv-page .fcl a{display:block;color:var(--text-2);font-size:14px;text-decoration:none;margin-bottom:10px;transition:color .2s}
.inv-page .fcl a:hover{color:var(--text)}
.inv-page .fbot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:28px}
.inv-page .fbl{font-size:13px;color:var(--text-3)}
.inv-page .fbr{display:flex;gap:20px}
.inv-page .fbr a{font-size:13px;color:var(--text-3);text-decoration:none}
.inv-page .fbr a:hover{color:var(--text-2)}

/* PASSWORD GATE */
.inv-page .pw-gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.inv-page .pw-box{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:48px;max-width:400px;width:100%;text-align:center}
.inv-page .pw-box .logo{justify-content:center;margin-bottom:32px}
.inv-page .pw-box h2{font-family:var(--fh);font-size:24px;font-weight:700;margin-bottom:12px}
.inv-page .pw-box p{color:var(--text-2);font-size:14px;margin-bottom:32px}
.inv-page .pw-input{width:100%;padding:14px 16px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:15px;font-family:var(--fb);margin-bottom:16px;transition:border-color .2s}
.inv-page .pw-input:focus{outline:none;border-color:var(--blue)}
.inv-page .pw-input::placeholder{color:var(--text-3)}
.inv-page .pw-submit{width:100%;padding:14px 24px;border-radius:8px;background:var(--blue);color:#fff;font-size:15px;font-weight:600;font-family:var(--fb);border:none;cursor:pointer;transition:background .2s}
.inv-page .pw-submit:hover{background:var(--blue-light)}
.inv-page .pw-error{color:var(--red);font-size:13px;margin-top:16px}

@media(max-width:900px){
  .inv-page .pg,.inv-page .vg,.inv-page .persg,.inv-page .teamg{grid-template-columns:1fr}
  .inv-page .sf{grid-template-columns:1fr}.inv-page .fc:nth-child(2n){display:none}
  .inv-page .trg,.inv-page .mg{grid-template-columns:1fr}
  .inv-page .ft{grid-template-columns:1fr 1fr}
  .inv-page .rh{flex-direction:column;gap:16px}
  .inv-page .rh p{text-align:left}
  .inv-page .pq{grid-template-columns:1fr}
}
`

const INVESTOR_PASSWORD = 'BlueOcean'

export default function Investors() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('investor_authenticated') === 'true'
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === INVESTOR_PASSWORD) {
      sessionStorage.setItem('investor_authenticated', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  useEffect(() => {
    // Set page title
    document.title = 'Traigent - Investor Overview'

    // Add Google Fonts
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.title = 'Traigent - Trust Your AI Agents at Scale'
    }
  }, [])

  // Password gate
  if (!isAuthenticated) {
    return (
      <>
        <style>{styles}</style>
        <div className="inv-page">
          <div className="pw-gate">
            <div className="pw-box">
              <a href="/" className="logo">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png" alt="Traigent" height="22" style={{ display: 'block', height: '22px', width: 'auto' }} />
              </a>
              <h2>Investor Access</h2>
              <p>This page contains confidential investor information. Please enter the password to continue.</p>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  className="pw-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="pw-submit">Access Investor Page</button>
              </form>
              {error && <p className="pw-error">{error}</p>}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>For Investors · Traigent</title>
        <meta name="description" content="Traigent — investor information about the AI Agent Optimization Platform. Market opportunity, traction, team." />
        <meta property="og:title" content="Traigent — For Investors" />
        <meta property="og:description" content="Investor information about Traigent, the AI Agent Optimization Platform." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <style>{styles}</style>
      <div className="inv-page">
        {/* BANNER */}
        <div className="banner">
          <span>&#128203; Investor Overview &mdash; Seed Stage &middot; 2025</span>
        </div>

        {/* NAV */}
        <nav>
          <div className="ni">
            <a href="/" className="logo">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png" alt="Traigent" height="22" style={{ display: 'block', height: '22px', width: 'auto' }} />
            </a>
            <div className="nl">
              <a href="#market" onClick={(e) => { e.preventDefault(); document.getElementById('market')?.scrollIntoView({ behavior: 'smooth' }) }}>Market</a>
              <a href="#solution" onClick={(e) => { e.preventDefault(); document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' }) }}>Product</a>
              <a href="#architecture" onClick={(e) => { e.preventDefault(); document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' }) }}>Architecture</a>
              <a href="#competitive" onClick={(e) => { e.preventDefault(); document.getElementById('competitive')?.scrollIntoView({ behavior: 'smooth' }) }}>Differentiation</a>
              <a href="#traction" onClick={(e) => { e.preventDefault(); document.getElementById('traction')?.scrollIntoView({ behavior: 'smooth' }) }}>Team &amp; Research</a>
            </div>
            <div className="nc">
              <a href="mailto:info@traigent.ai" className="btn bp">Request pitch deck</a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hg1"></div><div className="hg2"></div>
          <div className="c">
            <div className="badge" style={{ opacity: 0, animation: 'fadeUp .6s ease .1s forwards' }}>
              <span className="bd"></span>
              Seed Stage &middot; $150B TAM &middot; Presenting at CAIN 2026
            </div>
            <h1 style={{ opacity: 0, animation: 'fadeUp .7s ease .2s forwards' }}>
              <em>Trust</em> your AI agent<br />at scale.
            </h1>
            <p className="hs" style={{ opacity: 0, animation: 'fadeUp .7s ease .3s forwards' }}>
              Traigent is the continuous optimization infrastructure for enterprise GenAI &mdash;
              the missing layer between PoC and production that automatically tunes models,
              prompts, and costs so AI agents perform reliably at enterprise scale.
            </p>
            <div className="hc" style={{ opacity: 0, animation: 'fadeUp .7s ease .4s forwards' }}>
              <a href="mailto:info@traigent.ai" className="btn bp bpl">Request the pitch deck &rarr;</a>
              <a href="mailto:info@traigent.ai" className="btn bg bgl">Schedule a call</a>
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <section className="logos">
          <div className="c"><p className="ll">Customers</p></div>
          <div className="lw">
            <div className="lt2">
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h10v2H3v-2z"/></svg>Bazak</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>iForAI</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" opacity=".5"/><path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>Cloudzone</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3l7 4v6l-7 4-7-4V7l7-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>Profisea</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M15 6l-7 4-6-4V5l6 4 6-4h1v1zM2 8l6 4 7-4v1l-7 4-6-4V8z"/></svg>Yotpo</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>FinTech Partners</div>
              {/* duplicate set 1 */}
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h10v2H3v-2z"/></svg>Bazak</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>iForAI</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" opacity=".5"/><path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>Cloudzone</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3l7 4v6l-7 4-7-4V7l7-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>Profisea</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M15 6l-7 4-6-4V5l6 4 6-4h1v1zM2 8l6 4 7-4v1l-7 4-6-4V8z"/></svg>Yotpo</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>FinTech Partners</div>
              {/* duplicate set 2 */}
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h10v2H3v-2z"/></svg>Bazak</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>iForAI</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" opacity=".5"/><path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>Cloudzone</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3l7 4v6l-7 4-7-4V7l7-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>Profisea</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><path d="M15 6l-7 4-6-4V5l6 4 6-4h1v1zM2 8l6 4 7-4v1l-7 4-6-4V8z"/></svg>Yotpo</div>
              <div className="lb"><svg className="li" viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>FinTech Partners</div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="problem">
          <div className="c">
            <span className="sl">The execution gap</span>
            <div className="ph">
              <h2>Enterprise GenAI projects are failing &mdash; after the demo.</h2>
              <p>The PoC looks great. Then comes production scale, model updates, rising costs, and hallucinations. Most teams don&rsquo;t survive the transition.</p>
            </div>
            <div className="pg">
              <div className="pc r"><div className="pi">&#9888;</div><div className="ps">30%</div><h3>Project abandonment after PoC</h3><p>Nearly one third of enterprise GenAI projects are cancelled after proof-of-concept due to quality failures and eroded trust in AI outputs.</p><p className="psrc">Source: Gartner, 2024</p></div>
              <div className="pc a"><div className="pi">&#9881;</div><div className="ps">95%</div><h3>Of pilots fail at the friction barrier</h3><p>Organizations avoid the continuous manual tuning required to maintain agent quality &mdash; so performance degrades as complexity grows.</p><p className="psrc">Source: MIT Sloan, 2024</p></div>
              <div className="pc b"><div className="pi">&#8599;</div><div className="ps">&infin;</div><h3>Escalating cost with no clear ROI</h3><p>Inadequate risk controls and opaque cost attribution mean budgets deplete without a defensible path to business value.</p><p className="psrc">Source: IDC, 2024</p></div>
            </div>
            <div className="pq">
              <blockquote>&ldquo;As AI agents scale across use cases, data volume, and complexity &mdash; <strong>quality degrades, credibility collapses, and costs spiral</strong>. Without a systematic optimization loop, failure is the default.&rdquo;</blockquote>
              <div className="pqs"><div style={{ fontFamily: 'var(--fh)', fontSize: '22px', fontWeight: 800, color: 'var(--blue-light)', marginBottom: '4px' }}>Traigent</div><div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Research findings, 2025</div></div>
            </div>
          </div>
        </section>

        {/* MARKET */}
        <section className="market" id="market">
          <div className="c">
            <span className="sl">Market opportunity</span>
            <div className="mg">
              <div className="ml">
                <h2>Capturing the optimization layer of a $150B market.</h2>
                <p>Enterprise AI software spending is growing at an unprecedented rate &mdash; but the tooling to make agents reliable, governed, and cost-efficient is almost entirely absent.</p>
                <p>We are targeting a <strong style={{ color: 'var(--text)' }}>$20B serviceable market</strong> growing at 40% CAGR &mdash; the intersection of AI agent tooling, MLOps, and enterprise governance.</p>
                <div className="mn">
                  <div className="mnr"><div className="mnn">$150B</div><div className="mnl"><strong>Total Addressable Market</strong><span>Enterprise AI software (Gartner, IDC)</span></div></div>
                  <div className="mnr"><div className="mnn">$20B</div><div className="mnl"><strong>Serviceable Market</strong><span>AI agent optimization &amp; governance layer</span></div></div>
                  <div className="mnr"><div className="mnn">40%</div><div className="mnl"><strong>CAGR</strong><span>Markets&amp;Markets, Grand View Research, Mordor Intelligence</span></div></div>
                </div>
              </div>
              <div>
                <div className="mstack">
                  <div className="msh"><h3>The AI agent infrastructure stack</h3><p>Where Traigent sits &mdash; and where the gap is widest</p></div>
                  <div className="msr"><span><strong style={{ color: 'var(--text-2)' }}>LLM Providers</strong><span style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)' }}>OpenAI, Anthropic, Google</span></span><span className="msrv" style={{ color: 'var(--text-3)' }}>Crowded</span></div>
                  <div className="msr"><span><strong style={{ color: 'var(--text-2)' }}>Agent Frameworks</strong><span style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)' }}>LangChain, CrewAI, AutoGen</span></span><span className="msrv" style={{ color: 'var(--text-3)' }}>Commoditizing</span></div>
                  <div className="msr" style={{ background: 'rgba(26,107,245,.06)', borderLeft: '3px solid var(--blue)' }}><span><strong style={{ color: 'var(--text)' }}>Optimization &amp; Governance</strong><span style={{ display: 'block', fontSize: '12px', color: 'var(--blue-light)' }}>Traigent &mdash; this is the gap</span></span><span className="msrv">Whitespace</span></div>
                  <div className="msr"><span><strong style={{ color: 'var(--text-2)' }}>Observability</strong><span style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)' }}>LangSmith, Arize</span></span><span className="msrv" style={{ color: 'var(--text-3)' }}>Reporting only</span></div>
                  <div className="msr"><span><strong style={{ color: 'var(--text-2)' }}>Enterprise Applications</strong><span style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)' }}>FinTech, Retail, Infrastructure</span></span><span className="msrv" style={{ color: 'var(--text-3)' }}>Buyers</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="solution" id="solution">
          <div className="c">
            <span className="sl">The solution</span>
            <div className="soh">
              <h2>Continuous optimization, not one-time configuration.</h2>
              <p>Traigent runs an automated optimization loop &mdash; exploring model and prompt combinations, benchmarking against your evaluation data, and promoting only what passes governance &mdash; out-of-band, without latency impact on production.</p>
            </div>
            <div className="sf">
              <div className="fc"><div className="fla">Input layer</div><h3>Design &amp; Ground Truth</h3>
                <div className="fi"><div className="fii"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" rx="1" stroke="#1A6BF5" strokeWidth="1.2"/></svg></div>Agent or program definition (Python SDK, JS, or API)</div>
                <div className="fi"><div className="fii"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2v6" stroke="#1A6BF5" strokeWidth="1.2" strokeLinecap="round"/></svg></div>Tunable surface: models, prompts, retrieval, tools</div>
                <div className="fi"><div className="fii"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="#1A6BF5" strokeWidth="1.2"/></svg></div>Evaluation dataset, KPIs, budget &amp; convergence policy</div>
              </div>
              <div className="fc"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="fa"><path d="M8 16h16M20 10l6 6-6 6" stroke="#1A6BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              <div className="fc ec"><div className="fla">Traigent optimization engine</div><h3>Automated Search &amp; Execution</h3>
                <div className="eb"><div className="eba">&#129504; Search Brain &mdash; budget-aware exploration</div><div className="eba">&#9881; Agent Explorer &mdash; governed candidate design</div><div className="eba">&#9654; Execution Orchestrator &mdash; local or hybrid</div></div>
              </div>
              <div className="fc"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="fa"><path d="M8 16h16M20 10l6 6-6 6" stroke="#1A6BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              <div className="fc"><div className="fla">Decision intelligence</div><h3>Deliver &amp; Govern</h3>
                <div className="foi">
                  <div className="fo"><strong>Convergence &rarr; Early Stop</strong>Stop when budget is met or strong candidates emerge</div>
                  <div className="fo"><strong>Promotion + Governance</strong>Constraints, auditability, approval logic, trust</div>
                  <div className="fo"><strong>Analytics + Decision Support</strong>Parameter impact, example scoring, canonical reports</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="results" id="architecture">
          <div className="c">
            <span className="sl">Measured results</span>
            <div className="rh">
              <h2>What automated optimization actually delivers.</h2>
              <p>Actual output from a real sentiment analysis agent. Traigent explored 18 configurations and surfaced the best &mdash; in minutes, not weeks.</p>
            </div>
            <div className="rtw">
              <table className="rt">
                <thead><tr><th>Configuration</th><th>Model</th><th>Prompt type</th><th>Accuracy</th><th>Cost / exec</th><th>Latency</th></tr></thead>
                <tbody>
                  <tr className="rt2"><td><span style={{ fontWeight: 600, color: 'var(--text)' }}>Traigent optimized</span><span className="wb">&#10003; Best</span></td><td><span className="mt">gpt-5.1</span></td><td>Minimal</td><td className="ah">90.0%</td><td style={{ color: 'var(--green)', fontWeight: 500 }}>$0.00015</td><td>2.69s</td></tr>
                  <tr><td><span style={{ color: 'var(--text-2)' }}>Standard PoC (baseline)</span></td><td><span className="mt">gpt-4o</span></td><td>Role-based</td><td className="am">65.0%</td><td style={{ color: 'var(--text-2)' }}>$0.00009</td><td style={{ color: 'var(--text-2)' }}>0.69s</td></tr>
                  <tr><td><span style={{ color: 'var(--text-2)' }}>High-cost manual selection</span></td><td><span className="mt">gpt-4o</span></td><td>Minimal</td><td className="am">60.0%</td><td style={{ color: 'var(--red)' }}>$0.00100</td><td style={{ color: 'var(--text-2)' }}>2.44s</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* VALUE */}
        <section className="value">
          <div className="c">
            <span className="sl">Value proposition</span>
            <div className="vh"><h2>Ship faster. Spend less. Stay in control.</h2><p>Three outcomes enterprise GenAI teams can&rsquo;t get from observability tools or manual prompt engineering.</p></div>
            <div className="vg">
              <div className="vc"><div className="vi"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10l4 4 10-8" stroke="#1A6BF5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div><h3>Efficiency</h3><p>Eliminate inaccurate, slow, and expensive agents. Traigent&rsquo;s automated routing reduces token waste and model over-spend &mdash; finding optimal configurations your team would never discover manually.</p><div className="vm"><strong>85%</strong>Reduction in token waste vs. manual configuration</div></div>
              <div className="vc"><div className="vi"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#1A6BF5" strokeWidth="1.8"/><path d="M10 6v4l3 2" stroke="#1A6BF5" strokeWidth="1.8" strokeLinecap="round"/></svg></div><h3>Time saved</h3><p>A 40&ndash;60% reduction in AI Agent SDLC. Shift from manual guesswork to automated exploration that finds the winner in minutes, not weeks of engineering cycles.</p><div className="vm"><strong>40&ndash;60%</strong>Reduction in AI Agent development lifecycle</div></div>
              <div className="vc"><div className="vi"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke="#1A6BF5" strokeWidth="1.8" strokeLinejoin="round"/></svg></div><h3>Trust &amp; safety</h3><p>Standardized, governance-approved agents with zero-touch hallucination control and bias detection. Every promoted configuration comes with an evidence-backed audit trail.</p><div className="vm"><strong>Zero-touch</strong>Hallucination control and bias detection</div></div>
            </div>
          </div>
        </section>

        {/* COMPETITIVE */}
        <section className="comp" id="competitive">
          <div className="c">
            <span className="sl">Why Traigent</span>
            <div className="comph">
              <h2>They report.<br /><em>We fix.</em></h2>
              <p>Observability and evaluation tools tell you something is wrong. Traigent is the only infrastructure layer that automatically makes it right &mdash; continuously.</p>
            </div>
            <div className="ctw">
              <table className="ct">
                <thead><tr><th>Layer</th><th>Existing tools</th><th>Their approach</th><th className="tht">Traigent advantage</th></tr></thead>
                <tbody>
                  <tr><td><div className="ln">Observability</div><div className="lt3">LangSmith, Arize, Datadog</div></td><td style={{ color: 'var(--text-2)' }}>LangSmith, Arize</td><td className="cs">Show dashboards and traces. Surface failures after they happen.</td><td className="tdt"><span className="ca">Active remediation &mdash; not just visibility</span></td></tr>
                  <tr><td><div className="ln">Evaluation</div><div className="lt3">Braintrust, Galileo, RAGAS</div></td><td style={{ color: 'var(--text-2)' }}>Braintrust, Galileo</td><td className="cs">Grade outputs. Score accuracy and relevance. Still requires manual action.</td><td className="tdt"><span className="ca">Automatic improvement, not just grading</span></td></tr>
                  <tr><td><div className="ln">Optimization</div><div className="lt3">DataRobot, NeMo, manual tuning</div></td><td style={{ color: 'var(--text-2)' }}>DataRobot, Nvidia NeMo</td><td className="cs">Heavy ML-ops focus. Requires data science expertise. Not agent-specific.</td><td className="tdt"><span className="ca">Deeper agent-specific reasoning, no ML-ops team needed</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PERSONAS */}
        <section className="personas" id="personas">
          <div className="c">
            <span className="sl">Built for every stakeholder</span>
            <div className="persh"><h2>One platform. Three kinds of value.</h2><p>Traigent serves developers, operators, and executives &mdash; because AI agents touch all three layers of an organization.</p></div>
            <div className="persg">
              <div className="persc"><div className="pt">Developer &middot; SDK</div><h3>Stop guessing. Start shipping.</h3><p>Integrate the Python or JS SDK into existing agent workflows. Define the configuration space, set evaluation datasets, and let the optimizer do the search.</p><div className="pf"><div className="pfi"><span className="pch">&#10003;</span>Python SDK + REST API</div><div className="pfi"><span className="pch">&#10003;</span>Local, JS bridge, or hybrid API execution</div><div className="pfi"><span className="pch">&#10003;</span>Multi-objective optimization (accuracy, cost, latency)</div><div className="pfi"><span className="pch">&#10003;</span>Out-of-band &mdash; no latency impact on production</div></div></div>
              <div className="persc"><div className="pt">No-code &middot; Studio</div><h3>Tune without writing a line of code.</h3><p>Traigent Studio gives product and operations teams a visual interface to define goals, review candidates, approve promotions, and monitor agent health.</p><div className="pf"><div className="pfi"><span className="pch">&#10003;</span>Visual optimization Studio UI</div><div className="pfi"><span className="pch">&#10003;</span>One-click approval and governance workflow</div><div className="pfi"><span className="pch">&#10003;</span>Side-by-side configuration comparison</div><div className="pfi"><span className="pch">&#10003;</span>Example scoring and canonical reports</div></div></div>
              <div className="persc"><div className="pt">Business stakeholder &middot; ROI</div><h3>Make AI spend defensible.</h3><p>Every optimization run produces an evidence-backed report: accuracy gain, cost delta, latency change, governance status. A clear line from AI investment to outcome.</p><div className="pf"><div className="pfi"><span className="pch">&#10003;</span>ROI dashboards with before/after metrics</div><div className="pfi"><span className="pch">&#10003;</span>Audit-ready governance and approval logs</div><div className="pfi"><span className="pch">&#10003;</span>Budget-aware exploration with hard cost caps</div><div className="pfi"><span className="pch">&#10003;</span>Business KPI alignment &mdash; not just model metrics</div></div></div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="team">
          <div className="c">
            <span className="sl">Founding team</span>
            <div className="teamh"><h2>Research-led. Operations-proven.</h2><p>A founding team that combines peer-reviewed AI research, enterprise infrastructure at scale, and serial startup execution.</p></div>
            <div className="teamg">
              <div className="teamc"><div className="tav">NB</div><div className="tro">Founder</div><div className="tnm">Dr. Nimrod Busany</div><div className="tbi">15+ years as a research leader. PhD Computer Science (Technion/TAU). Expert in AI/ML optimization with 20+ publications including CAIN&rsquo;26, ICSE&rsquo;25, NLBSE&rsquo;25. IEEE/ACM Committee Member.</div><div className="ttg"><span className="ttag">AI/ML Optimization</span><span className="ttag">PhD Technion/TAU</span><span className="ttag">IEEE/ACM</span><span className="ttag">20+ Publications</span></div></div>
              <div className="teamc"><div className="tav">AS</div><div className="tro">Co-founder &amp; CEO</div><div className="tnm">Achi Solomon</div><div className="tbi">20+ years as a global leader. BA Computer Science. Deep experience in Infra, Backend, DevOps, QA, and DBA. Scaled cloud platforms to 99.9% availability and reduced cloud spend by 40%.</div><div className="ttg"><span className="ttag">Cloud Infrastructure</span><span className="ttag">99.9% Availability</span><span className="ttag">DevX &amp; Platform</span><span className="ttag">40% Cost Reduction</span></div></div>
              <div className="teamc"><div className="tav">MS</div><div className="tro">Co-founder &amp; CTO</div><div className="tnm">Michael Sokolski</div><div className="tbi">30+ years in software engineering. BSc Computer Science &amp; MBA (Technion). CEO and CTO in multiple companies. Extensive experience leading startups and global corporates in R&amp;D and AI.</div><div className="ttg"><span className="ttag">Serial Founder</span><span className="ttag">MBA Technion</span><span className="ttag">Global Enterprise</span><span className="ttag">AI Solutions</span></div></div>
            </div>
          </div>
        </section>

        {/* TRACTION */}
        <section className="traction" id="traction">
          <div className="c">
            <span className="sl">Research &amp; traction</span>
            <div className="trh"><h2>Built on peer-reviewed AI research.</h2><p>Traigent&rsquo;s optimization methods are purpose-built for agentic systems by researchers presenting at the world&rsquo;s top AI engineering conferences.</p></div>
            <div className="trg">
              <div className="trcs">
                <div className="cc"><div className="cic">&#128300;</div><div><div className="cnm">CAIN 2026 &mdash; IEEE/ACM</div><div className="cdt">5th International Conference on AI Engineering &middot; Rio de Janeiro. Presenting Traigent&rsquo;s multi-objective optimization framework for agentic systems.</div></div></div>
                <div className="cc"><div className="cic">&#9889;</div><div><div className="cnm">ICSE 2025 &mdash; Software Engineering</div><div className="cdt">International Conference on Software Engineering. Research on AI agent evaluation and continuous improvement infrastructure.</div></div></div>
                <div className="cc"><div className="cic">&#129309;</div><div><div className="cnm">MLOps Community Summit</div><div className="cdt">Responsible AI Community Summit. Presenting governance-first approaches to enterprise agent deployment at scale.</div></div></div>
                <div className="cc"><div className="cic">&#128196;</div><div><div className="cnm">NLBSE 2025</div><div className="cdt">Workshop on NLP-based Software Engineering. Research on automated prompt optimization and agent configuration search.</div></div></div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
                <div style={{ fontFamily: 'var(--fh)', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Peer-reviewed research</div>
                <div className="pc2">20+</div>
                <div style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.6 }}>Published papers in AI/ML optimization &mdash; the scientific foundation of Traigent&rsquo;s optimization engine.</div>
                <div className="ptg"><span className="pta">AI Optimization</span><span className="pta">Agent Evaluation</span><span className="pta">Prompt Engineering</span><span className="pta">Multi-objective Search</span><span className="pta">GenAI Governance</span><span className="pta">LLM Benchmarking</span></div>
                <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: '16px' }}>Team credentials</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.9 }}>IEEE / ACM Committee Member<br />PhD Computer Science &middot; Technion / TAU<br />BSc CS + MBA &middot; Technion<br />99.9% platform availability track record<br />40% cloud cost reduction at scale</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ctas">
          <div className="cgl"></div>
          <div className="c">
            <h2>Let&rsquo;s build the future<br />of <em>trusted AI</em> together.</h2>
            <p>Request the full pitch deck, or schedule a 30-minute call with the founding team.</p>
            <div className="ctab">
              <a href="mailto:info@traigent.ai" className="btn bp bpl">Request the pitch deck &rarr;</a>
              <a href="mailto:info@traigent.ai" className="btn bg bgl">Schedule a call</a>
            </div>
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '16px', textAlign: 'center' }}>Reach us directly</div>
              <div className="contacts-box">
                <div className="cr"><span className="crn">Dr. Nimrod Busany &mdash; Founder</span><a href="mailto:nimrod@traigent.ai" className="cre">nimrod@traigent.ai</a></div>
                <div className="cr"><span className="crn">Achi Solomon &mdash; Co-founder &amp; CEO</span><a href="mailto:achi@traigent.ai" className="cre">achi@traigent.ai</a></div>
                <div className="cr"><span className="crn">Michael Sokolski &mdash; Co-founder &amp; CTO</span><a href="mailto:michael@traigent.ai" className="cre">michael@traigent.ai</a></div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="c">
            <div className="ft">
              <div className="fb">
                <a href="/" className="logo">
                  <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png" alt="Traigent" height="20" style={{ display: 'block', height: '20px', width: 'auto' }} />
                </a>
                <p>The continuous optimization infrastructure for enterprise GenAI. Trust your AI agent at scale.</p>
              </div>
              <div className="fcl">
                <h4>This document</h4>
                <a href="#market" onClick={(e) => { e.preventDefault(); document.getElementById('market')?.scrollIntoView({ behavior: 'smooth' }) }}>Market opportunity</a>
                <a href="#solution" onClick={(e) => { e.preventDefault(); document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' }) }}>Product</a>
                <a href="#competitive" onClick={(e) => { e.preventDefault(); document.getElementById('competitive')?.scrollIntoView({ behavior: 'smooth' }) }}>Differentiation</a>
                <a href="#traction" onClick={(e) => { e.preventDefault(); document.getElementById('traction')?.scrollIntoView({ behavior: 'smooth' }) }}>Team &amp; research</a>
              </div>
              <div className="fcl">
                <h4>Research</h4>
                <a href="#traction" onClick={(e) => { e.preventDefault(); document.getElementById('traction')?.scrollIntoView({ behavior: 'smooth' }) }}>Publications</a>
                <a href="#traction" onClick={(e) => { e.preventDefault(); document.getElementById('traction')?.scrollIntoView({ behavior: 'smooth' }) }}>CAIN 2026</a>
                <a href="#traction" onClick={(e) => { e.preventDefault(); document.getElementById('traction')?.scrollIntoView({ behavior: 'smooth' }) }}>ICSE 2025</a>
              </div>
              <div className="fcl">
                <h4>Contact</h4>
                <a href="mailto:info@traigent.ai">info@traigent.ai</a>
              </div>
            </div>
            <div className="fbot">
              <div className="fbl">&copy; 2025 Traigent. All rights reserved.</div>
              <div className="fbr">
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
