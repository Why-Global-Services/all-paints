import{a as k}from"./chunk-PT6TDUZY.js";import{Aa as i,Ba as n,Ca as p,Eb as y,H as u,Hb as R,Ia as f,J as O,Jb as B,O as P,Sa as c,Ta as x,Ua as C,Wa as E,Ya as M,Za as T,ba as r,d as h,mb as A,qa as _,sa as S,sb as N,ua as b,ub as I,wa as v,xa as s,ya as m,za as d}from"./chunk-HVBQXB2O.js";function L(e,a){if(e&1&&(i(0,"div",10)(1,"h3"),c(2),n(),i(3,"div",13)(4,"h3"),c(5),n()()()),e&2){let t=a.$implicit;r(2),x(t.asiaN_PAINTS),r(3),C("\u20B9",t.asian_details[0].price,"")}}function w(e,a){e&1&&(i(0,"p"),c(1,"NA"),n())}function F(e,a){if(e&1&&(i(0,"h3"),c(1),n(),i(2,"div",13)(3,"h3"),c(4),n()()),e&2){let t=f().$implicit;r(),x(t.bergeR_PAINTS),r(3),C("\u20B9",t.bergeR_details[0].price,"")}}function G(e,a){if(e&1&&(i(0,"div",10),_(1,w,2,0,"p")(2,F,5,2),n()),e&2){let t=a.$implicit;b("na-box",t["BERGER PAINTS"]=="NA"),r(),v(1,t["BERGER PAINTS"]=="NA"?1:t["BERGER PAINTS"]!=="NA"?2:-1)}}function D(e,a){e&1&&(i(0,"p"),c(1,"NA"),n())}function j(e,a){if(e&1&&(i(0,"h3"),c(1),n(),i(2,"div",13)(3,"h3"),c(4),n()()),e&2){let t=f().$implicit;r(),x(t.jN_PAINTS),r(3),C("\u20B9",t.jN_details[0].price,"")}}function Y(e,a){if(e&1&&(i(0,"div",10),_(1,D,2,0,"p")(2,j,5,2),n()),e&2){let t=a.$implicit;b("na-box",t["J&N PAINTS"]=="NA"),r(),v(1,t["J&N PAINTS"]=="NA"?1:t["J&N PAINTS"]!=="NA"?2:-1)}}function $(e,a){e&1&&(i(0,"div",12)(1,"p"),c(2,"NA"),n()())}function J(e,a){if(e&1&&(i(0,"div",1)(1,"div",2)(2,"div",3),p(3,"img",4),n(),i(4,"div",3),p(5,"img",5),n(),i(6,"div",3),p(7,"img",6),n(),i(8,"div",3),p(9,"img",7),n()(),i(10,"div",8)(11,"div",9),m(12,L,6,2,"div",10,s),n(),i(14,"div",9),m(15,G,3,3,"div",11,s),n(),i(17,"div",9),m(18,Y,3,3,"div",11,s),n(),i(20,"div",9),m(21,$,3,0,"div",12,s),n()()()),e&2){let t=f();r(12),d(t.final),r(3),d(t.final),r(3),d(t.final),r(3),d(t.final)}}var ee=(()=>{let a=class a{constructor(){this.activatedRoute=u(y),this.data=new h([]).asObservable(),this.arData=[],this.api=u(k),this.final=[]}ngOnInit(){this.data&&this.subscribeToData()}ngOnChanges(o){o.data&&this.data&&this.subscribeToData()}subscribeToData(){this.dataSubscription&&this.dataSubscription.unsubscribe(),this.dataSubscription=this.data.subscribe(o=>{this.final=o})}getAll(){this.api.getAllProducts("").subscribe(o=>{this.data=JSON.parse(o),this.filterData()})}filterData(){this.arData.forEach(o=>{let l=this.final.findIndex(g=>o.CATEGORY==g.CATEGORY&&o["SUB CATEGORY"]==g.SUB_CATEGORY);l>-1?this.final[l].items.push(o):this.final.push({CATEGORY:o.CATEGORY,SUB_CATEGORY:o["SUB CATEGORY"],items:[o]})})}};a.\u0275fac=function(l){return new(l||a)},a.\u0275cmp=O({type:a,selectors:[["list-compare"]],inputs:{data:"data"},standalone:!0,features:[P,E],decls:2,vars:3,consts:[["class","all-box",4,"ngIf"],[1,"all-box"],[1,"image-container"],[1,"img-box"],["src","../../../assets/images/ap.png","alt",""],["src","../../../assets/images/berger.png","alt","","srcset",""],["src","../../../assets/images/jandN.png","alt","","srcset",""],["src","../../../assets/images/sheenlac.png","alt","","srcset",""],[1,"image-container","img-grid"],[1,"img-col"],["routerLink","/home","fragment","detail",1,"p-box"],["routerLink","/home","fragment","detail",1,"p-box",3,"na-box"],[1,"p-box","na-box"],[1,"flex","items-center","gap-[10px]"]],template:function(l,g){l&1&&(_(0,J,23,0,"div",0),M(1,"async")),l&2&&S("ngIf",T(1,1,g.data))},dependencies:[I,A,N,B,R],styles:[".all-box[_ngcontent-%COMP%]{border:1px solid rgba(0,0,0,.26);width:100%}.image-container[_ngcontent-%COMP%]{width:100%;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;border-radius:10px}.image-container[_ngcontent-%COMP%]   .img-col[_ngcontent-%COMP%], .image-container[_ngcontent-%COMP%]   .img-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:10px 0}.image-container[_ngcontent-%COMP%]   .img-col[_ngcontent-%COMP%]   .img-box[_ngcontent-%COMP%], .image-container[_ngcontent-%COMP%]   .img-box[_ngcontent-%COMP%]   .img-box[_ngcontent-%COMP%]{height:150px;display:flex;align-items:center;justify-content:center}.image-container[_ngcontent-%COMP%]   .p-box[_ngcontent-%COMP%]{height:90px;width:100%;background-color:#fff;border:1px solid rgba(0,0,0,.26);box-shadow:#00000026 0 2px 8px;padding:0 10px;display:flex;flex-direction:column;align-items:flex-start;cursor:pointer;justify-content:space-evenly}.image-container[_ngcontent-%COMP%]   .p-box[_ngcontent-%COMP%]   .stk[_ngcontent-%COMP%]{text-decoration:line-through}.image-container[_ngcontent-%COMP%]   .p-box[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{align-self:center}.image-container[_ngcontent-%COMP%]   .p-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:700;font-size:20px}.image-container[_ngcontent-%COMP%]   .p-box[_ngcontent-%COMP%]:nth-child(odd){background-color:var(--sec)}.image-container[_ngcontent-%COMP%]   .na-box[_ngcontent-%COMP%]{align-items:center;justify-content:center;font-weight:700;font-size:21px}.img-grid[_ngcontent-%COMP%]{height:850px;overflow-y:auto}*[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}*[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:var(--prim);border-radius:35px}"]});let e=a;return e})();export{ee as a};
