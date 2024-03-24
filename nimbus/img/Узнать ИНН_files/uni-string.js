
(function(){var r=/\d+/g;String.prototype.paramEncode=function(){if(!/^[a-zA-Z\d\_\-\.\,]*$/.test(this)){var c=new Array(this.length);for(var i=0;i<this.length;i++)
c[i]=this.charCodeAt(i);return'_ENC_'+c.join('A');}else{return this;}}
String.prototype.paramDecode=function(){if(this.substr(0,5)!='_ENC_')return this;var c=this.substr(5).match(r);return String.fromCharCode.apply(null,c);}
String.prototype.endsWith=function(suffix){return this.indexOf(suffix,this.length-suffix.length)!==-1;};String.prototype.removeEnd=function(suffix){if(this.endsWith(suffix)){return this.substr(0,this.length-suffix.length);}else{return this;}};String.prototype.htmlEncode=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");}
String.prototype.htmlDecode=function(){return this.replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");}
String.prototype.hashCode=function(){var hash=0,i,chr;if(this.length===0)return hash;for(i=0;i<this.length;i++){chr=this.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}
return hash;}})();