const fs=require('fs');
const path=require('path');
const marked=require('./marked.js');
const hljs=require('../node_modules/highlight.js');
__dirname=path.join(__dirname,'../');

const renderer = {
    heading(text, level) {
        return `<a name="${justtext(text)}"></a><h${level}>${text}</h${level}>`
    },
    code(code, infostring, escaped){
        if(infostring){
            return `<pre><code class="hljs hljs-${infostring}">${hljs.highlight(code,{
                language:infostring
            }).value}</code></pre>`
        }else{
            return `<pre><code class="hljs">${code}</code></pre>`
        }
    }
}
marked.use({
    renderer
})

function justtext(text){
    return text.replace(/<[^>]+>/g,'')
}

let comments=JSON.parse(fs.readFileSync(path.join(__dirname,'comments.json')).toString());
let root='/docs';
let navhtml='';
for(let group in comments){
    navhtml+='<li><div class="title">'+group+'</div><ul>';
    for(let item of comments[group]){
        navhtml+=`<li><a href="${root}/${group}/${item}.html">${item}</a></li>`
    }
    navhtml+='</ul></li>'
}


let mb=fs.readFileSync(path.join(__dirname,'build/mb.html')).toString();

for(let group in comments){
    try {
        fs.opendirSync(path.join('docs',group))
    } catch (error) {
        fs.mkdirSync(path.join('docs',group));
    }
    for(let item of comments[group]){
        let h=mb.replace('{{title}}',item)
        .replace('{{nav}}',navhtml)
        .replace(`/${group}/${item}.html"`,`/${group}/${item}.html" class="act"`)
        .replace('{{content}}',marked.parse(fs.readFileSync(path.join(__dirname,'src',group,item+'.md')).toString()||`# ${item}
正在施工中。。。`));
        fs.writeFileSync(path.join(__dirname,'docs',group,item+'.html'),h);
    }
}