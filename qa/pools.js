const fs=require('fs');const{JSDOM,VirtualConsole}=require('jsdom');
const vc=new VirtualConsole();
const dom=new JSDOM(fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8'),{runScripts:'dangerously',url:'https://x.test/',virtualConsole:vc});
const w=dom.window;
const VOCAL=new RegExp("\\\\b(vocal|vocals|voice|voices|vocalist|singer|singers|singing|sings|sung|scream|screams|screaming|screamed|chant|chants|chanting|chanted|choir|choirs|choral|spoken|speaking|speech|lyric|lyrics|lyrical|whisper|whispers|whispering|shout|shouts|shouting|verse|verses|chorus|acapella|a capella|rapper|rappers|rapping|humming|hummed|vox)\\\\b","i");
const BAD=["minimal","minimalist","minimalism","sparse","restrained","low-energy","low energy","weak","tiny","gentle","quiet"];
const pools={CONCEPT:w.NF.CONCEPT};
let hits=[];
function chk(label,arr){arr.forEach(s=>{ if(typeof s!=="string")return;
  if(VOCAL.test(s)) hits.push([label,"VOCAL",s]);
  const l=s.toLowerCase(); BAD.forEach(b=>{if(l.includes(b)) hits.push([label,"MINIMAL:"+b,s]);});});}
for(const k in w.NF.CONCEPT) chk("CONCEPT."+k, w.NF.CONCEPT[k]);
chk("STYLES", w.NF.STYLES.map(x=>x.n));
chk("LAYERS", w.NF.LAYERS.map(x=>x.phrase));
chk("SCALES", w.NF.SCALES.map(x=>x.mood));
// scrape remaining top-level string arrays out of source
const src=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
for(const m of src.matchAll(/const ([A-Z_]+) = \[([\s\S]*?)\n\];/g)){
  const items=[...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(x=>x[1]);
  chk(m[1], items);
}
if(hits.length){console.log("PROBLEM WORDS IN POOLS:");hits.forEach(h=>console.log(" ",h[0],"|",h[1],"|",h[2]));}
else console.log("All pools clean of vocal + minimal language.");
console.log("total hits:",hits.length);
