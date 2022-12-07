f=require('fs');z=f.readFileSync('i','utf8');a=z.split`\n`;for(m=t=i=0;i<a.length;a[i]?t+=+a[i]:(t>m&&(m=t),t=0),i++){};console.log(m)
