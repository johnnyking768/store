import { useEffect, useState } from 'react';
import { site } from '../config/site';
export default function SaleCountdown() {
 const [now,setNow] = useState(Date.now());
 const end = Date.parse(site.saleEndsAt || '');
 useEffect(()=>{if(!Number.isFinite(end))return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[end]);
 if (!Number.isFinite(end)) return <p className="sale-countdown">Explore sample offers. Confirm current discounts with the store.</p>;
 const seconds = Math.max(0,Math.floor((end-now)/1000));
 return <div className="sale-countdown"><strong>{seconds ? 'Flash sale ends in' : 'This flash sale has ended'}</strong>{seconds > 0 && <span role="timer">{Math.floor(seconds/86400)}d {Math.floor(seconds/3600)%24}h {Math.floor(seconds/60)%60}m {seconds%60}s</span>}<p>Confirm current prices and availability before ordering.</p></div>;
}

